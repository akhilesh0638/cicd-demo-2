import { useEffect, useState } from 'react'
import * as productService from '../services/productService'
import * as categoryService from '../services/categoryService'
import ProductCard from '../components/product/ProductCard'
import CategoryFilter from '../components/product/CategoryFilter'
import Loader from '../components/common/Loader'
import ErrorMessage from '../components/common/ErrorMessage'
import { useCart } from '../context/CartContext'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories).catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetcher = searchTerm
      ? productService.searchProducts(searchTerm)
      : selectedCategoryId
      ? productService.getProductsByCategory(selectedCategoryId)
      : productService.getAllProducts()

    fetcher
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [selectedCategoryId, searchTerm])

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1>All Products</h1>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSelectedCategoryId(null)
              setSearchTerm(e.target.value)
            }}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', width: 260 }}
          />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={(id) => {
            setSearchTerm('')
            setSelectedCategoryId(id)
          }}
        />

        <ErrorMessage message={error} />

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="empty-state">No products found.</div>
        ) : (
          <div className="grid grid-products">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={(id) => addItem(id, 1)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
