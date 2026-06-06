import { Router } from 'express'
import {
  assignRepartidor,
  getPedidosActivos,
  getPedidosHistorial,
  updatePedidoEstado,
} from '../controllers/gestionController.js'

const router = Router()

router.get('/pedidos/activos', getPedidosActivos)
router.patch('/pedidos/:id/estado', updatePedidoEstado)
router.patch('/pedidos/:id/repartidor', assignRepartidor)
router.get('/pedidos/historial', getPedidosHistorial)

export default router
