import React, { useEffect, useMemo, useState } from 'react'

const storageKey = 'portfolioMessages'

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getInitials(name) {
  return String(name)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalId, setModalId] = useState(null)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]')
      setMessages(stored)
      setLoading(false)
    }, 250)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages))
  }, [messages])

  const stats = useMemo(() => {
    const total = messages.length
    const read = messages.filter((m) => m.read).length
    const unread = total - read
    return { total, read, unread }
  }, [messages])

  const active = useMemo(() => messages.find((m) => m.id === modalId), [messages, modalId])

  const renderList = () => {
    if (loading) {
      return (
        <div className="loading-messages">
          <i className="fas fa-spinner fa-spin" />
          <p>Loading messages...</p>
        </div>
      )
    }

    if (messages.length === 0) {
      return (
        <div className="no-messages" style={{ display: 'block' }}>
          <i className="fas fa-inbox" />
          <h3>No Messages Yet</h3>
          <p>Messages submitted through the contact form will appear here.</p>
          <a href="/" className="btn btn-primary">
            Go to Contact Form
          </a>
        </div>
      )
    }

    return (
      <>
        <div className="messages-stats">
          <div className="stat-box">
            <i className="fas fa-inbox" />
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Messages</p>
            </div>
          </div>
          <div className="stat-box">
            <i className="fas fa-check-circle" />
            <div className="stat-info">
              <h3>{stats.read}</h3>
              <p>Read</p>
            </div>
          </div>
          <div className="stat-box">
            <i className="fas fa-clock" />
            <div className="stat-info">
              <h3>{stats.unread}</h3>
              <p>New</p>
            </div>
          </div>
        </div>

        <div className="messages-grid" style={{ display: 'grid', gap: 16, marginTop: 18 }}>
          {messages
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((msg) => (
              <div key={msg.id} className="message-card" style={{ padding: 16, borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div className="sender-avatar" aria-hidden="true">
                      {getInitials(msg.name)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{msg.name}</h4>
                      <div style={{ opacity: 0.85, fontSize: 13 }}>{msg.email}</div>
                    </div>
                  </div>
                  <div style={{ opacity: 0.9, fontSize: 13 }}>{formatDate(msg.date)}</div>
                </div>

                <h3 style={{ marginTop: 12 }}>{msg.subject}</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>

                <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
                      setModalId(msg.id)
                    }}
                  >
                    <i className="far fa-eye" /> {msg.read ? 'View' : 'Mark as Read'}
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => {
                      if (!confirm('Are you sure you want to delete this message?')) return
                      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
                      setModalId((id) => (id === msg.id ? null : id))
                    }}
                  >
                    <i className="far fa-trash-alt" /> Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </>
    )
  }

  return (
    <section className="messages-section" id="main-content">
      <div className="container">
        <div className="messages-header">
          <h1>
            <i className="fas fa-envelope-open-text" /> Contact Messages
          </h1>
          <p>View messages submitted through the contact form</p>
        </div>

        {renderList()}
      </div>

      {active && (
        <div className="modal active" style={{ display: 'block' }} onClick={() => setModalId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{active.subject}</h2>
              <button className="modal-close" aria-label="Close modal" onClick={() => setModalId(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="message-meta" style={{ display: 'grid', gap: 10 }}>
                <div className="meta-item">
                  <i className="fas fa-user" /> <span>{active.name}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-envelope" /> <span>{active.email}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-calendar" /> <span>{new Date(active.date).toLocaleString()}</span>
                </div>
              </div>
              <div className="message-body" style={{ whiteSpace: 'pre-wrap' }}>
                {active.message}
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  window.location.href = `mailto:${active.email}?subject=Re: ${active.subject}`
                }}
              >
                <i className="fas fa-reply" /> Reply
              </button>
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => {
                  if (!confirm('Delete this message?')) return
                  setMessages((prev) => prev.filter((m) => m.id !== active.id))
                  setModalId(null)
                }}
              >
                <i className="fas fa-trash" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

