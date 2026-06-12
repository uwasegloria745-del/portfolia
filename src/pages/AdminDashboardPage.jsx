import React, { useEffect, useMemo, useState } from 'react'

const storageKey = 'portfolioMessages'
const ADMIN_SESSION_KEY = 'portfolioAdminSession'
const ADMIN_ROLE = 'admin'

function getDefaultAdminCredentials() {
  return { username: 'admin', password: 'Gloria@745123' }
}

function getAdminCredentials() {
  const username = localStorage.getItem('portfolioAdminUsername')
  const password = localStorage.getItem('portfolioAdminPassword')
  const defaults = getDefaultAdminCredentials()
  return {
    username: username || defaults.username,
    password: password || defaults.password,
  }
}

function isAuthorized() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_ROLE
  } catch {
    return false
  }
}

function saveMessages(messages) {
  localStorage.setItem(storageKey, JSON.stringify(messages))
}

export default function AdminDashboardPage() {
  const [messages, setMessages] = useState([])
  const [authorized, setAuthorized] = useState(false)
  const [login, setLogin] = useState({ username: '', password: '' })
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  useEffect(() => {
    const auth = isAuthorized()
    setAuthorized(auth)
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
    setMessages(stored)
  }, [])

  const logout = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY)
    } catch {}
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
                {msg.starred ? (
                  <span className="star-pill" title="Starred">
                    <i className="fas fa-star" /> Starred
                  </span>
                ) : null}
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
                  onClick={() => {
                    const next = messages.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
                    setMessages(next)
                    saveMessages(next)
                  }}
                >
                  <i className="fas fa-eye" /> {msg.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  className="btn btn-secondary btn-small"
                  type="button"
                  onClick={() => {
                    const next = messages.map((m) => (m.id === msg.id ? { ...m, starred: !m.starred } : m))
                    setMessages(next)
                    saveMessages(next)
                  }}
                >
                  <i className="fas fa-star" /> {msg.starred ? 'Unstar' : 'Star'}
                </button>
                <button
                  className="btn btn-danger btn-small"
                  type="button"
                  onClick={() => {
                    if (!confirm('Delete this message?')) return
                    const next = messages.filter((m) => m.id !== msg.id)
                    setMessages(next)
                    saveMessages(next)
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
    const creds = getDefaultAdminCredentials()
    return (
      <section className="admin-hero" id="main-content">
        <div className="container">
          <h1>
            <i className="fas fa-user-shield" /> Admin Dashboard
          </h1>
          <p className="subtitle">Manage contact messages stored in your browser (localStorage).</p>

          <div className="admin-login" style={{ marginTop: 18 }}>
            <div className="admin-login-inner">
              <h2>
                <i className="fas fa-user-lock" /> Admin Login
              </h2>
              <p className="subtitle">Enter your admin credentials to manage messages.</p>

              <form
                className="admin-login-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  const { username, password } = login
                  const expected = getAdminCredentials()
                  if (username === expected.username && password === expected.password) {
                    try {
                      sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_ROLE)
                    } catch {}
                    setAuthorized(true)
                  } else {
                    alert('Invalid username or password.')
                  }
                }}
              >
                <div className="filter-group" style={{ margin: 0 }}>
                  <label htmlFor="adminUsername">Username</label>
                  <input
                    id="adminUsername"
                    name="username"
                    type="text"
                    placeholder="admin"
                    value={login.username}
                    onChange={(e) => setLogin((s) => ({ ...s, username: e.target.value }))}
                    required
                  />
                </div>
                <div className="filter-group" style={{ marginTop: '0.9rem' }}>
                  <label htmlFor="adminPassword">Password</label>
                  <input
                    id="adminPassword"
                    name="password"
                    type="password"
                    placeholder="admin123"
                    value={login.password}
                    onChange={(e) => setLogin((s) => ({ ...s, password: e.target.value }))}
                    required
                  />
                </div>

                <div className="admin-actions" style={{ justifyContent: 'flex-start', marginTop: '1rem' }}>
                  <button className="btn btn-primary" type="submit">
                    <i className="fas fa-right-to-bracket" /> Login
                  </button>
                </div>

                <p className="admin-login-note" style={{ marginTop: '0.9rem' }}>
                  Demo credentials: <strong>{creds.username}</strong> / <strong>{creds.password}</strong>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-hero" id="main-content">
      <div className="container">
        <div className="admin-hero-top">
          <div>
            <h1>
              <i className="fas fa-user-shield" /> Admin Dashboard
            </h1>
            <p className="subtitle">Manage contact messages stored in your browser (localStorage).</p>
          </div>
          <div className="admin-hint">
            <i className="fas fa-lock" /> <span>Authentication + authorization (front-end demo only).</span>
          </div>
        </div>

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
              <i className="fas fa-star" />
            </div>
            <div>
              <h3>{stats.starred}</h3>
              <p>Starred</p>
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
              <option value="starred">Starred</option>
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

          <div className="admin-actions">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                const next = messages.map((m) => ({ ...m, read: true }))
                setMessages(next)
                saveMessages(next)
              }}
            >
              <i className="fas fa-check-double" /> Mark all as read
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => {
                if (!confirm('Clear ALL messages from localStorage? This cannot be undone.')) return
                setMessages([])
                saveMessages([])
              }}
            >
              <i className="fas fa-trash" /> Clear all
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={logout}
            >
              <i className="fas fa-sign-out-alt" /> Logout
            </button>
          </div>
        </div>

        <div className="admin-list" id="messagesContainer">
          {renderTable()}
        </div>
      </div>
    </section>
  )
}

