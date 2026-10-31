import { AdminLayout } from './AdminLayout'

const order = {
  id: '#10482',
  customer: 'Riya Sharma',
  email: 'riya@example.com',
  phone: '+91 98765 43210',
  address: '12th Main, Indiranagar, Bengaluru',
  total: '₹29,999',
  status: 'Packed',
  items: [
    { name: 'Noise Vivid GT', qty: 1, price: '₹5,999' },
    { name: 'Sony WH-1000XM5', qty: 1, price: '₹28,499' },
  ],
}

export function AdminOrderDetails({ navigate, currentPath }) {
  return (
    <AdminLayout title="Order details" navigate={navigate} currentPath={currentPath}>
      <div className="admin-panel-grid">
        <div className="admin-panel">
          <div className="panel-header">
            <h3>Order #{order.id}</h3>
            <span className="status-pill">{order.status}</span>
          </div>

          <div className="order-detail-block">
            <p><strong>Customer:</strong> {order.customer}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>
          </div>
        </div>

        <div className="admin-panel">
          <div className="panel-header">
            <h3>Items</h3>
          </div>
          <div className="mini-list ordered-items">
            {order.items.map((item) => (
              <li key={item.name}>
                <span>{item.name} × {item.qty}</span>
                <strong>{item.price}</strong>
              </li>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
