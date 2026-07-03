import { ArrowLeft, MapPinned, ReceiptText, ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import EmptyState from '../components/EmptyState'
import { pedidosService } from '../services/api'

function CartPage({ cart, deliveryFee, embedded = false, onUpdateQuantity, onClearCart }) {
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
      <section className="page-banner">
        <div>
          <span className="eyebrow">{embedded ? 'Modulo de pedido' : 'Carrito de compras'}</span>
          <h2>Revisa tu pedido</h2>
        </div>
        {embedded ? null : (
          <Link className="ghost-button" to="/">
            <ArrowLeft size={16} />
            Volver al catalogo
          </Link>
        )}
      </section>

      <section className="cart-layout">
        <div className="cart-panel cart-items-panel">
          <div className="panel-headline">
            <div>
              <h3>Productos seleccionados</h3>
              <p className="muted-text">{cart.length} producto(s)</p>
            </div>
          </div>

          {cart.length ? (
            cart.map((item) => <CartItem item={item} key={item.id_producto} onUpdateQuantity={onUpdateQuantity} />)
          ) : (
            <EmptyState
              action={
                <Link className="primary-button" to="/">
                  <ArrowLeft size={16} />
                  Explorar el catalogo
                </Link>
              }
              icon={ShoppingCart}
              title="Tu carrito esta vacio"
            />
          )}
        </div>

        <aside className="cart-panel order-summary-card">
          <div className="panel-headline">
            <div>
              <h3>Resumen del pedido</h3>
            </div>
            <div className="icon-chip">
              <ReceiptText size={18} />
            </div>
          </div>

          <div className="summary-box">
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

            <div className="icon-input">
              <MapPinned size={18} />
              <div>
                <label htmlFor="direccion">Direccion de entrega</label>
                <input
                  className="search-input"
                  id="direccion"
                  onChange={(event) => setDireccionEntrega(event.target.value)}
                  value={direccionEntrega}
                />
              </div>
            </div>

            <button className="primary-button primary-button-wide" onClick={handleCheckout} type="button">
              <ShoppingCart size={16} />
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
