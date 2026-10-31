import { apiClient } from './apiClient'

export const adminProductService = {
  async listProducts() {
    return apiClient.get('/admin/products')
  },

  async createProduct(payload) {
    return apiClient.post('/admin/products', payload)
  },

  async updateProduct(id, payload) {
    return apiClient.put(`/admin/products/${id}`, payload)
  },

  async deleteProduct(id) {
    return apiClient.del(`/admin/products/${id}`)
  },

  async importProducts() {
    return apiClient.post('/admin/products/import', {})
  },
}
