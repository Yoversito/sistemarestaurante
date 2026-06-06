import pool from '../config/db.js'

export const getPedidosActivos = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id_pedido, p.id_cliente, c.nombre AS cliente_nombre, p.id_repartidor,
              r.nombre AS repartidor_nombre, p.fecha_hora, p.direccion_entrega,
              p.tarifa_envio, p.estado, p.total
       FROM pedido p
       INNER JOIN cliente c ON c.id_cliente = p.id_cliente
       LEFT JOIN repartidor r ON r.id_repartidor = p.id_repartidor
       WHERE p.estado IN ('pendiente', 'en_preparacion', 'en_camino')
       ORDER BY p.fecha_hora DESC`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron obtener los pedidos activos.', error: error.message })
  }
}

export const updatePedidoEstado = async (req, res) => {
  const { estado } = req.body

  if (!estado) {
    return res.status(400).json({ message: 'El estado es obligatorio.' })
  }

  try {
    const [result] = await pool.query('UPDATE pedido SET estado = ? WHERE id_pedido = ?', [estado, req.params.id])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Pedido no encontrado.' })
    }

    res.json({ message: 'Estado del pedido actualizado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar el estado.', error: error.message })
  }
}

export const assignRepartidor = async (req, res) => {
  const { idRepartidor } = req.body

  if (!idRepartidor) {
    return res.status(400).json({ message: 'El idRepartidor es obligatorio.' })
  }

  try {
    const [result] = await pool.query('UPDATE pedido SET id_repartidor = ? WHERE id_pedido = ?', [idRepartidor, req.params.id])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Pedido no encontrado.' })
    }

    res.json({ message: 'Repartidor asignado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo asignar el repartidor.', error: error.message })
  }
}

export const getPedidosHistorial = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id_pedido, p.id_cliente, c.nombre AS cliente_nombre, p.id_repartidor,
              r.nombre AS repartidor_nombre, p.fecha_hora, p.estado, p.total
       FROM pedido p
       INNER JOIN cliente c ON c.id_cliente = p.id_cliente
       LEFT JOIN repartidor r ON r.id_repartidor = p.id_repartidor
       WHERE p.estado IN ('entregado', 'cancelado')
       ORDER BY p.fecha_hora DESC`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo obtener el historial de pedidos.', error: error.message })
  }
}
