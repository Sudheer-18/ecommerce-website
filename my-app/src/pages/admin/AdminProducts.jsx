import { useEffect, useState } from 'react'
import { adminProductService } from '../../services/adminProductService'
import { formatCurrency } from '../../utils/formatCurrency'
import { AdminLayout } from './AdminLayout'

export function AdminProducts({ navigate, currentPath }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [message, setMessage] = useState('')

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await adminProductService.listProducts()
      setProducts(Array.isArray(data) ? data : [])
      setMessage('')
    } catch (error) {
      setMessage(error.message || 'Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleImport = async () => {
    try {
      setImporting(true)
      setMessage('')
      const result = await adminProductService.importProducts()
      await loadProducts()
      setMessage(`Import complete: ${result.importedCount ?? 0} added, ${(result.duplicateCount ?? 0)} duplicates skipped.`)
    } catch (error) {
      setMessage(error.message || 'Import failed.')
    } finally {
      setImporting(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Deactivate ${product.name}?`)) return
    try {
      await adminProductService.deleteProduct(product.id)
      await loadProducts()
      setMessage('Product deactivated.')
    } catch (error) {
      setMessage(error.message || 'Unable to deactivate product.')
    }
  }

  return (
    <AdminLayout title="Products" navigate={navigate} currentPath={currentPath}>
      <div className="admin-panel">
        <div className="panel-header">
          <h3>Inventory</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="button" className="secondary-btn" onClick={handleImport} disabled={importing}>
              {importing ? 'Importing...' : 'Import DummyJSON'}
            </button>
            <button type="button" className="primary-btn" onClick={() => navigate('/admin/products/new')}>Add product</button>
          </div>
        </div>

        {message && <p className="success-text" style={{ marginBottom: '14px' }}>{message}</p>}

        <div className="table-list product-table">
          {loading ? (
            <div className="table-row"><span>Loading products...</span></div>
          ) : products.length === 0 ? (
            <div className="table-row"><span>No products found.</span></div>
          ) : products.map((product) => (
            <div key={product.id} className="table-row">
              <span>{product.name}</span>
              <span>{product.category?.name || product.category || 'Uncategorized'}</span>
              <span>{formatCurrency(product.discountedPrice || product.price || 0)}</span>
              <span>{product.stockQuantity || 0} in stock</span>
              <span className="status-pill muted">{product.active === false ? 'Inactive' : 'Live'}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="text-link" onClick={() => navigate(`/admin/products/${product.id}`)}>Edit</button>
                <button type="button" className="text-link" onClick={() => handleDelete(product)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
