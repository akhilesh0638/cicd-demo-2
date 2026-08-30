import apiClient from './api'

export const getAllCategories = () =>
  apiClient.get('/categories').then((res) => res.data)

export const createCategory = (payload) =>
  apiClient.post('/categories', payload).then((res) => res.data)
