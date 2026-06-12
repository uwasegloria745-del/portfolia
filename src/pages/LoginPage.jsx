import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'portfolioAdminSession'
const ADMIN_ROLE = 'admin'

export default function LoginPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const canSubmit = useMemo(() => {
    return values.email.trim().length > 0 && values.password.trim().length > 0 && !loading
  }, [values.email, values.password, loading])

  function onChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    // Demo-only login: accept any non-empty credentials.
    if (!values.email.trim() || !values.password.trim()) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      localStorage.setItem(
        'portfolioAuth',
        JSON.stringify({ email: values.email.trim(), at: Date.now() })
      )

      // Enable admin dashboard access after login (demo-only)
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_ROLE)
      } catch {}

      alert('Logged in successfully!')
      navigate('/admin', { replace: true })
    } catch (e) {
      setError('Login failed. Please try again.')
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
          Login
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
            <label htmlFor="loginEmail" className="sr-only">
              Email
            </label>
            <input
              id="loginEmail"
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              placeholder="Email"
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

          <div style={{ marginTop: 14, color: 'var(--text-light)' }}>
            <small>
              Demo login: any non-empty credentials work. After login, you can later add a redirect to
              <b> /admin</b>.
            </small>
          </div>
        </form>
      </div>
    </div>
  )
}

