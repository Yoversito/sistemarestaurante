function CartItem({ item, onUpdateQuantity }) {
  return (
    <div className="cart-item">
      <div className="cart-line">
        <div>
          <strong>{item.nombre}</strong>
          <p className="muted-text">S/ {Number(item.precio).toFixed(2)} por unidad</p>
        </div>
        <strong>S/ {(Number(item.precio) * item.quantity).toFixed(2)}</strong>
      </div>
      <div className="quantity-controls">
        <button className="quantity-button" onClick={() => onUpdateQuantity(item.id_producto, item.quantity - 1)} type="button">
          -
        </button>
        <span>{item.quantity}</span>
        <button className="quantity-button" onClick={() => onUpdateQuantity(item.id_producto, item.quantity + 1)} type="button">
          +
        </button>
      </div>
    </div>
  )
}

export default CartItem
