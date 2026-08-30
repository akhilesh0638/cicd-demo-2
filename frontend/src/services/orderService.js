import apiClient from './api'

export const createOrder = (userId, shippingAddress) =>
  apiClient.post('/orders', { userId, shippingAddress }).then((res) => res.data)

export const getOrdersByUser = (userId) =>
  apiClient.get(`/orders/user/${userId}`).then((res) => res.data)

export const getOrderById = (orderId) =>
  apiClient.get(`/orders/${orderId}`).then((res) => res.data)
