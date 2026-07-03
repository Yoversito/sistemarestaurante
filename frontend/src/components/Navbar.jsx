import { CalendarDays, ChefHat, LayoutDashboard, ShoppingBag, ShoppingCart } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Catalogo', Icon: ShoppingBag },
  { to: '/reservas', label: 'Reservas', Icon: CalendarDays },
  { to: '/carrito', label: 'Carrito', Icon: ShoppingCart },
  { to: '/admin', label: 'Panel Admin', Icon: LayoutDashboard },
]

function Navbar({ cartCount }) {
  const getLinkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`

  return (
    <header className="navbar">
      <div className="brand-block">
        <div className="brand-mark">
          <ChefHat size={20} />
        </div>
        <div>
          <h1 className="brand-title">Sabores del Valle</h1>
          <p className="brand-subtitle">Menu digital</p>
        </div>
      </div>

      <nav className="nav-links">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink className={getLinkClass} key={to} to={to}>
            <Icon size={16} />
            <span>{label}</span>
            {to === '/carrito' ? <span className="nav-badge">{cartCount}</span> : null}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
