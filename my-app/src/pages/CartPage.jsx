import { EmptyState } from '../components/common/EmptyState'
import { formatCurrency } from '../utils/formatCurrency'

export function CartPage({ cartItems, updateQuantity, removeFromCart, subtotal, navigate }) {
  if (!cartItems.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add a few gadgets and accessories to continue shopping."
        actionLabel="Browse products"
        onAction={() => navigate('/products')}
      />
    )
  }

  const shipping = subtotal > 999 ? 0 : 49
  const total = subtotal + shipping

  return (
    <div className="cart-layout">
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item-row">
            <img src={item.imageUrls?.[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'} alt={item.name} />
            <div className="cart-item-meta">
              <h3>{item.name}</h3>
              <p>{item.brand}</p>
              <div className="cart-controls">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <button type="button" className="remove-link" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
            <strong>{formatCurrency((item.discountedPrice || item.price) * item.quantity)}</strong>
          </div>
        ))}
      </div>

      <aside className="summary-card">
        <h3>Order summary</h3>
        <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div className="summary-row"><span>Delivery</span><strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong></div>
        <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        <button type="button" className="primary-btn block" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
      </aside>
    </div>
  )
}
