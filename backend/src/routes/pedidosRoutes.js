import { Router } from 'express'
import { checkoutPedido, getEstadoPedido, getPedidosByCliente } from '../controllers/pedidosController.js'

const router = Router()

router.post('/checkout', checkoutPedido)
router.get('/cliente/:idCliente', getPedidosByCliente)
router.get('/:idPedido/estado', getEstadoPedido)

export default router
