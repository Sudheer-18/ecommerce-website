import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('electromart-cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('electromart-cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockQuantity || item.quantity + quantity) }
            : item,
        )
      }
      return [...current, { ...product, quantity }]
    })
  }

  const updateQuantity = (id, quantity) => {
    setCartItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (id) => {
    setCartItems((current) => current.filter((item) => item.id !== id))
  }

  const clearCart = () => setCartItems([])

  const subtotal = cartItems.reduce((total, item) => total + Number(item.discountedPrice || item.price) * Number(item.quantity), 0)
  const itemCount = cartItems.reduce((count, item) => count + Number(item.quantity), 0)

  const value = useMemo(
    () => ({ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, subtotal, itemCount }),
    [cartItems, subtotal, itemCount],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
