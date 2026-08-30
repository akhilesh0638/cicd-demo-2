export default function CategoryFilter({ categories, selectedCategoryId, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
      <button
        className="btn"
        style={{
          background: !selectedCategoryId ? '#2563eb' : '#fff',
          color: !selectedCategoryId ? '#fff' : '#1f2937',
          border: '1px solid #e5e7eb',
        }}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="btn"
          style={{
            background: selectedCategoryId === cat.id ? '#2563eb' : '#fff',
            color: selectedCategoryId === cat.id ? '#fff' : '#1f2937',
            border: '1px solid #e5e7eb',
          }}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
