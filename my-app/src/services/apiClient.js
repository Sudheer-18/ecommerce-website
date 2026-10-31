const API_BASE_URL = 'http://localhost:8080/api'

const getAuthHeaders = () => {
  const adminToken = localStorage.getItem('electromart-admin-token')
  const userToken = localStorage.getItem('electromart-token')
  const token = adminToken || userToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const apiClient = {
  async get(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
      ...options,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || 'Request failed')
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return response.json()
    }
    return null
  },

  async post(url, body, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
      body: JSON.stringify(body),
      ...options,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || 'Request failed')
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return response.json()
    }
    return null
  },

  async put(url, body, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
      body: JSON.stringify(body),
      ...options,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || 'Request failed')
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return response.json()
    }
    return null
  },

  async del(url, options = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...(options.headers || {}) },
      ...options,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      throw new Error(text || 'Request failed')
    }

    return response.status === 204 ? null : response.json()
  },
}
