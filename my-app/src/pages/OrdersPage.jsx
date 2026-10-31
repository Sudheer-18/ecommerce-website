import { formatCurrency } from '../utils/formatCurrency'

export function OrdersPage({ navigate, user }) {
  const orders = JSON.parse(localStorage.getItem('electromart-orders') || '[]')

  if (!orders.length) {
    return (
      <div className="empty-state small-box">
        <h3>No orders yet</h3>
        <p>Your completed orders will appear here once you place an order.</p>
        <button type="button" className="primary-btn" onClick={() => navigate('/products')}>Continue shopping</button>
      </div>
    )
  }

  return (
    <div className="orders-list">
      <h2>My orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>Order #{order.id}</span>
            <strong>{order.status}</strong>
          </div>
          <p>{new Date(order.date).toLocaleDateString()}</p>
          <ul>
            {order.items.map((item) => (
              <li key={`${order.id}-${item.id}`}>{item.name} × {item.quantity}</li>
            ))}
          </ul>
          <div className="summary-row"><span>Total</span><strong>{formatCurrency(order.total)}</strong></div>
        </div>
      ))}
    </div>
  )
}
