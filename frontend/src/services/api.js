import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
})

export const menuService = {
  getProducts: () => api.get('/menu/productos'),
  getPromotions: () => api.get('/menu/promociones'),
}

export const pedidosService = {
  checkout: (payload) => api.post('/pedidos/checkout', payload),
  getByClient: (idCliente) => api.get(`/pedidos/cliente/${idCliente}`),
  getStatus: (idPedido) => api.get(`/pedidos/${idPedido}/estado`),
}

export const reservasService = {
  checkAvailability: (params) => api.get('/reservas/disponibilidad', { params }),
  create: (payload) => api.post('/reservas', payload),
}

export const gestionService = {
  getActiveOrders: () => api.get('/gestion/pedidos/activos'),
  updateStatus: (id, estado) => api.patch(`/gestion/pedidos/${id}/estado`, { estado }),
  assignCourier: (id, idRepartidor) => api.patch(`/gestion/pedidos/${id}/repartidor`, { idRepartidor }),
  getHistory: () => api.get('/gestion/pedidos/historial'),
}

export const adminService = {
  getProducts: () => api.get('/admin/productos'),
  createProduct: (payload) => api.post('/admin/productos', payload),
  updateProduct: (id, payload) => api.put(`/admin/productos/${id}`, payload),
  updatePrice: (id, precio) => api.patch(`/admin/productos/${id}/precio`, { precio }),
  updateAvailability: (id, disponible) => api.patch(`/admin/productos/${id}/disponibilidad`, { disponible }),
  deleteProduct: (id) => api.delete(`/admin/productos/${id}`),
}

export const reportesService = {
  getVentas: () => api.get('/reportes/ventas'),
  getVolumenPedidos: () => api.get('/reportes/volumen-pedidos'),
  getOcupabilidad: () => api.get('/reportes/ocupabilidad'),
  getClientesTop: () => api.get('/reportes/clientes-top'),
}

export default api
