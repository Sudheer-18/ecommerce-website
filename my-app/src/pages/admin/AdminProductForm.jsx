import { useEffect, useState } from 'react'
import { adminProductService } from '../../services/adminProductService'
import { AdminLayout } from './AdminLayout'

const categoryOptions = ['Smartphones', 'Laptops', 'Mobile Accessories', 'Tablets', 'Accessories']

const initialValues = {
  name: '',
  brand: '',
  category: 'Smartphones',
  price: 0,
  discountedPrice: 0,
  stockQuantity: 1,
  description: '',
  shortDescription: '',
  thumbnail: '',
  imageUrls: '',
  specifications: '',
  rating: 4.5,
  active: true,
  featured: false,
}

export function AdminProductForm({ navigate, currentPath }) {
  const [form, setForm] = useState(initialValues)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  useEffect(() => {
    const productId = currentPath.split('/').filter(Boolean).at(-1)
    if (productId && productId !== 'new') {
      adminProductService.listProducts().then((products) => {
        const product = products.find((item) => String(item.id) === String(productId))
        if (product) {
          setForm({
            name: product.name || '',
            brand: product.brand || '',
            category: product.category?.name || product.category || 'Smartphones',
            price: product.price || 0,
            discountedPrice: product.discountedPrice || product.price || 0,
            stockQuantity: product.stockQuantity || 0,
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            thumbnail: product.thumbnail || '',
            imageUrls: (product.imageUrls || []).join(', '),
            specifications: (product.specifications || []).join(', '),
            rating: product.rating || 4.5,
            active: product.active !== false,
            featured: Boolean(product.featured),
          })
        }
      })
    }
  }, [currentPath])

  const saveProduct = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: form.name,
        brand: form.brand || 'Unknown',
        category: form.category,
        price: Number(form.price || 0),
        discountedPrice: Number(form.discountedPrice || form.price || 0),
        stockQuantity: Number(form.stockQuantity || 0),
        description: form.description,
        shortDescription: form.shortDescription || form.description,
        thumbnail: form.thumbnail || '',
        imageUrls: form.imageUrls
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        specifications: form.specifications
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
        rating: Number(form.rating || 0),
        active: form.active,
        featured: form.featured,
        sku: `EM-${form.category.replace(/[^A-Za-z0-9]/g, '-').toUpperCase()}-${Date.now()}`,
      }

      const productId = currentPath.split('/').filter(Boolean).at(-1)
      if (productId && productId !== 'new') {
        await adminProductService.updateProduct(productId, payload)
        setSuccess('Product updated successfully.')
      } else {
        await adminProductService.createProduct(payload)
        setSuccess('Product created successfully.')
      }

      setTimeout(() => navigate('/admin/products'), 300)
    } catch (requestError) {
      setError(requestError.message || 'Unable to save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="Product details" navigate={navigate} currentPath={currentPath}>
      <div className="admin-panel">
        <form className="admin-form" onSubmit={saveProduct}>
          <label>
            Product name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <div className="form-row two-col">
            <label>
              Brand
              <input name="brand" value={form.brand} onChange={handleChange} />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {categoryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-row two-col">
            <label>
              Price
              <input name="price" type="number" value={form.price} onChange={handleChange} />
            </label>
            <label>
              Sale price
              <input name="discountedPrice" type="number" value={form.discountedPrice} onChange={handleChange} />
            </label>
          </div>

          <div className="form-row two-col">
            <label>
              Stock quantity
              <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} />
            </label>
            <label>
              Rating
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
            </label>
          </div>

          <label>
            Short description
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={5} />
          </label>

          <div className="form-row two-col">
            <label>
              Thumbnail URL
              <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />
            </label>
            <label>
              Image URLs (comma separated)
              <input name="imageUrls" value={form.imageUrls} onChange={handleChange} />
            </label>
          </div>

          <label>
            Specifications (comma separated)
            <input name="specifications" value={form.specifications} onChange={handleChange} />
          </label>

          <div className="form-row two-col">
            <label className="checkbox-row">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              Active
            </label>
            <label className="checkbox-row">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              Featured
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={() => navigate('/admin/products')}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving...' : 'Save product'}</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
