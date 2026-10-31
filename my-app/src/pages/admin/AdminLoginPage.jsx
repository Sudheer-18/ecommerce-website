import { useState } from 'react'

export function AdminLoginPage({ navigate, loginAdmin }) {
  const [email, setEmail] = useState('admin@electromart.com')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.token) {
        throw new Error(data?.message || 'Invalid admin credentials.')
      }

      loginAdmin({ name: 'Admin User', email, role: 'ADMIN' }, data.token)
      navigate('/admin/')
    } catch (requestError) {
      setError(requestError.message || 'Invalid admin credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card admin-auth-card">
        <p className="eyebrow dark">Admin access</p>
        <h2>Admin login</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-btn block" disabled={loading}>{loading ? 'Signing in...' : 'Login to dashboard'}</button>
        </form>

        <button type="button" className="secondary-btn block" onClick={() => navigate('/')}>Return to storefront</button>
      </div>
    </div>
  )
}
