import test from 'node:test'
import assert from 'node:assert/strict'

async function loadServerModule() {
  process.env.ADMIN_USERNAME = 'admin'
  process.env.ADMIN_PASSWORD = 'test-password'
  const module = await import(`../server.js?test=${Date.now()}`)
  return module
}

test('visitor message flow creates a conversation and admin can reply', async () => {
  const { app } = await loadServerModule()
  const server = app.listen(0)

  try {
    const port = server.address().port
    const baseUrl = `http://127.0.0.1:${port}`

    const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'test-password' }),
    })

    assert.equal(loginResponse.status, 200)
    const loginData = await loginResponse.json()
    assert.ok(loginData.token)

    const createResponse = await fetch(`${baseUrl}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice Visitor',
        email: 'alice@example.com',
        subject: 'Project inquiry',
        message: 'Hi, I would like to hire you for a new project.',
      }),
    })

    assert.equal(createResponse.status, 201)
    const created = await createResponse.json()
    assert.ok(created.conversationId)
    assert.equal(created.message.senderType, 'visitor')

    const conversationResponse = await fetch(`${baseUrl}/api/conversations/${created.conversationId}`, {
      headers: { Authorization: `Bearer ${loginData.token}` },
    })

    assert.equal(conversationResponse.status, 200)
    const conversation = await conversationResponse.json()
    assert.equal(conversation.visitorEmail, 'alice@example.com')
    assert.equal(conversation.messages.length, 1)

    const replyResponse = await fetch(`${baseUrl}/api/conversations/${created.conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.token}`,
      },
      body: JSON.stringify({
        content: 'Thanks for reaching out — I will reply shortly.',
        senderName: 'Admin',
      }),
    })

    assert.equal(replyResponse.status, 201)
    const reply = await replyResponse.json()
    assert.equal(reply.senderType, 'admin')
    assert.equal(reply.content, 'Thanks for reaching out — I will reply shortly.')

    const fetchAfterReply = await fetch(`${baseUrl}/api/conversations/${created.conversationId}`, {
      headers: { Authorization: `Bearer ${loginData.token}` },
    })

    const updated = await fetchAfterReply.json()
    assert.equal(updated.messages.length, 2)
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }
})
