import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as productService from '../services/productService'
import ProductCard from '../components/product/ProductCard'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { useCart } from '../context/CartContext'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    productService
      .getAllProducts()
      .then((data) => setProducts(data.slice(0, 8)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="container">
        <div
          className="card"
          style={{
            padding: '48px 32px',
            marginBottom: 40,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff',
            border: 'none',
          }}
        >
          <h1 style={{ fontSize: 32, margin: '0 0 12px' }}>Welcome to ShopSphere</h1>
          <p style={{ opacity: 0.9, marginBottom: 20 }}>
            Electronics, laptops, mobiles, and more - browse our full catalog.
          </p>
          <Link to="/products" className="btn" style={{ background: '#fff', color: '#2563eb' }}>
            Shop Now
          </Link>
        </div>

        <h2 style={{ marginBottom: 16 }}>Featured Products</h2>
        <ErrorMessage message={error} />
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={(id) => addItem(id, 1)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
