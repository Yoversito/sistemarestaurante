import { useMemo, useState } from 'react'
import CartItem from '../components/CartItem'
import { pedidosService } from '../services/api'

function CartPage({ cart, deliveryFee, onUpdateQuantity, onClearCart }) {
  const [direccionEntrega, setDireccionEntrega] = useState('Av. Principal 450, Huanuco')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + Number(item.precio) * item.quantity, 0),
    [cart]
  )
  const total = subtotal + deliveryFee

  const handleCheckout = async () => {
    if (!cart.length) {
      setSuccess(false)
      setMessage('Agrega productos al carrito antes de confirmar el pedido.')
      return
    }

    try {
      const payload = {
        idCliente: 1,
        direccionEntrega,
        tarifaEnvio: deliveryFee,
        items: cart.map((item) => ({
          idProducto: item.id_producto,
          cantidad: item.quantity,
        })),
      }

      const response = await pedidosService.checkout(payload)
      setSuccess(true)
      setMessage(`Pedido #${response.data.pedido.id_pedido} confirmado correctamente.`)
      onClearCart()
    } catch (error) {
      setSuccess(false)
      setMessage(error.response?.data?.message || 'No se pudo confirmar el pedido.')
    }
  }

  return (
    <div className="page-grid">
      <div className="page-header">
        <h2>Carrito de compras</h2>
        <p>Modifica cantidades, revisa montos y confirma el pedido delivery.</p>
      </div>

      <section className="cart-layout">
        <div className="cart-panel">
          {cart.length ? (
            cart.map((item) => <CartItem item={item} key={item.id_producto} onUpdateQuantity={onUpdateQuantity} />)
          ) : (
            <div className="empty-state">Tu carrito esta vacio por ahora.</div>
          )}
        </div>

        <aside className="cart-panel">
          <div className="summary-box">
            <h3>Resumen</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>S/ {subtotal.toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>Tarifa de envio</span>
              <strong>S/ {deliveryFee.toFixed(2)}</strong>
            </div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <strong>S/ {total.toFixed(2)}</strong>
            </div>
            <div>
              <label htmlFor="direccion">Direccion de entrega</label>
              <input
                className="search-input"
                id="direccion"
                onChange={(event) => setDireccionEntrega(event.target.value)}
                value={direccionEntrega}
              />
            </div>
            <button className="primary-button" onClick={handleCheckout} type="button">
              Confirmar pedido
            </button>
            {message ? <div className={`message ${success ? 'success' : ''}`}>{message}</div> : null}
          </div>
        </aside>
      </section>
    </div>
  )
}

export default CartPage
