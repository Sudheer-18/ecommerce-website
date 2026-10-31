import { useState } from 'react'
import { formatCurrency } from '../utils/formatCurrency'

export function CheckoutPage({ cartItems, subtotal, navigate, user, clearCart }) {
  const [address, setAddress] = useState('123 Market Street, Bengaluru, Karnataka 560001')
  const [phone, setPhone] = useState('9876543210')
  const [submitted, setSubmitted] = useState(false)

  const shipping = subtotal > 999 ? 0 : 49
  const total = subtotal + shipping

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/login')
      return
    }

    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: user.name || user.email,
      total,
      items: cartItems,
      shippingAddress: address,
      contactNumber: phone,
      status: 'PENDING',
    }

    const existing = JSON.parse(localStorage.getItem('electromart-orders') || '[]')
    localStorage.setItem('electromart-orders', JSON.stringify([order, ...existing]))
    clearCart()
    setSubmitted(true)
    navigate('/orders')
  }

  return (
    <div className="checkout-layout">
      <div className="checkout-form card-box">
        <h3>Shipping details</h3>
        <label>
          Address
          <textarea value={address} onChange={(event) => setAddress(event.target.value)} rows={4} />
        </label>
        <label>
          Contact number
          <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>
      </div>

      <aside className="summary-card">
        <h3>Payment summary</h3>
        <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div className="summary-row"><span>Delivery</span><strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong></div>
        <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        <div className="payment-note">Cash on delivery enabled. Online payment integration placeholder ready for Razorpay/Stripe.</div>
        <button type="button" className="primary-btn block" onClick={handlePlaceOrder}>
          {submitted ? 'Order placed' : 'Place order'}
        </button>
      </aside>
    </div>
  )
}
