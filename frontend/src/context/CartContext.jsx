import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as cartService from '../services/cartService'

const CartContext = createContext(null)

// This project keeps auth simple (see README) - we operate as a fixed demo
// customer account seeded in data.sql (id=1, customer@example.com).
const DEMO_USER_ID = 1

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await cartService.getCart(DEMO_USER_ID)
      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = async (productId, quantity = 1) => {
    setError(null)
    try {
      const data = await cartService.addToCart(DEMO_USER_ID, productId, quantity)
      setCart(data)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, message: err.message }
    }
  }

  const updateItem = async (itemId, quantity) => {
    setError(null)
    try {
      const data = await cartService.updateCartItem(DEMO_USER_ID, itemId, quantity)
      setCart(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const removeItem = async (itemId) => {
    setError(null)
    try {
      const data = await cartService.removeCartItem(DEMO_USER_ID, itemId)
      setCart(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        itemCount,
        userId: DEMO_USER_ID,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
