import {
  BarChart3,
  ClipboardList,
  FolderKanban,
  History,
  LayoutDashboard,
  MenuSquare,
  ShoppingCart,
  Store,
  X,
} from 'lucide-react'

const sections = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'catalogo', label: 'Catalogo', Icon: Store },
  { key: 'carrito', label: 'Carrito / Pedido', Icon: ShoppingCart },
  { key: 'reservas', label: 'Reservas', Icon: FolderKanban },
  { key: 'menu', label: 'Menu', Icon: MenuSquare },
  { key: 'pedidos', label: 'Pedidos Activos', Icon: ClipboardList },
  { key: 'historial', label: 'Historial', Icon: History },
  { key: 'reportes', label: 'Reportes', Icon: BarChart3 },
]

function AdminSidebar({ activeSection, cartCount, isOpen, onClose, onSelect }) {
  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'visible' : ''}`} onClick={onClose} role="presentation" />
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div>
            <span className="eyebrow">Admin</span>
            <h2>Sabores del Valle</h2>
          </div>
          <button className="sidebar-close" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-menu">
          {sections.map(({ key, label, Icon }) => (
            <button
              className={`sidebar-button ${activeSection === key ? 'active' : ''}`}
              key={key}
              onClick={() => onSelect(key)}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>
              {key === 'carrito' && cartCount ? <small className="sidebar-badge">{cartCount}</small> : null}
            </button>
          ))}
        </div>

        <div className="sidebar-footer-card">
          <p>Panel integral para catalogo, pedidos, reservas y operacion diaria.</p>
        </div>

      </aside>
    </>
  )
}

export default AdminSidebar
