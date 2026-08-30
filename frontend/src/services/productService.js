import apiClient from './api'

export const getAllProducts = (params = {}) =>
  apiClient.get('/products', { params }).then((res) => res.data)

export const getProductById = (id) =>
  apiClient.get(`/products/${id}`).then((res) => res.data)

export const searchProducts = (keyword) =>
  apiClient.get('/products', { params: { search: keyword } }).then((res) => res.data)

export const getProductsByCategory = (categoryId) =>
  apiClient.get('/products', { params: { categoryId } }).then((res) => res.data)

export const createProduct = (payload) =>
  apiClient.post('/products', payload).then((res) => res.data)

export const updateProduct = (id, payload) =>
  apiClient.put(`/products/${id}`, payload).then((res) => res.data)

export const deleteProduct = (id) => apiClient.delete(`/products/${id}`)

export const updateProductStock = (id, stock) =>
  apiClient.patch(`/products/${id}/stock`, { stock }).then((res) => res.data)
