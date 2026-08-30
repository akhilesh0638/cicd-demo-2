import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as orderService from '../services/orderService'
import { useCart } from '../context/CartContext'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'

const statusColor = {
  PLACED: 'badge-warning',
  CONFIRMED: 'badge-warning',
  SHIPPED: 'badge-warning',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger',
}

export default function Orders() {
  const { userId } = useCart()
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    orderService
      .getOrdersByUser(userId)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 20 }}>My Orders</h1>

        {location.state?.justPlacedOrderId && (
          <div className="alert alert-success">
            Order #{location.state.justPlacedOrderId} placed successfully!
          </div>
        )}

        <ErrorMessage message={error} />

        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="empty-state">You haven't placed any orders yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => (
              <div key={order.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <strong>Order #{order.id}</strong>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span className={`badge ${statusColor[order.status] || 'badge-warning'}`}>
                    {order.status}
                  </span>
                </div>

                <table>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName}</td>
                        <td>x{item.quantity}</td>
                        <td>₹{item.priceAtPurchase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  <span className="text-muted">Ship to: {order.shippingAddress}</span>
                  <strong>Total: ₹{order.totalAmount}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
