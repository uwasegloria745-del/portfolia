import React, { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'

const ADMIN_SESSION_KEY = 'portfolioAdminSession'
const ADMIN_ROLE = 'admin'

function isAuthorized() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_ROLE
  } catch {
    return false
  }
}

/**
 * Simple front-end-only guard. This ensures `/admin` always checks
 * sessionStorage on render.
 */
export default function RequireAdmin({ children }) {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    setAuthorized(isAuthorized())
  }, [])

  // Also handle cases where sessionStorage changes without remounting.
  const auth = useMemo(() => authorized || isAuthorized(), [authorized])

  if (!auth) return <Navigate to="/admin" replace />

  return children
}

