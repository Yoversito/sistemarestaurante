import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import StatCard from '../components/StatCard'
import {
  adminService,
  gestionService,
  reportesService,
  reservasService,
} from '../services/api'

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

function AdminPage() {
  const [activeSection, setActiveSection] = useState('Inicio')
  const [products, setProducts] = useState([])
  const [activeOrders, setActiveOrders] = useState([])
  const [historyOrders, setHistoryOrders] = useState([])
  const [reports, setReports] = useState({ ventas: null, volumen: [], ocupabilidad: [], clientesTop: [] })
  const [reservaSnapshot, setReservaSnapshot] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const loadDashboard = async () => {
    try {
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
          fecha: new Date().toISOString().split('T')[0],
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
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const recentOrders = useMemo(() => activeOrders.slice(0, 5), [activeOrders])

  const handleCreateProduct = async (event) => {
    event.preventDefault()

    try {
      await adminService.createProduct({
        ...form,
        precio: Number(form.precio),
        descuento: Number(form.descuento),
      })
      setForm(initialForm)
      setMessage('Producto creado correctamente.')
      loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo crear el producto.')
    }
  }

  const handleQuickPriceUpdate = async (id, currentPrice) => {
    const nuevoPrecio = window.prompt('Nuevo precio del producto', currentPrice)
    if (!nuevoPrecio) return

    try {
      await adminService.updatePrice(id, Number(nuevoPrecio))
      setMessage('Precio actualizado correctamente.')
      loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo actualizar el precio.')
    }
  }

  const handleToggleAvailability = async (product) => {
    try {
      await adminService.updateAvailability(product.id_producto, !product.disponible)
      setMessage('Disponibilidad actualizada correctamente.')
      loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo cambiar la disponibilidad.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await adminService.deleteProduct(id)
      setMessage('Producto eliminado correctamente.')
      loadDashboard()
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
      loadDashboard()
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
      loadDashboard()
    } catch (error) {
      setMessage(error.response?.data?.message || 'No se pudo asignar el repartidor.')
    }
  }

  const renderSection = () => {
    if (activeSection === 'Inicio') {
      return (
        <>
          <div className="stats-grid">
            <StatCard
              description="Facturacion registrada en pedidos del dia."
              title="Ingresos del dia"
              value={`S/ ${Number(reports.ventas?.indicadores_hoy?.ingresos_hoy || 0).toFixed(2)}`}
            />
            <StatCard
              description="Pedidos en cola o en reparto."
              title="Pedidos pendientes"
              value={activeOrders.length}
            />
            <StatCard
              description="Capacidad consultada para el turno principal."
              title="Mesas reservadas"
              value={reservaSnapshot?.comensales_reservados || 0}
            />
            <StatCard
              description="Clientes registrados en la fecha actual."
              title="Nuevos clientes"
              value={reports.ventas?.indicadores_hoy?.nuevos_clientes_hoy || 0}
            />
          </div>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id_pedido}>
                    <td>#{order.id_pedido}</td>
                    <td>{order.cliente_nombre}</td>
                    <td>{order.estado}</td>
                    <td>S/ {Number(order.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )
    }

    if (activeSection === 'Menu') {
      return (
        <>
          <form className="panel form-grid" onSubmit={handleCreateProduct}>
            <h3>Agregar producto</h3>
            <div className="grid-2">
              <input onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} placeholder="Nombre del producto" value={form.nombre} />
              <select onChange={(event) => setForm((current) => ({ ...current, idCategoria: Number(event.target.value) }))} value={form.idCategoria}>
                <option value="1">Entradas</option>
                <option value="2">Fondos</option>
                <option value="3">Bebidas</option>
                <option value="4">Postres</option>
              </select>
            </div>
            <div className="grid-2">
              <input onChange={(event) => setForm((current) => ({ ...current, precio: event.target.value }))} placeholder="Precio" type="number" value={form.precio} />
              <input onChange={(event) => setForm((current) => ({ ...current, imagenUrl: event.target.value }))} placeholder="URL de imagen" value={form.imagenUrl} />
            </div>
            <textarea onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} placeholder="Descripcion" rows="3" value={form.descripcion} />
            <div className="grid-2">
              <select onChange={(event) => setForm((current) => ({ ...current, esPromocion: event.target.value === 'true' }))} value={String(form.esPromocion)}>
                <option value="false">Sin promocion</option>
                <option value="true">Con promocion</option>
              </select>
              <input onChange={(event) => setForm((current) => ({ ...current, descuento: event.target.value }))} placeholder="Descuento %" type="number" value={form.descuento} />
            </div>
            <button className="primary-button" type="submit">
              Guardar producto
            </button>
          </form>

          <div className="admin-products-grid">
            {products.map((product) => (
              <article className="report-card" key={product.id_producto}>
                <div className="product-meta">
                  <span className="pill">{product.categoria_nombre}</span>
                  <span className="pill">{product.disponible ? 'Disponible' : 'Pausado'}</span>
                </div>
                <h3>{product.nombre}</h3>
                <p className="muted-text">{product.descripcion}</p>
                <div className="summary-row">
                  <span>Precio</span>
                  <strong>S/ {Number(product.precio).toFixed(2)}</strong>
                </div>
                <div className="inline-actions">
                  <button className="small-button primary" onClick={() => handleQuickPriceUpdate(product.id_producto, product.precio)} type="button">
                    Editar precio
                  </button>
                  <button className="small-button" onClick={() => handleToggleAvailability(product)} type="button">
                    {product.disponible ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="danger-button" onClick={() => handleDelete(product.id_producto)} type="button">
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )
    }

    if (activeSection === 'Pedidos Activos') {
      return (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Repartidor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map((order) => (
                <tr key={order.id_pedido}>
                  <td>#{order.id_pedido}</td>
                  <td>{order.cliente_nombre}</td>
                  <td>{order.estado}</td>
                  <td>{order.repartidor_nombre || 'Sin asignar'}</td>
                  <td>
                    <div className="inline-actions">
                      <button className="small-button primary" onClick={() => handleStatusUpdate(order.id_pedido)} type="button">
                        Estado
                      </button>
                      <button className="small-button" onClick={() => handleAssignCourier(order.id_pedido)} type="button">
                        Repartidor
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (activeSection === 'Historial') {
      return (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {historyOrders.map((order) => (
                <tr key={order.id_pedido}>
                  <td>#{order.id_pedido}</td>
                  <td>{order.cliente_nombre}</td>
                  <td>{order.estado}</td>
                  <td>S/ {Number(order.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (activeSection === 'Reservas') {
      return (
        <div className="report-card">
          <h3>Resumen de ocupabilidad</h3>
          {reports.ocupabilidad.map((item) => (
            <div className="summary-row" key={item.fecha}>
              <span>{item.fecha}</span>
              <strong>{item.ocupabilidad_porcentaje}%</strong>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="reports-grid">
        <article className="report-card">
          <h3>Ventas</h3>
          <p className="muted-text">Ticket promedio: S/ {Number(reports.ventas?.resumen?.ticket_promedio || 0).toFixed(2)}</p>
          <strong>S/ {Number(reports.ventas?.resumen?.ingresos_totales || 0).toFixed(2)}</strong>
        </article>
        <article className="report-card">
          <h3>Volumen de pedidos</h3>
          {reports.volumen.map((item) => (
            <div className="summary-row" key={item.estado}>
              <span>{item.estado}</span>
              <strong>{item.cantidad}</strong>
            </div>
          ))}
        </article>
        <article className="report-card">
          <h3>Clientes frecuentes</h3>
          {reports.clientesTop.slice(0, 5).map((client) => (
            <div className="summary-row" key={client.id_cliente}>
              <span>{client.nombre}</span>
              <strong>S/ {Number(client.gasto_total).toFixed(2)}</strong>
            </div>
          ))}
        </article>
      </div>
    )
  }

  return (
    <div className="admin-layout">
      <AdminSidebar activeSection={activeSection} onSelect={setActiveSection} />
      <section className="admin-content">
        <div>
          <h2>{activeSection}</h2>
          <p className="section-copy">Panel operativo con gestion de menu, pedidos, reservas y reportes.</p>
        </div>
        {message ? <div className="message">{message}</div> : null}
        {renderSection()}
      </section>
    </div>
  )
}

export default AdminPage
