import { Router } from 'express'
import {
  createReserva,
  deleteReserva,
  getDisponibilidad,
  marcarAsistencia,
  updateReserva,
} from '../controllers/reservasController.js'

const router = Router()

router.get('/disponibilidad', getDisponibilidad)
router.post('/', createReserva)
router.put('/:idReserva', updateReserva)
router.delete('/:idReserva', deleteReserva)
router.patch('/:idReserva/asistencia', marcarAsistencia)

export default router
