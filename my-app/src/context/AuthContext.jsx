import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('electromart-user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('electromart-token') || '')

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem('electromart-admin-user')
      return savedAdmin ? JSON.parse(savedAdmin) : null
    } catch {
      return null
    }
  })

  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('electromart-admin-token') || '')

  useEffect(() => {
    if (user) {
      localStorage.setItem('electromart-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('electromart-user')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('electromart-token', token)
    } else {
      localStorage.removeItem('electromart-token')
    }
  }, [token])

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('electromart-admin-user', JSON.stringify(adminUser))
    } else {
      localStorage.removeItem('electromart-admin-user')
    }
  }, [adminUser])

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('electromart-admin-token', adminToken)
    } else {
      localStorage.removeItem('electromart-admin-token')
    }
  }, [adminToken])

  const login = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
  }

  const logout = () => {
    setUser(null)
    setToken('')
  }

  const loginAdmin = (nextAdmin, nextToken) => {
    setAdminUser(nextAdmin)
    setAdminToken(nextToken)
  }

  const logoutAdmin = () => {
    setAdminUser(null)
    setAdminToken('')
  }

  const value = useMemo(() => ({ user, token, login, logout, adminUser, adminToken, loginAdmin, logoutAdmin }), [user, token, adminUser, adminToken])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
