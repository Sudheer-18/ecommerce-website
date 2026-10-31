import { AdminLayout } from './AdminLayout'

const categories = [
  { name: 'Smartphones', products: 128, featured: true },
  { name: 'Laptops', products: 96, featured: true },
  { name: 'Audio', products: 74, featured: false },
  { name: 'Wearables', products: 51, featured: false },
  { name: 'Accessories', products: 140, featured: true },
]

export function AdminCategories({ navigate, currentPath }) {
  return (
    <AdminLayout title="Categories" navigate={navigate} currentPath={currentPath}>
      <div className="admin-panel">
        <div className="panel-header">
          <h3>Category list</h3>
          <button type="button" className="primary-btn">Add category</button>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <div key={category.name} className="category-item">
              <div>
                <strong>{category.name}</strong>
                <small>{category.products} products</small>
              </div>
              <span className={`status-pill ${category.featured ? 'live' : ''}`}>
                {category.featured ? 'Featured' : 'Standard'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
