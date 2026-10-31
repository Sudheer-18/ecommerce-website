import { AdminLayout } from './AdminLayout'

const summary = [
  { label: 'Revenue', value: '₹18.6L', change: '+12.4%' },
  { label: 'Orders', value: '1,284', change: '+8.1%' },
  { label: 'Customers', value: '8,240', change: '+15.3%' },
  { label: 'Conversion', value: '4.9%', change: '+0.6%' },
]

const recentOrders = [
  { id: '#10482', customer: 'Riya Sharma', total: '₹29,999', status: 'Packed' },
  { id: '#10473', customer: 'Arjun Nair', total: '₹89,999', status: 'Shipped' },
  { id: '#10459', customer: 'Meera Iyer', total: '₹14,499', status: 'Processing' },
]

export function AdminDashboard({ navigate, currentPath }) {
  return (
    <AdminLayout title="Dashboard" navigate={navigate} currentPath={currentPath}>
      <section className="stats-grid">
        {summary.map((item) => (
          <div key={item.label} className="admin-stat-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.change}</small>
          </div>
        ))}
      </section>

      <section className="admin-panel-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h3>Recent orders</h3>
            <button type="button" className="text-link" onClick={() => navigate('/admin/orders')}>View all</button>
          </div>
          <div className="table-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="table-row">
                <span>{order.id}</span>
                <span>{order.customer}</span>
                <span>{order.total}</span>
                <span className="status-pill">{order.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h3>Top categories</h3>
          </div>
          <ul className="mini-list">
            <li><span>Smartphones</span><strong>36%</strong></li>
            <li><span>Laptops</span><strong>24%</strong></li>
            <li><span>Audio</span><strong>18%</strong></li>
            <li><span>Accessories</span><strong>12%</strong></li>
            <li><span>Wearables</span><strong>10%</strong></li>
          </ul>
        </div>
      </section>
    </AdminLayout>
  )
}
