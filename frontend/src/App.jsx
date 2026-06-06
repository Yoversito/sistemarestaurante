import { useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminPage from './pages/AdminPage'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import ReservationsPage from './pages/ReservationsPage'
import './App.css'

const DELIVERY_FEE = 7.5

function App() {
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find((item) => item.id_producto === product.id_producto)

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id_producto === product.id_producto ? { ...item, quantity: item.quantity + 1 } : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  const updateCartItem = (idProducto, quantity) => {
    setCart((currentCart) =>
      currentCart
        .map((item) => (item.id_producto === idProducto ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => setCart([])

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  )

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar cartCount={cartCount} />
        <main className="page-shell">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route
              path="/carrito"
              element={
                <CartPage
                  cart={cart}
                  deliveryFee={DELIVERY_FEE}
                  onUpdateQuantity={updateCartItem}
                  onClearCart={clearCart}
                />
              }
            />
            <Route path="/reservas" element={<ReservationsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
