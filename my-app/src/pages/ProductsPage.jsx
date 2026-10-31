import { useEffect, useMemo, useState } from 'react'
import { CategoryMenu } from '../components/product/CategoryMenu'
import { ProductGrid } from '../components/product/ProductGrid'
import { Loader } from '../components/common/Loader'
import { EmptyState } from '../components/common/EmptyState'
import { productService } from '../services/productService'

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Earphones and headphones', 'Smartwatches', 'Speakers', 'Computer accessories', 'Chargers and cables', 'Power banks', 'Gaming accessories']

export function ProductsPage({ navigate, searchValue, onAddToCart }) {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    let mounted = true
    setLoading(true)

    productService.getProducts().then((items) => {
      if (mounted) {
        setProducts(items)
        setLoading(false)
      }
    })

    return () => { mounted = false }
  }, [])

  const filteredProducts = useMemo(() => {
    const search = (searchValue || '').toLowerCase()
    const result = products.filter((product) => {
      const matchesSearch = !search || `${product.name} ${product.brand} ${product.shortDescription}`.toLowerCase().includes(search)
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    if (sortBy === 'price-low') return [...result].sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price))
    if (sortBy === 'price-high') return [...result].sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price))
    if (sortBy === 'rating') return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return [...result].sort((a, b) => Number(b.id) - Number(a.id))
  }, [products, searchValue, selectedCategory, sortBy])

  return (
    <div className="page-section">
      <div className="section-heading">
        <h2>All products</h2>
        <div className="sort-control">
          <label htmlFor="sort-products">Sort by</label>
          <select id="sort-products" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <CategoryMenu categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />

      {loading ? (
        <Loader label="Loading products..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No products found" message="Try a different search or category." actionLabel="Reset filters" onAction={() => { setSelectedCategory('All'); setSortBy('newest') }} />
      ) : (
        <ProductGrid products={filteredProducts} onAddToCart={onAddToCart} onViewDetails={(id) => navigate(`/product/${id}`)} />
      )}
    </div>
  )
}
