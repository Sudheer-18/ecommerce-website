import { apiClient } from './apiClient'

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams({
      page: String(params.page || 0),
      size: String(params.size || 12),
      ...params,
    }).toString()

    try {
      const response = await apiClient.get(`/products?${query}`)
      if (response?.content) return response.content
      if (Array.isArray(response)) return response
      if (response && Array.isArray(response.content)) return response.content
      return []
    } catch {
      return []
    }
  },

  async getFeatured() {
    try {
      const response = await apiClient.get('/featured')
      return response || { trending: [], latest: [] }
    } catch {
      return { trending: [], latest: [] }
    }
  },

  async getProductById(id) {
    try {
      return await apiClient.get(`/products/${id}`)
    } catch {
      return null
    }
  },
}
