import { Router } from 'express'
import {
  getProductoById,
  getProductos,
  getProductosByCategoria,
  getPromociones,
} from '../controllers/menuController.js'

const router = Router()

router.get('/productos', getProductos)
router.get('/productos/:id', getProductoById)
router.get('/categoria/:idCategoria', getProductosByCategoria)
router.get('/promociones', getPromociones)

export default router
