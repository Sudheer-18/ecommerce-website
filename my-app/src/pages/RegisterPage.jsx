import { useState } from 'react'

export function RegisterPage({ navigate, loginUser }) {
  const [form, setForm] = useState({ name: 'Demo User', email: 'demo@electromart.com', password: 'demo123' })

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    loginUser({ name: form.name, email: form.email }, 'demo-token')
    navigate('/orders')
  }

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Full name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>
        <button type="submit" className="primary-btn block">Register</button>
      </form>
    </div>
  )
}
