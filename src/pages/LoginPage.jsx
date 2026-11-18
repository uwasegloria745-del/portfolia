import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'portfolioAdminSession'
const ADMIN_TOKEN_KEY = 'portfolioAdminToken'

export default function LoginPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(() => {
    return values.username.trim().length > 0 && values.password.trim().length > 0 && !loading
  }, [values.username, values.password, loading])

  function onChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    if (!values.username.trim() || !values.password.trim()) {
      setError('Please enter your username and password.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username.trim(),
          password: values.password.trim(),
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please try again.')
      }

      sessionStorage.setItem(ADMIN_SESSION_KEY, 'admin')
      sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '100px 20px' }}>
      <div
        style={{
          maxWidth: 520,
          margin: '0 auto',
          padding: 24,
          borderRadius: 12,
          background: 'rgba(37,37,37,0.7)',
          border: '1px solid rgba(249,115,22,0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          color: 'inherit',
        }}
      >
        <h2 className="section-title" style={{ marginBottom: 20, fontSize: '2rem' }}>
          Admin Login
        </h2>

        <form onSubmit={onSubmit} className="contact-form" style={{ boxShadow: 'none' }}>
          {error ? (
            <div
              role="alert"
              style={{
                marginBottom: 14,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(231, 76, 60, 0.15)',
                border: '1px solid rgba(231, 76, 60, 0.35)',
                color: '#fff',
              }}
            >
              {error}
            </div>
          ) : null}

          <div className="form-group">
            <label htmlFor="loginUsername" className="sr-only">
              Username
            </label>
            <input
              id="loginUsername"
              name="username"
              type="text"
              value={values.username}
              onChange={onChange}
              placeholder="Username"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword" className="sr-only">
              Password
            </label>
            <input
              id="loginPassword"
              name="password"
              type="password"
              value={values.password}
              onChange={onChange}
              placeholder="Password"
              required
              aria-required="true"
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

