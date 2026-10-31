import { useEffect, useState } from 'react'
import { CategoryMenu } from '../components/product/CategoryMenu'
import { ProductGrid } from '../components/product/ProductGrid'
import { Loader } from '../components/common/Loader'
import { productService } from '../services/productService'
import { formatCurrency } from '../utils/formatCurrency'

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Earphones and headphones', 'Smartwatches', 'Speakers', 'Computer accessories', 'Chargers and cables', 'Power banks', 'Gaming accessories']

export function HomePage({ navigate, onAddToCart }) {
  const [featured, setFeatured] = useState({ trending: [], latest: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    productService.getFeatured().then((data) => {
      if (mounted) {
        setFeatured(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [])

  const products = featured.trending?.slice(0, 4) || []

  return (
    <>
      <section className="hero-banner">
        <div className="hero-copy">
          <span className="eyebrow">Big savings on electronics</span>
          <h1>Fresh tech for your every upgrade.</h1>
          <p>Shop premium electronics, accessories and gaming essentials designed for work, play and everyday life.</p>
          <div className="hero-actions">
            <button type="button" className="primary-btn" onClick={() => navigate('/products')}>Shop deals</button>
            <button type="button" className="secondary-btn" onClick={() => navigate('/products')}>Browse all</button>
          </div>
          <div className="hero-metrics">
            <div><strong>20k+</strong><span>Happy buyers</span></div>
            <div><strong>4.8/5</strong><span>Customer rating</span></div>
            <div><strong>24h</strong><span>Fast dispatch</span></div>
          </div>
        </div>

        <div className="hero-visual hero-visual-art" aria-hidden="true">
          <div className="floating-card card-one">
            <span>Best seller</span>
            <strong>iPhone 15 Pro</strong>
            <small>{formatCurrency(139999)}</small>
          </div>

          <div className="stack-card stack-top" />
          <div className="stack-card stack-bottom" />

          <div className="floating-card card-two">
            <span>Weekend deal</span>
            <strong>Up to 40% off</strong>
            <small>On selected brands</small>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Shop by category</h2>
          <button type="button" className="text-link" onClick={() => navigate('/products')}>View all</button>
        </div>
        <CategoryMenu categories={categories.slice(0, 8)} selected="All" onSelect={() => navigate('/products')} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Trending gadgets</h2>
          <button type="button" className="text-link" onClick={() => navigate('/products')}>See all</button>
        </div>

        {loading ? <Loader label="Loading products..." /> : <ProductGrid products={products} onAddToCart={onAddToCart} onViewDetails={(id) => navigate(`/product/${id}`)} />}
      </section>
    </>
  )
}
