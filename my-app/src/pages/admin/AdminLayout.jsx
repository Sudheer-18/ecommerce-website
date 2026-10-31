export function AdminLayout({ title, children, navigate, currentPath }) {
  const navItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Users', path: '/admin/users' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-badge">E</div>
          <div>
            <strong>ElectroMart</strong>
            <small>Admin panel</small>
          </div>
        </div>

        <nav className="admin-menu" aria-label="Admin navigation">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`admin-menu-item ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" className="secondary-btn block" onClick={() => navigate('/')}>
          Back to storefront
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div>
            <p className="eyebrow dark">Operations</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="primary-btn" onClick={() => navigate('/admin/products/new')}>
            + Add product
          </button>
        </header>
        {children}
      </main>
    </div>
  )
}
