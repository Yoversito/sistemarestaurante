import {
  BarChart3,
  ClipboardList,
  FolderKanban,
  Menu,
  Package,
  Pencil,
  PlusCircle,
  Receipt,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import EmptyState from '../components/EmptyState'
import StatCard from '../components/StatCard'
import CartPage from './CartPage'
import HomePage from './HomePage'
import ReservationsPage from './ReservationsPage'
import { adminService, gestionService, reportesService, reservasService } from '../services/api'

const initialForm = {
  idCategoria: 1,
  nombre: '',
  descripcion: '',
  precio: '',
  imagenUrl: '',
  disponible: true,
  esPromocion: false,
  descuento: 0,
}

const sectionMeta = {
  dashboard: {
    title: 'Vision general del restaurante',
    eyebrow: 'Panel administrativo',
  },
  catalogo: {
    title: 'Catalogo de productos',
    eyebrow: 'Modulo de catalogo',
  },
  carrito: {
    title: 'Pedido actual y confirmacion de compra',
    eyebrow: 'Modulo de ventas',
  },
  reservas: {
    title: 'Reservas y ocupabilidad del salon',
    eyebrow: 'Modulo de reservas',
  },
  menu: {
    title: 'Administracion del menu y productos',
    eyebrow: 'Modulo operativo',
  },
  pedidos: {
    title: 'Seguimiento operativo de pedidos activos',
    eyebrow: 'Modulo logistico',
  },
  historial: {
    title: 'Historial de pedidos cerrados',
    eyebrow: 'Modulo historico',
  },
  reportes: {
    title: 'Analitica y reportes del negocio',
    eyebrow: 'Modulo gerencial',
  },
}

const validSections = Object.keys(sectionMeta)

const getStatusClass = (status) => {
  const normalized = String(status || '').toLowerCase()

  if (normalized.includes('pendiente')) return 'status-badge warning'
  if (normalized.includes('preparacion') || normalized.includes('camino')) return 'status-badge info'
  if (normalized.includes('entregado') || normalized.includes('asist')) return 'status-badge success'
  if (normalized.includes('cancel')) return 'status-badge danger'

  return 'status-badge'
}

const normalizeSection = (section) => (validSections.includes(section) ? section : 'dashboard')

function AdminPage({ addToCart, cart, cartCount, deliveryFee, onClearCart, onUpdateQuantity }) {
  const navigate = useNavigate()
  const { section } = useParams()
  const activeSection = normalizeSection(section)

  const [products, setProducts] = useState([])
  const [activeOrders, setActiveOrders] = useState([])
  const [historyOrders, setHistoryOrders] = useState([])
  const [reports, setReports] = useState({ ventas: null, volumen: [], ocupabilidad: [], clientesTop: [] })
  const [reservaSnapshot, setReservaSnapshot] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [editingProductId, setEditingProductId] = useState(null)
  const [message, setMessage] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (section !== activeSection) {
      navigate(`/admin/${activeSection}`, { replace: true })
    }
  }, [activeSection, navigate, section])

  const loadDashboard = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const [
        productsResponse,
        activeOrdersResponse,
        historyOrdersResponse,
        ventasResponse,
        volumenResponse,
        ocupabilidadResponse,
        clientesTopResponse,
        disponibilidadResponse,
      ] = await Promise.all([
        adminService.getProducts(),
        gestionService.getActiveOrders(),
        gestionService.getHistory(),
        reportesService.getVentas(),
        reportesService.getVolumenPedidos(),
        reportesService.getOcupabilidad(),
        reportesService.getClientesTop(),
        reservasService.checkAvailability({
          fecha: today,
          hora: '20:00',
          cantidadComensales: 1,
        }),
      ])

      setProducts(productsResponse.data)
      setActiveOrders(activeOrdersResponse.data)
      setHistoryOrders(historyOrdersResponse.data)
      setReports({
        ventas: ventasResponse.data,
        volumen: volumenResponse.data,
        ocupabilidad: ocupabilidadResponse.data,
        clientesTop: clientesTopResponse.data,
      })
      setReservaSnapshot(disponibilidadResponse.data)
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo cargar el panel administrador.')
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(loadDashboard)
  }, [loadDashboard])

  const resetForm = () => {
    setForm(initialForm)
    setEditingProductId(null)
  }

  const recentOrders = useMemo(() => activeOrders.slice(0, 5), [activeOrders])
  const activityFeed = useMemo(
    () => [...activeOrders.slice(0, 3), ...historyOrders.slice(0, 2)].slice(0, 5),
    [activeOrders, historyOrders]
  )
  const currentDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('es-PE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(new Date()),
    []
  )
  const availableProducts = useMemo(
    () => products.filter((product) => product.disponible).length,
    [products]
  )

  const handleCreateOrUpdateProduct = async (event) => {
    event.preventDefault()

    const payload = {
      ...form,
      precio: Number(form.precio),
      descuento: Number(form.descuento),
    }

    try {
      if (editingProductId) {
        await adminService.updateProduct(editingProductId, payload)
        setMessage('Producto actualizado correctamente.')
      } else {
        await adminService.createProduct(payload)
        setMessage('Producto creado correctamente.')
      }

      resetForm()
      await loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo guardar el producto.')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProductId(product.id_producto)
    setForm({
      idCategoria: Number(product.id_categoria),
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio,
      imagenUrl: product.imagen_url || '',
      disponible: Boolean(product.disponible),
      esPromocion: Boolean(product.es_promocion),
      descuento: product.descuento || 0,
    })
  }

  const handleQuickPriceUpdate = async (id, currentPrice) => {
    const nuevoPrecio = window.prompt('Nuevo precio del producto', currentPrice)
    if (!nuevoPrecio) return

    try {
      await adminService.updatePrice(id, Number(nuevoPrecio))
      setMessage('Precio actualizado correctamente.')
      await loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo actualizar el precio.')
    }
  }

  const handleToggleAvailability = async (product) => {
    try {
      await adminService.updateAvailability(product.id_producto, !product.disponible)
      setMessage('Disponibilidad actualizada correctamente.')
      await loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo cambiar la disponibilidad.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminService.deleteProduct(id)
      setMessage('Producto eliminado correctamente.')

      if (editingProductId === id) {
        resetForm()
      }

      await loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo eliminar el producto.')
    }
  }

  const handleStatusUpdate = async (id) => {
    const estado = window.prompt('Nuevo estado: pendiente, en_preparacion, en_camino, entregado, cancelado')
    if (!estado) return

    try {
      await gestionService.updateStatus(id, estado)
      setMessage('Estado del pedido actualizado.')
      await loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo actualizar el estado.')
    }
  }

  const handleAssignCourier = async (id) => {
    const repartidor = window.prompt('ID del repartidor a asignar', '1')
    if (!repartidor) return

    try {
      await gestionService.assignCourier(id, Number(repartidor))
      setMessage('Repartidor asignado correctamente.')
      await loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo asignar el repartidor.')
    }
  }

  const selectSection = (nextSection) => {
    navigate(`/admin/${nextSection}`)
    setIsSidebarOpen(false)
  }

  const renderTable = (rows, columns, getRowKey = (row) => row.id_pedido) => {
    if (!rows.length) {
      return <EmptyState icon={Receipt} title="No hay datos para mostrar" />
    }

    return (
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderDashboard = () => (
    <>
      <div className="stats-grid">
        <StatCard
          Icon={TrendingUp}
          title="Ingresos del dia"
          value={`S/ ${Number(reports.ventas?.indicadores_hoy?.ingresos_hoy || 0).toFixed(2)}`}
        />
        <StatCard Icon={ClipboardList} title="Pedidos pendientes" value={activeOrders.length} />
        <StatCard Icon={FolderKanban} title="Reservas" value={reservaSnapshot?.comensales_reservados || 0} />
        <StatCard
          Icon={Users}
          title="Nuevos clientes"
          value={reports.ventas?.indicadores_hoy?.nuevos_clientes_hoy || 0}
        />
      </div>

      <div className="stack-grid stack-grid-admin">
        <section className="admin-table">
          <div className="panel-headline panel-headline-padded">
            <div>
              <h3>Pedidos recientes</h3>
              <p className="muted-text">Seguimiento inmediato de operaciones en curso.</p>
            </div>
          </div>

          {renderTable(recentOrders, [
            { key: 'pedido', label: 'Pedido', render: (order) => `#${order.id_pedido}` },
            { key: 'cliente', label: 'Cliente', render: (order) => order.cliente_nombre },
            {
              key: 'estado',
              label: 'Estado',
              render: (order) => <span className={getStatusClass(order.estado)}>{order.estado}</span>,
            },
            { key: 'total', label: 'Total', render: (order) => `S/ ${Number(order.total).toFixed(2)}` },
          ])}
        </section>

        <div className="stack-grid summary-stack">
          <section className="report-card report-highlight-card">
            <div className="panel-headline">
              <div>
                <h3>Resumen operativo</h3>
              </div>
            </div>
            <div className="report-list">
              <div className="summary-row">
                <span>Productos activos</span>
                <strong>{availableProducts}</strong>
              </div>
              <div className="summary-row">
                <span>Pedidos en cocina y ruta</span>
                <strong>{activeOrders.length}</strong>
              </div>
              <div className="summary-row">
                <span>Registros en historial</span>
                <strong>{historyOrders.length}</strong>
              </div>
              <div className="summary-row">
                <span>Clientes top cargados</span>
                <strong>{reports.clientesTop.length}</strong>
              </div>
            </div>
          </section>

          <section className="report-card activity-card">
            <div className="panel-headline">
              <div>
                <h3>Actividad reciente</h3>
              </div>
            </div>

            {activityFeed.length ? (
              <div className="activity-list">
                {activityFeed.map((item) => (
                  <div className="activity-item" key={`${item.id_pedido}-${item.estado}`}>
                    <div className="icon-chip soft">
                      <Receipt size={16} />
                    </div>
                    <div>
                      <strong>Pedido #{item.id_pedido}</strong>
                      <p className="muted-text">{item.cliente_nombre}</p>
                    </div>
                    <span className={getStatusClass(item.estado)}>{item.estado}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={ClipboardList} title="Sin actividad reciente" />
            )}
          </section>
        </div>
      </div>
    </>
  )

  const renderMenu = () => (
    <>
      <form className="panel admin-form-card form-grid" onSubmit={handleCreateOrUpdateProduct}>
        <div className="panel-headline">
          <div>
            <h3>{editingProductId ? 'Editar producto' : 'Agregar producto'}</h3>
            <p className="muted-text">
              {editingProductId
                ? 'Actualiza la informacion completa del producto seleccionado.'
                : 'Registra nuevos productos sin salir del panel.'}
            </p>
          </div>
          <div className="icon-chip">
            {editingProductId ? <Pencil size={18} /> : <PlusCircle size={18} />}
          </div>
        </div>

        <div className="grid-2">
          <input
            onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
            placeholder="Nombre del producto"
            value={form.nombre}
          />
          <select
            onChange={(event) => setForm((current) => ({ ...current, idCategoria: Number(event.target.value) }))}
            value={form.idCategoria}
          >
            <option value="1">Entradas</option>
            <option value="2">Fondos</option>
            <option value="3">Bebidas</option>
            <option value="4">Postres</option>
          </select>
        </div>

        <div className="grid-2">
          <input
            onChange={(event) => setForm((current) => ({ ...current, precio: event.target.value }))}
            placeholder="Precio"
            type="number"
            value={form.precio}
          />
          <input
            onChange={(event) => setForm((current) => ({ ...current, imagenUrl: event.target.value }))}
            placeholder="URL de imagen"
            value={form.imagenUrl}
          />
        </div>

        <textarea
          onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))}
          placeholder="Descripcion"
          rows="3"
          value={form.descripcion}
        />

        <div className="grid-2">
          <select
            onChange={(event) => setForm((current) => ({ ...current, esPromocion: event.target.value === 'true' }))}
            value={String(form.esPromocion)}
          >
            <option value="false">Sin promocion</option>
            <option value="true">Con promocion</option>
          </select>
          <input
            onChange={(event) => setForm((current) => ({ ...current, descuento: event.target.value }))}
            placeholder="Descuento %"
            type="number"
            value={form.descuento}
          />
        </div>

        <div className="inline-actions inline-actions-stretch">
          <button className="primary-button" type="submit">
            {editingProductId ? <Pencil size={16} /> : <PlusCircle size={16} />}
            {editingProductId ? 'Guardar cambios' : 'Guardar producto'}
          </button>
          {editingProductId ? (
            <button className="ghost-button" onClick={resetForm} type="button">
              Cancelar edicion
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-products-grid">
        {products.length ? (
          products.map((product) => (
            <article className="report-card product-admin-card" key={product.id_producto}>
              <img
                alt={product.nombre}
                className="admin-product-image"
                onError={(event) => {
                  event.currentTarget.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'
                }}
                src={product.imagen_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'}
              />
              <div className="product-meta">
                <span className="pill pill-soft">{product.categoria_nombre}</span>
                <span className={product.disponible ? 'status-badge success' : 'status-badge danger'}>
                  {product.disponible ? 'Disponible' : 'Pausado'}
                </span>
              </div>
              <h3>{product.nombre}</h3>
              <p className="muted-text">{product.descripcion}</p>
              <div className="summary-row">
                <span>Precio actual</span>
                <strong>S/ {Number(product.precio).toFixed(2)}</strong>
              </div>
              <div className="product-admin-actions">
                <button className="small-button primary" onClick={() => handleEditProduct(product)} type="button">
                  Editar
                </button>
                <button
                  className="small-button"
                  onClick={() => handleQuickPriceUpdate(product.id_producto, product.precio)}
                  type="button"
                >
                  Precio rapido
                </button>
                <button className="small-button" onClick={() => handleToggleAvailability(product)} type="button">
                  {product.disponible ? 'Desactivar' : 'Activar'}
                </button>
                <button className="danger-button" onClick={() => handleDelete(product.id_producto)} type="button">
                  Eliminar
                </button>
              </div>
            </article>
          ))
        ) : (
          <EmptyState icon={Package} title="No hay productos para mostrar" />
        )}
      </div>
    </>
  )

  const renderPedidos = () => (
    <section className="admin-table">
      <div className="panel-headline panel-headline-padded">
        <div>
          <h3>Pedidos activos</h3>
          <p className="muted-text">Control de estados y asignacion de repartidores.</p>
        </div>
      </div>

      {renderTable(activeOrders, [
        { key: 'pedido', label: 'Pedido', render: (order) => `#${order.id_pedido}` },
        { key: 'cliente', label: 'Cliente', render: (order) => order.cliente_nombre },
        {
          key: 'estado',
          label: 'Estado',
          render: (order) => <span className={getStatusClass(order.estado)}>{order.estado}</span>,
        },
        { key: 'repartidor', label: 'Repartidor', render: (order) => order.repartidor_nombre || 'Sin asignar' },
        {
          key: 'acciones',
          label: 'Acciones',
          render: (order) => (
            <div className="inline-actions">
              <button className="small-button primary" onClick={() => handleStatusUpdate(order.id_pedido)} type="button">
                Estado
              </button>
              <button className="small-button" onClick={() => handleAssignCourier(order.id_pedido)} type="button">
                Repartidor
              </button>
            </div>
          ),
        },
      ])}
    </section>
  )

  const renderHistorial = () => (
    <section className="admin-table">
      <div className="panel-headline panel-headline-padded">
        <div>
          <h3>Historial de pedidos</h3>
          <p className="muted-text">Pedidos entregados o cancelados registrados en el sistema.</p>
        </div>
      </div>

      {renderTable(historyOrders, [
        { key: 'pedido', label: 'Pedido', render: (order) => `#${order.id_pedido}` },
        { key: 'cliente', label: 'Cliente', render: (order) => order.cliente_nombre },
        {
          key: 'estado',
          label: 'Estado',
          render: (order) => <span className={getStatusClass(order.estado)}>{order.estado}</span>,
        },
        { key: 'fecha', label: 'Fecha', render: (order) => new Date(order.fecha_hora).toLocaleString('es-PE') },
        { key: 'total', label: 'Total', render: (order) => `S/ ${Number(order.total).toFixed(2)}` },
      ])}
    </section>
  )

  const renderReportes = () => (
    <div className="reports-grid">
      <article className="report-card report-highlight-card">
        <div className="panel-headline">
          <div>
            <h3>Ventas acumuladas</h3>
          </div>
          <div className="icon-chip">
            <TrendingUp size={18} />
          </div>
        </div>
        <strong className="report-highlight-value">
          S/ {Number(reports.ventas?.resumen?.ingresos_totales || 0).toFixed(2)}
        </strong>
        <p className="muted-text">Promedio: S/ {Number(reports.ventas?.resumen?.ticket_promedio || 0).toFixed(2)}</p>
      </article>

      <article className="report-card">
        <h3>Volumen de pedidos</h3>
        {reports.volumen.length ? (
          <div className="report-list">
            {reports.volumen.map((item) => (
              <div className="summary-row" key={item.estado}>
                <span>{item.estado}</span>
                <strong>{item.cantidad}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={BarChart3} title="Sin reporte de volumen" />
        )}
      </article>

      <article className="report-card">
        <h3>Clientes frecuentes</h3>
        {reports.clientesTop.length ? (
          <div className="report-list">
            {reports.clientesTop.slice(0, 5).map((client) => (
              <div className="summary-row" key={client.id_cliente}>
                <span>{client.nombre}</span>
                <strong>S/ {Number(client.gasto_total).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Users} title="Sin ranking disponible" />
        )}
      </article>

      <article className="report-card">
        <h3>Ocupabilidad reciente</h3>
        {reports.ocupabilidad.length ? (
          <div className="report-list">
            {reports.ocupabilidad.map((item) => (
              <div className="summary-row" key={item.fecha}>
                <span>{item.fecha}</span>
                <strong>{item.ocupabilidad_porcentaje}%</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={FolderKanban} title="Sin datos de ocupabilidad" />
        )}
      </article>
    </div>
  )

  const renderSection = () => {
    if (activeSection === 'dashboard') return renderDashboard()
    if (activeSection === 'catalogo') return <HomePage addToCart={addToCart} cartCount={cartCount} embedded />
    if (activeSection === 'carrito') {
      return (
        <CartPage
          cart={cart}
          deliveryFee={deliveryFee}
          embedded
          onClearCart={onClearCart}
          onUpdateQuantity={onUpdateQuantity}
        />
      )
    }
    if (activeSection === 'reservas') return <ReservationsPage embedded reportData={reports.ocupabilidad} snapshot={reservaSnapshot} />
    if (activeSection === 'menu') return renderMenu()
    if (activeSection === 'pedidos') return renderPedidos()
    if (activeSection === 'historial') return renderHistorial()

    return renderReportes()
  }

  const meta = sectionMeta[activeSection]

  return (
    <div className="admin-shell">
      <AdminSidebar
        activeSection={activeSection}
        cartCount={cartCount}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelect={selectSection}
      />

      <div className="admin-layout">
        <section className="admin-content">
          <div className="admin-topbar">
            <div className="topbar-title-group">
              <button className="admin-mobile-trigger" onClick={() => setIsSidebarOpen(true)} type="button">
                <Menu size={18} />
              </button>
              <div>
                <span className="eyebrow">{meta.eyebrow}</span>
                <h2>{meta.title}</h2>
              </div>
            </div>

            <div className="topbar-actions">
              <div className="topbar-chip subtle">
                <ClipboardList size={16} />
                {currentDateLabel}
              </div>
              <div className="topbar-chip">
                <Store size={16} />
                {availableProducts} productos disponibles
              </div>
              <div className="topbar-chip accent">
                <TrendingUp size={16} />
                S/ {Number(reports.ventas?.indicadores_hoy?.ingresos_hoy || 0).toFixed(2)} hoy
              </div>
            </div>
          </div>

          {message ? <div className="message">{message}</div> : null}
          {renderSection()}
        </section>
      </div>
    </div>
  )
}

export default AdminPage
