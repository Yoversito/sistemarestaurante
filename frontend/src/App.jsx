import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import './App.css'

const DELIVERY_FEE = 7.5

function AppLayout() {
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
    <div className="app-shell app-shell-admin">
      <main className="page-shell admin-page-shell">
        <Routes>
          <Route path="/" element={<Navigate replace to="/admin/dashboard" />} />
          <Route path="/admin" element={<Navigate replace to="/admin/dashboard" />} />
          <Route
            path="/admin/:section"
            element={
              <AdminPage
                addToCart={addToCart}
                cart={cart}
                cartCount={cartCount}
                deliveryFee={DELIVERY_FEE}
                onClearCart={clearCart}
                onUpdateQuantity={updateCartItem}
              />
            }
          />
          <Route path="/catalogo" element={<Navigate replace to="/admin/catalogo" />} />
          <Route path="/carrito" element={<Navigate replace to="/admin/carrito" />} />
          <Route path="/reservas" element={<Navigate replace to="/admin/reservas" />} />
          <Route path="*" element={<Navigate replace to="/admin/dashboard" />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
