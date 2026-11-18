import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'portfolioAdminSession'
const ADMIN_TOKEN_KEY = 'portfolioAdminToken'

async function validateSession() {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
  if (!token) return false

  try {
    const response = await fetch('http://localhost:3001/api/admin/session', {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY)
      sessionStorage.removeItem(ADMIN_SESSION_KEY)
      return false
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, 'admin')
    return true
  } catch {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    return false
  }
}

export default function RequireAdmin({ children }) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      const ok = await validateSession()
      if (isMounted) {
        setAuthorized(ok)
        setLoading(false)
      }
    }

    checkAuth()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <div className="app-loading" />
  if (!authorized) return <Navigate to="/login" replace />

  return children
}

