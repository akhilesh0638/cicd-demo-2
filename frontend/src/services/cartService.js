import apiClient from './api'

export const getCart = (userId) =>
  apiClient.get(`/cart/${userId}`).then((res) => res.data)

export const addToCart = (userId, productId, quantity) =>
  apiClient
    .post(`/cart/${userId}/items`, { productId, quantity })
    .then((res) => res.data)

export const updateCartItem = (userId, itemId, quantity) =>
  apiClient
    .put(`/cart/${userId}/items/${itemId}`, { quantity })
    .then((res) => res.data)

export const removeCartItem = (userId, itemId) =>
  apiClient.delete(`/cart/${userId}/items/${itemId}`).then((res) => res.data)

export const clearCart = (userId) => apiClient.delete(`/cart/${userId}`)
