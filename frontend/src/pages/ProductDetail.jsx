import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as productService from '../services/productService'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    productService
      .getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    const result = await addItem(product.id, quantity)
    if (result.success) {
      setMessage('Added to cart!')
      setTimeout(() => setMessage(null), 2000)
    } else {
      setError(result.message)
    }
  }

  if (loading) return <div className="page container"><Loader /></div>
  if (error && !product) return <div className="page container"><ErrorMessage message={error} /></div>
  if (!product) return null

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-outline" style={{ marginBottom: 20 }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, padding: 32 }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }} />

          <div>
            <span className="text-muted">{product.categoryName}</span>
            <h1 style={{ margin: '6px 0 12px' }}>{product.name}</h1>
            <p className="text-muted" style={{ lineHeight: 1.6 }}>{product.description}</p>

            <div style={{ fontSize: 28, fontWeight: 700, margin: '16px 0' }}>₹{product.price}</div>

            {product.stock > 0 ? (
              <span className="badge badge-success">{product.stock} in stock</span>
            ) : (
              <span className="badge badge-danger">Out of stock</span>
            )}

            <ErrorMessage message={error} />
            {message && <div className="alert alert-success">{message}</div>}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: 70, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <button className="btn btn-primary" disabled={product.stock === 0} onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
