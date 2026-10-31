import { AdminLayout } from './AdminLayout'

const orders = [
  { id: '#10482', customer: 'Riya Sharma', total: '₹29,999', status: 'Packed', date: '2026-10-29' },
  { id: '#10473', customer: 'Arjun Nair', total: '₹89,999', status: 'Shipped', date: '2026-10-28' },
  { id: '#10459', customer: 'Meera Iyer', total: '₹14,499', status: 'Processing', date: '2026-10-27' },
  { id: '#10438', customer: 'Vikram S', total: '₹6,499', status: 'Delivered', date: '2026-10-24' },
]

export function AdminOrders({ navigate, currentPath }) {
  return (
    <AdminLayout title="Orders" navigate={navigate} currentPath={currentPath}>
      <div className="admin-panel">
        <div className="table-list order-table">
          {orders.map((order) => (
            <div key={order.id} className="table-row">
              <span>{order.id}</span>
              <span>{order.customer}</span>
              <span>{order.date}</span>
              <span>{order.total}</span>
              <span className="status-pill">{order.status}</span>
              <button type="button" className="text-link" onClick={() => navigate('/admin/orders/10482')}>View</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
