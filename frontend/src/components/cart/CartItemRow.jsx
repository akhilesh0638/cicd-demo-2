export default function CartItemRow({ item, onUpdateQuantity, onRemove }) {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={item.productImageUrl} alt={item.productName} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
          <span>{item.productName}</span>
        </div>
      </td>
      <td>₹{item.price}</td>
      <td>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
          style={{ width: 60, padding: 6, borderRadius: 6, border: '1px solid #e5e7eb' }}
        />
      </td>
      <td><strong>₹{item.subtotal}</strong></td>
      <td>
        <button className="btn btn-danger" onClick={() => onRemove(item.id)}>Remove</button>
      </td>
    </tr>
  )
}
