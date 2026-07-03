import { Minus, Plus, Trash2 } from 'lucide-react'

const fallbackImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'

function CartItem({ item, onUpdateQuantity }) {
  const image = item.imagen_url || fallbackImage

  return (
    <div className="cart-item">
      <div className="cart-product">
        <img
          alt={item.nombre}
          className="cart-thumbnail"
          onError={(event) => {
            event.currentTarget.src = fallbackImage
          }}
          src={image}
        />

        <div className="cart-copy">
          <div className="cart-line">
            <div>
              <strong>{item.nombre}</strong>
              <p className="muted-text">S/ {Number(item.precio).toFixed(2)} por unidad</p>
            </div>
            <strong className="cart-line-total">S/ {(Number(item.precio) * item.quantity).toFixed(2)}</strong>
          </div>

          <div className="cart-actions-row">
            <div className="quantity-controls">
              <button className="quantity-button" onClick={() => onUpdateQuantity(item.id_producto, item.quantity - 1)} type="button">
                <Minus size={14} />
              </button>
              <span className="quantity-value">{item.quantity}</span>
              <button className="quantity-button" onClick={() => onUpdateQuantity(item.id_producto, item.quantity + 1)} type="button">
                <Plus size={14} />
              </button>
            </div>

            <button className="ghost-button ghost-danger" onClick={() => onUpdateQuantity(item.id_producto, 0)} type="button">
              <Trash2 size={14} />
              Quitar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
