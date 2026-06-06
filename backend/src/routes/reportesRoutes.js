import { Router } from 'express'
import {
  getClientesTopReport,
  getOcupabilidadReport,
  getVentasReport,
  getVolumenPedidosReport,
} from '../controllers/reportesController.js'

const router = Router()

router.get('/ventas', getVentasReport)
router.get('/volumen-pedidos', getVolumenPedidosReport)
router.get('/ocupabilidad', getOcupabilidadReport)
router.get('/clientes-top', getClientesTopReport)

export default router
