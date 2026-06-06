import { NavLink } from 'react-router-dom'

function Navbar({ cartCount }) {
  const getLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <header className="navbar">
      <div>
        <h1 className="brand-title">Sabores del Valle</h1>
        <p className="brand-subtitle">Sistema integral web de gestion y pedidos para restaurantes</p>
      </div>

      <nav className="nav-links">
        <NavLink className={getLinkClass} to="/">
          Catalogo
        </NavLink>
        <NavLink className={getLinkClass} to="/reservas">
          Reservas
        </NavLink>
        <NavLink className={getLinkClass} to="/carrito">
          Carrito ({cartCount})
        </NavLink>
        <NavLink className={getLinkClass} to="/admin">
          Panel Admin
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
