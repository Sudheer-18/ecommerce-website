import { ProductCard } from './ProductCard'

export function ProductGrid({ products, onAddToCart, onViewDetails }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}
