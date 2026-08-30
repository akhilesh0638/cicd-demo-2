import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAddToCart }) {
  const outOfStock = product.stock === 0

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', height: 160, objectFit: 'cover' }}
        />
      </Link>
      <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span className="text-muted" style={{ fontSize: 12 }}>{product.categoryName}</span>
        <Link to={`/products/${product.id}`}>
          <h3 style={{ fontSize: 15, margin: '4px 0 8px' }}>{product.name}</h3>
        </Link>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 16 }}>₹{product.price}</strong>
          {outOfStock ? (
            <span className="badge badge-danger">Out of stock</span>
          ) : (
            <span className="badge badge-success">In stock</span>
          )}
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: 10, width: '100%' }}
          disabled={outOfStock}
          onClick={() => onAddToCart(product.id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
