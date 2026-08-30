import { useEffect, useState } from 'react'
import * as productService from '../services/productService'
import * as categoryService from '../services/categoryService'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'

const emptyForm = { id: null, name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const loadProducts = () => {
    setLoading(true)
    productService
      .getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
    categoryService.getAllCategories().then(setCategories).catch((err) => setError(err.message))
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditing(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
      categoryId: Number(form.categoryId),
    }

    try {
      if (editing) {
        await productService.updateProduct(form.id, payload)
        setSuccess('Product updated successfully')
      } else {
        await productService.createProduct(payload)
        setSuccess('Product created successfully')
      }
      resetForm()
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (product) => {
    setEditing(true)
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await productService.deleteProduct(id)
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStockChange = async (id, stock) => {
    try {
      await productService.updateProductStock(id, Number(stock))
      loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 20 }}>Admin - Manage Products</h1>

        <ErrorMessage message={error} />
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ marginTop: 0 }}>{editing ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input required type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">{editing ? 'Update Product' : 'Add Product'}</button>
            {editing && (
              <button type="button" className="btn btn-outline" style={{ marginLeft: 10 }} onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="card" style={{ padding: 20 }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.categoryName}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        defaultValue={p.stock}
                        style={{ width: 70, padding: 6, borderRadius: 6, border: '1px solid #e5e7eb' }}
                        onBlur={(e) => {
                          if (Number(e.target.value) !== p.stock) handleStockChange(p.id, e.target.value)
                        }}
                      />
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
