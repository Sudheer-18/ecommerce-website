import { formatCurrency, getDiscountPercent } from '../../utils/formatCurrency'

export function ProductCard({ product, onAddToCart, onViewDetails }) {
  const image = product.imageUrls?.[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <span className="badge">{getDiscountPercent(product.price, product.discountedPrice)}% off</span>
        <img src={image} alt={product.name} />
      </div>
      <div className="product-body">
        <div className="meta-row">
          <span>{product.brand}</span>
          <span>⭐ {product.rating || 4.5}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="price-row">
          <strong>{formatCurrency(product.discountedPrice || product.price)}</strong>
          <span>{formatCurrency(product.price)}</span>
        </div>
        <div className="stock-row">
          <small>{(product.stockQuantity || 0) > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}</small>
          <button type="button" onClick={() => onAddToCart(product)}>Add</button>
        </div>
        <button type="button" className="secondary-link" onClick={() => onViewDetails(product.id)}>View details</button>
      </div>
    </article>
  )
}
