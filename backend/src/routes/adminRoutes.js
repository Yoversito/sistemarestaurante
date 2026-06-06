import { Router } from 'express'
import {
  createProducto,
  deleteProducto,
  getProductosAdmin,
  updateProducto,
  updateProductoDisponibilidad,
  updateProductoPrecio,
} from '../controllers/adminController.js'

const router = Router()

router.get('/productos', getProductosAdmin)
router.post('/productos', createProducto)
router.put('/productos/:id', updateProducto)
router.patch('/productos/:id/precio', updateProductoPrecio)
router.patch('/productos/:id/disponibilidad', updateProductoDisponibilidad)
router.delete('/productos/:id', deleteProducto)

export default router
