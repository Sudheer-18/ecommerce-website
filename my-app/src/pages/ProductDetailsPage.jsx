import { useEffect, useState } from 'react'
import { Loader } from '../components/common/Loader'
import { EmptyState } from '../components/common/EmptyState'
import { productService } from '../services/productService'
import { formatCurrency, getDiscountPercent } from '../utils/formatCurrency'

export function ProductDetailsPage({ match, navigate, onAddToCart }) {
  const productId = Number(match?.params?.id || match?.id || 1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    productService.getProductById(productId).then((item) => {
      if (mounted) {
        setProduct(item)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [productId])

  if (loading) return <Loader label="Loading product" />
  if (!product) return <EmptyState title="Product not found" message="The requested item is unavailable." actionLabel="Back to shop" onAction={() => navigate('/products')} />

  const image = product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'

  return (
    <div className="product-detail-page">
      <button type="button" className="back-link" onClick={() => navigate('/products')}>&larr; Back to products</button>

      <div className="detail-layout">
        <div className="detail-gallery">
          <img src={image} alt={product.name} className="detail-main-image" />
        </div>

        <div className="detail-info">
          <span className="eyebrow dark">{product.category}</span>
          <h2>{product.name}</h2>
          <div className="rating-row">
            <span>⭐ {product.rating || 4.7}</span>
            <span>{product.reviewCount || 0} reviews</span>
          </div>
          <div className="detail-price-row">
            <strong>{formatCurrency(product.discountedPrice || product.price)}</strong>
            <span>{formatCurrency(product.price)}</span>
            <small>{getDiscountPercent(product.price, product.discountedPrice)}% off</small>
          </div>
          <p className="detail-description">{product.description}</p>

          <div className="spec-list">
            {(product.specifications || ['High performance', 'Fast charging', '1-year warranty']).map((spec) => (
              <span key={spec}>{spec}</span>
            ))}
          </div>

          <div className="purchase-controls">
            <div className="quantity-picker">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(product.stockQuantity || 10, value + 1))}>+</button>
            </div>
            <button type="button" className="primary-btn" onClick={() => onAddToCart(product, quantity)}>
              Add to cart
            </button>
            <button type="button" className="secondary-btn" onClick={() => navigate('/checkout')}>Buy now</button>
          </div>

          <div className="detail-meta">
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Stock:</strong> {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Currently unavailable'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
