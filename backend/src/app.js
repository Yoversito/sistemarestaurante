import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { testConnection } from './config/db.js'
import adminRoutes from './routes/adminRoutes.js'
import gestionRoutes from './routes/gestionRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import pedidosRoutes from './routes/pedidosRoutes.js'
import reportesRoutes from './routes/reportesRoutes.js'
import reservasRoutes from './routes/reservasRoutes.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ message: 'API Sistema Restaurante activa.' })
})

app.use('/api/menu', menuRoutes)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/reservas', reservasRoutes)
app.use('/api/gestion', gestionRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reportes', reportesRoutes)

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: 'Ocurrio un error interno.', error: err.message })
})

const startServer = async () => {
  try {
    await testConnection()
    app.listen(PORT, () => {
      console.log(`Servidor backend ejecutandose en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('No se pudo conectar a MySQL:', error.message)
    process.exit(1)
  }
}

startServer()
