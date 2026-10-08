import 'dotenv/config'
import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 3001)
const databaseDirectory = path.join(__dirname, 'data')
const databaseFile = path.join(databaseDirectory, 'database.json')
const adminUsername = String(process.env.ADMIN_USERNAME || '').trim()
const adminPassword = String(process.env.ADMIN_PASSWORD || '').trim()
const sessionSecret = String(process.env.SESSION_SECRET || '').trim()
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5175,http://127.0.0.1:5175,http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000').split(',').map((value) => value.trim()).filter(Boolean)

if (!adminUsername || !adminPassword || !sessionSecret) {
  console.warn('Missing ADMIN_USERNAME, ADMIN_PASSWORD, or SESSION_SECRET in .env. The API will not authenticate until these are set.')
}

export const app = express()
app.use(express.json({ limit: '1mb' }))
app.use((request, response, next) => {
  const origin = request.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Credentials', 'true')
  }
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (request.method === 'OPTIONS') {
    response.sendStatus(204)
    return
  }
  next()
})

const adminTokens = new Map()

async function readDatabase() {
  try {
    const raw = await fs.readFile(databaseFile, 'utf8')
    const data = JSON.parse(raw)
    if (!Array.isArray(data.messages)) data.messages = []
    if (!Array.isArray(data.conversations)) data.conversations = []
    return data
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return { messages: [], conversations: [] }
  }
}

async function writeDatabase(database) {
  await fs.mkdir(databaseDirectory, { recursive: true })
  await fs.writeFile(databaseFile, `${JSON.stringify(database, null, 2)}\n`)
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/<script|<iframe|<object|<embed/gi, '')
    .replace(/[<>]/g, '')
    .trim()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

function createMessageRecord(payload) {
  const createdAt = new Date().toISOString()
  return {
    id: randomUUID(),
    conversationId: payload.conversationId,
    senderType: payload.senderType,
    name: normalizeText(payload.name),
    email: normalizeText(payload.email),
    subject: normalizeText(payload.subject),
    content: normalizeText(payload.content),
    createdAt,
    updatedAt: createdAt,
    read: Boolean(payload.read),
  }
}

function buildConversationSummary(conversation) {
  const lastMessage = conversation.messages.at(-1) || null
  return {
    id: conversation.id,
    visitorName: conversation.visitorName,
    visitorEmail: conversation.visitorEmail,
    subject: conversation.subject,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    unreadCount: conversation.messages.filter((message) => !message.read && message.senderType !== 'admin').length,
    latestMessage: lastMessage ? lastMessage.content : '',
    latestSender: lastMessage ? lastMessage.senderType : 'visitor',
    messageCount: conversation.messages.length,
  }
}

function getTokenFromAuthHeader(headerValue) {
  if (!headerValue) return null
  const match = /^Bearer\s+(.+)$/i.exec(headerValue)
  return match ? match[1] : null
}

function signToken(token) {
  return createHmac('sha256', sessionSecret).update(token).digest('hex')
}

function verifyToken(token) {
  if (!token) return null
  const [rawToken, signature] = token.split('.')
  if (!rawToken || !signature) return null
  const expected = signToken(rawToken)
  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(signature)
  if (expectedBuffer.length !== providedBuffer.length) return null
  try {
    timingSafeEqual(expectedBuffer, providedBuffer)
    return rawToken
  } catch {
    return null
  }
}

function createAdminSession() {
  const token = randomUUID()
  const signed = `${token}.${signToken(token)}`
  adminTokens.set(signed, {
    username: adminUsername,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  })
  return signed
}

function hashIdentifier(value) {
  return createHmac('sha256', sessionSecret).update(String(value)).digest('hex')
}

function requireAdmin(request, response, next) {
  const headerToken = getTokenFromAuthHeader(request.headers.authorization)
  const sessionToken = headerToken || (request.headers['x-admin-token'] || null)
  if (!sessionToken) {
    response.status(401).json({ error: 'Admin authentication required.' })
    return
  }

  const verified = verifyToken(sessionToken)
  if (!verified) {
    response.status(401).json({ error: 'Invalid or expired admin session.' })
    return
  }

  const session = adminTokens.get(sessionToken)
  if (!session || session.expiresAt < Date.now()) {
    adminTokens.delete(sessionToken)
    response.status(401).json({ error: 'Admin session expired.' })
    return
  }

  request.admin = session
  next()
}

function getConversationById(database, conversationId) {
  return database.conversations.find((conversation) => conversation.id === conversationId)
}

function createConversation(database, payload) {
  const createdAt = new Date().toISOString()
  const visitorName = normalizeText(payload.name)
  const visitorEmail = normalizeText(payload.email).toLowerCase()
  const subject = normalizeText(payload.subject)
  const content = normalizeText(payload.content)
  const conversation = {
    id: randomUUID(),
    visitorName,
    visitorEmail,
    subject,
    createdAt,
    updatedAt: createdAt,
    messages: [
      {
        id: randomUUID(),
        conversationId: null,
        senderType: 'visitor',
        name: visitorName,
        email: visitorEmail,
        subject,
        content,
        createdAt,
        updatedAt: createdAt,
        read: false,
      },
    ],
  }
  conversation.messages[0].conversationId = conversation.id
  return conversation
}

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.post('/api/admin/login', async (request, response) => {
  const username = String(request.body?.username || '').trim()
  const password = String(request.body?.password || '').trim()
  if (!username || !password) {
    response.status(400).json({ error: 'Username and password are required.' })
    return
  }

  if (username !== adminUsername || password !== adminPassword) {
    response.status(401).json({ error: 'Invalid admin credentials.' })
    return
  }

  const token = createAdminSession()
  response.json({
    success: true,
    token,
    user: { username: adminUsername },
  })
})

app.post('/api/admin/logout', requireAdmin, (request, response) => {
  const headerToken = getTokenFromAuthHeader(request.headers.authorization)
  const sessionToken = headerToken || request.headers['x-admin-token'] || null
  if (sessionToken) adminTokens.delete(sessionToken)
  response.json({ success: true })
})

app.get('/api/admin/session', requireAdmin, (_request, response) => {
  response.json({ authenticated: true, user: { username: adminUsername } })
})

app.get('/api/messages', async (_request, response, next) => {
  try {
    const database = await readDatabase()
    const messages = [...database.messages, ...database.conversations.flatMap((conversation) => conversation.messages)]
    response.json(messages)
  } catch (error) {
    next(error)
  }
})

app.post('/api/messages', async (request, response, next) => {
  const body = request.body || {}
  const name = String(body.name || '').trim()
  const email = String(body.email || '').trim()
  const subject = String(body.subject || '').trim()
  const content = String(body.message || '').trim()

  if (!name || !email || !subject || !content) {
    response.status(400).json({ error: 'Name, email, subject, and message are required.' })
    return
  }

  if (!isValidEmail(email)) {
    response.status(400).json({ error: 'Please provide a valid email address.' })
    return
  }

  try {
    const database = await readDatabase()
    const sanitizedName = normalizeText(name)
    const sanitizedEmail = normalizeText(email).toLowerCase()
    const sanitizedSubject = normalizeText(subject)
    const sanitizedContent = normalizeText(content)

    if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedContent) {
      response.status(400).json({ error: 'Invalid message content.' })
      return
    }

    let conversation = database.conversations.find((item) => {
      return item.visitorEmail === sanitizedEmail && item.subject === sanitizedSubject
    })

    if (!conversation) {
      conversation = createConversation(database, {
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        content: sanitizedContent,
      })
      database.conversations.push(conversation)
    } else {
      const message = createMessageRecord({
        conversationId: conversation.id,
        senderType: 'visitor',
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        content: sanitizedContent,
        read: false,
      })
      conversation.messages.push(message)
      conversation.updatedAt = new Date().toISOString()
    }

    await writeDatabase(database)
    const result = conversation.messages.at(-1)
    response.status(201).json({
      id: result.id,
      message: result,
      conversationId: conversation.id,
      success: true,
    })
  } catch (error) {
    next(error)
  }
})

app.get('/api/conversations', requireAdmin, async (_request, response, next) => {
  try {
    const database = await readDatabase()
    const conversations = [...database.conversations]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(buildConversationSummary)
    response.json(conversations)
  } catch (error) {
    next(error)
  }
})

app.get('/api/conversations/:conversationId', requireAdmin, async (request, response, next) => {
  try {
    const database = await readDatabase()
    const conversation = getConversationById(database, request.params.conversationId)
    if (!conversation) {
      response.status(404).json({ error: 'Conversation not found.' })
      return
    }

    conversation.messages.forEach((message) => {
      if (message.senderType !== 'admin') {
        message.read = true
      }
    })
    conversation.updatedAt = new Date().toISOString()
    await writeDatabase(database)
    response.json(conversation)
  } catch (error) {
    next(error)
  }
})

app.get('/api/conversations/public', async (request, response, next) => {
  try {
    const email = String(request.query.email || '').trim().toLowerCase()
    const token = String(request.query.token || '').trim()
    if (!email || !token) {
      response.status(400).json({ error: 'Email and secure token are required.' })
      return
    }

    const database = await readDatabase()
    const conversation = database.conversations.find((item) => item.visitorEmail === email)
    if (!conversation) {
      response.status(404).json({ error: 'Conversation not found.' })
      return
    }

    const expectedToken = hashIdentifier(`${conversation.id}:${email}`)
    if (token !== expectedToken) {
      response.status(403).json({ error: 'Invalid conversation access token.' })
      return
    }

    response.json(conversation)
  } catch (error) {
    next(error)
  }
})

app.post('/api/conversations/:conversationId/reply', requireAdmin, async (request, response, next) => {
  const body = request.body || {}
  const replyText = String(body.reply || '').trim()
  const adminName = String(body.adminName || 'Admin').trim() || 'Admin'
  if (!replyText) {
    response.status(400).json({ error: 'Reply message is required.' })
    return
  }

  try {
    const database = await readDatabase()
    const conversation = getConversationById(database, request.params.conversationId)
    if (!conversation) {
      response.status(404).json({ error: 'Conversation not found.' })
      return
    }

    const message = {
      id: randomUUID(),
      conversationId: conversation.id,
      senderType: 'admin',
      name: normalizeText(adminName),
      email: normalizeText(adminUsername),
      subject: conversation.subject,
      content: normalizeText(replyText),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      read: true,
    }
    conversation.messages.push(message)
    conversation.updatedAt = message.updatedAt
    await writeDatabase(database)
    response.status(201).json(message)
  } catch (error) {
    next(error)
  }
})

app.patch('/api/conversations/:conversationId/read', requireAdmin, async (request, response, next) => {
  try {
    const database = await readDatabase()
    const conversation = getConversationById(database, request.params.conversationId)
    if (!conversation) {
      response.status(404).json({ error: 'Conversation not found.' })
      return
    }

    const nextReadState = Boolean(request.body?.read)
    conversation.messages = conversation.messages.map((message) => ({
      ...message,
      read: nextReadState || message.senderType === 'admin',
    }))
    conversation.updatedAt = new Date().toISOString()
    await writeDatabase(database)
    response.json({ success: true, read: nextReadState, conversationId: conversation.id })
  } catch (error) {
    next(error)
  }
})

app.patch('/api/messages/:id', requireAdmin, async (request, response, next) => {
  try {
    const database = await readDatabase()
    const conversation = database.conversations.find((item) => item.messages.some((message) => message.id === request.params.id))
    if (!conversation) {
      response.status(404).json({ error: 'Message not found.' })
      return
    }

    const message = conversation.messages.find((item) => item.id === request.params.id)
    if (!message) {
      response.status(404).json({ error: 'Message not found.' })
      return
    }

    if (typeof request.body.read === 'boolean') message.read = request.body.read
    if (typeof request.body.starred === 'boolean') message.starred = request.body.starred
    await writeDatabase(database)
    response.json(message)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/messages/:id', requireAdmin, async (request, response, next) => {
  try {
    const database = await readDatabase()
    const conversationIndex = database.conversations.findIndex((conversation) => conversation.messages.some((message) => message.id === request.params.id))
    if (conversationIndex === -1) {
      response.status(404).json({ error: 'Message not found.' })
      return
    }

    const conversation = database.conversations[conversationIndex]
    conversation.messages = conversation.messages.filter((message) => message.id !== request.params.id)
    if (conversation.messages.length === 0) {
      database.conversations.splice(conversationIndex, 1)
    } else {
      conversation.updatedAt = new Date().toISOString()
    }
    await writeDatabase(database)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ error: 'Internal server error.' })
})

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  app.listen(port, () => {
    console.log(`Portfolio API running at http://localhost:${port}`)
    if (adminUsername && adminPassword) {
      console.log(`Admin credentials: ${adminUsername} / ${adminPassword}`)
    }
  })
}
