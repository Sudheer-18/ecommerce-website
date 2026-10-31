import { useState } from 'react'

export function LoginPage({ navigate, loginUser }) {
  const [email, setEmail] = useState('demo@electromart.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    loginUser({ name: 'Demo Customer', email }, 'demo-token')
    navigate('/orders')
  }

  return (
    <div className="auth-card">
      <h2>Login</h2>
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
        <button type="submit" className="primary-btn block">Login</button>
      </form>
      <p className="muted-link">New customer? <button type="button" className="text-button" onClick={() => navigate('/register')}>Create account</button></p>
    </div>
  )
}
