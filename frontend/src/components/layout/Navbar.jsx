import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { itemCount } = useCart()

  const linkStyle = ({ isActive }) => ({
    padding: '8px 12px',
    borderRadius: 8,
    fontWeight: 500,
    color: isActive ? '#2563eb' : '#1f2937',
    background: isActive ? '#eff6ff' : 'transparent',
  })

  return (
    <header className="card" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 20, color: '#2563eb' }}>
          🛍️ ShopSphere
        </Link>

        <nav style={{ display: 'flex', gap: 4 }}>
          <NavLink to="/" style={linkStyle} end>Home</NavLink>
          <NavLink to="/products" style={linkStyle}>Products</NavLink>
          <NavLink to="/orders" style={linkStyle}>My Orders</NavLink>
          <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
        </nav>

        <Link to="/cart" className="btn btn-outline">
          🛒 Cart {itemCount > 0 && <span className="badge badge-success">{itemCount}</span>}
        </Link>
      </div>
    </header>
  )
}
