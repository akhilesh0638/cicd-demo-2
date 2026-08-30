import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItemRow from '../components/cart/CartItemRow'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import * as orderService from '../services/orderService'

export default function Cart() {
  const { cart, loading, error, updateItem, removeItem, userId, refreshCart } = useCart()
  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState(null)
  const navigate = useNavigate()

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setOrderError('Please enter a shipping address')
      return
    }
    setPlacing(true)
    setOrderError(null)
    try {
      const order = await orderService.createOrder(userId, address)
      await refreshCart()
      navigate('/orders', { state: { justPlacedOrderId: order.id } })
    } catch (err) {
      setOrderError(err.message)
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return <div className="page container"><Loader /></div>

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 20 }}>Your Cart</h1>
        <ErrorMessage message={error} />

        {!cart.items || cart.items.length === 0 ? (
          <div className="empty-state">Your cart is empty. Go add something nice!</div>
        ) : (
          <div className="card" style={{ padding: 20 }}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateItem}
                    onRemove={removeItem}
                  />
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, fontSize: 20 }}>
              <strong>Total: ₹{cart.totalAmount}</strong>
            </div>

            <div style={{ marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your full shipping address"
                />
              </div>
              <ErrorMessage message={orderError} />
              <button className="btn btn-primary" disabled={placing} onClick={handlePlaceOrder}>
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
