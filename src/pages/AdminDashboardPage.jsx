import React, { useEffect, useMemo, useState } from 'react'

const ADMIN_SESSION_KEY = 'portfolioAdminSession'
const ADMIN_TOKEN_KEY = 'portfolioAdminToken'

async function fetchProtected(url, options = {}) {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Request failed.')
  }

  return data
}

export default function AdminDashboardPage() {
  const [messages, setMessages] = useState([])
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  useEffect(() => {
    async function loadAdminData() {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
      if (!token) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      try {
        const session = await fetchProtected('http://localhost:3001/api/admin/session')
        if (session.authenticated) {
          sessionStorage.setItem(ADMIN_SESSION_KEY, 'admin')
          setAuthorized(true)
          const conversations = await fetchProtected('http://localhost:3001/api/conversations')
          setMessages(
            conversations.map((conversation) => ({
              id: conversation.id,
              name: conversation.visitorName,
              email: conversation.visitorEmail,
              subject: conversation.subject,
              message: conversation.latestMessage,
              date: conversation.updatedAt,
              read: conversation.unreadCount === 0,
              starred: false,
            }))
          )
        } else {
          setAuthorized(false)
        }
      } catch (err) {
        console.error('Admin session blocked:', err)
        setAuthorized(false)
        sessionStorage.removeItem(ADMIN_SESSION_KEY)
        sessionStorage.removeItem(ADMIN_TOKEN_KEY)
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [])

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    setAuthorized(false)
  }

  const stats = useMemo(() => {
    const total = messages.length
    const read = messages.filter((m) => m.read).length
    const unread = total - read
    const starred = messages.filter((m) => m.starred).length
    return { total, read, unread, starred }
  }, [messages])

  const filtered = useMemo(() => {
    let arr = [...messages]
    if (filter === 'unread') arr = arr.filter((m) => !m.read)
    if (filter === 'read') arr = arr.filter((m) => m.read)
    if (filter === 'starred') arr = arr.filter((m) => m.starred)
    const qq = q.trim().toLowerCase()
    if (qq) {
      arr = arr.filter((m) => `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(qq))
    }
    arr.sort((a, b) => new Date(b.date) - new Date(a.date))
    return arr
  }, [messages, filter, q])

  const renderTable = () => {
    if (messages.length === 0) {
      return <div className="empty-state">No messages yet</div>
    }

    if (filtered.length === 0) {
      return <div className="message-table-empty">No messages match your filter/search.</div>
    }

    return (
      <div className="message-table">
        <div className="message-table-header">
          <span>From</span>
          <span>Subject</span>
          <span>Date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="message-table-body">
          {filtered.map((msg) => (
            <div key={msg.id} className="message-table-row" data-id={msg.id}>
              <div className="cell">
                <div className="from-name">{msg.name}</div>
                <div className="from-email">{msg.email}</div>
              </div>
              <div className="cell">
                <div className="subject">{msg.subject}</div>
              </div>
              <div className="cell">
                <span className="date">{new Date(msg.date).toLocaleString()}</span>
              </div>
              <div className="cell">
                <span className={`status-pill ${msg.read ? 'status-read' : 'status-unread'}`}>{msg.read ? 'Read' : 'Unread'}</span>
              </div>
              <div className="cell actions">
                <button
                  className="btn btn-secondary btn-small"
                  type="button"
                  onClick={async () => {
                    try {
                      const nextValue = !msg.read
                      await fetchProtected(`http://localhost:3001/api/conversations/${msg.id}/read`, {
                        method: 'PATCH',
                        body: JSON.stringify({ read: nextValue }),
                      })
                      setMessages((current) => current.map((item) => (item.id === msg.id ? { ...item, read: nextValue } : item)))
                    } catch (err) {
                      setError(err.message || 'Unable to update message status.')
                    }
                  }}
                >
                  <i className="fas fa-eye" /> {msg.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  className="btn btn-danger btn-small"
                  type="button"
                  onClick={async () => {
                    try {
                      await fetchProtected(`http://localhost:3001/api/messages/${msg.id}`, { method: 'DELETE' })
                      setMessages((current) => current.filter((item) => item.id !== msg.id))
                    } catch (err) {
                      setError(err.message || 'Unable to delete this message.')
                    }
                  }}
                >
                  <i className="fas fa-trash" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <section className="admin-hero" id="main-content">
        <div className="container">
          <h1>
            <i className="fas fa-user-shield" /> Admin Dashboard
          </h1>
          <p className="subtitle">Secure admin area protected by server-side authentication.</p>
          <div className="admin-login" style={{ marginTop: 18 }}>
            <div className="admin-login-inner">
              <h2>
                <i className="fas fa-user-lock" /> Admin Login
              </h2>
              <p className="subtitle">Enter your admin credentials to manage messages.</p>
              <div className="admin-login-note" style={{ marginBottom: '1rem', color: '#fff' }}>
                Use the same username and password configured for the server.
              </div>
              {error ? <div style={{ marginBottom: 14, color: '#ffb3b3' }}>{error}</div> : null}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return <div className="app-loading" />
  }

  return (
    <section className="admin-hero" id="main-content">
      <div className="container">
        <div className="admin-hero-top">
          <div>
            <h1>
              <i className="fas fa-user-shield" /> Admin Dashboard
            </h1>
            <p className="subtitle">Manage portfolio conversations securely.</p>
          </div>
          <div className="admin-hint">
            <i className="fas fa-lock" /> <span>Authentication + authorization enabled.</span>
          </div>
        </div>

        {error ? <div style={{ marginBottom: 18, color: '#ffb3b3' }}>{error}</div> : null}

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-inbox" />
            </div>
            <div>
              <h3>{stats.total}</h3>
              <p>Total Messages</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle" />
            </div>
            <div>
              <h3>{stats.read}</h3>
              <p>Read</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock" />
            </div>
            <div>
              <h3>{stats.unread}</h3>
              <p>Unread</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-sign-out-alt" />
            </div>
            <div>
              <button className="btn btn-secondary" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="admin-controls">
          <div className="filter-group">
            <label htmlFor="adminFilter">Filter</label>
            <select id="adminFilter" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="adminSearch">Search</label>
            <input
              id="adminSearch"
              type="text"
              placeholder="Name, email, subject..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-list" id="messagesContainer">
          {renderTable()}
        </div>
      </div>
    </section>
  )
}

