const sections = ['Inicio', 'Menu', 'Pedidos Activos', 'Historial', 'Reservas', 'Reportes']

function AdminSidebar({ activeSection, onSelect }) {
  return (
    <aside className="admin-sidebar">
      <h2>Administracion</h2>
      <p className="muted-text">Control diario del restaurante y del delivery.</p>
      <div className="sidebar-menu">
        {sections.map((section) => (
          <button
            className={`sidebar-button ${activeSection === section ? 'active' : ''}`}
            key={section}
            onClick={() => onSelect(section)}
            type="button"
          >
            {section}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default AdminSidebar
