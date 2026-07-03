import pool from '../config/db.js'

export const getVentasReport = async (req, res) => {
  const { desde = '2000-01-01', hasta = '2999-12-31' } = req.query

  try {
    const [[summary]] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) AS ingresos_totales,
              COUNT(*) AS pedidos_total,
              COALESCE(AVG(total), 0) AS ticket_promedio
        FROM pedido
        WHERE DATE(fecha_hora) BETWEEN ? AND ?
          AND estado <> 'cancelado'`,
      [desde, hasta]
    )

    const [[today]] = await pool.query(
      `SELECT COALESCE(SUM(total), 0) AS ingresos_hoy,
              COUNT(*) AS pedidos_hoy
        FROM pedido
        WHERE DATE(fecha_hora) = CURDATE()
          AND estado <> 'cancelado'`
    )

    let nuevosClientesHoy = 0

    try {
      const [[newClients]] = await pool.query(
        `SELECT COUNT(*) AS nuevos_clientes_hoy
         FROM cliente
         WHERE DATE(fecha_registro) = CURDATE()`
      )

      nuevosClientesHoy = Number(newClients.nuevos_clientes_hoy || 0)
    } catch (error) {
      if (error.code !== 'ER_BAD_FIELD_ERROR') {
        throw error
      }
    }

    res.json({
      rango: { desde, hasta },
      resumen: summary,
      indicadores_hoy: {
        ...today,
        nuevos_clientes_hoy: nuevosClientesHoy,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo generar el reporte de ventas.', error: error.message })
  }
}

export const getVolumenPedidosReport = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT estado, COUNT(*) AS cantidad, COALESCE(SUM(total), 0) AS monto
       FROM pedido
       GROUP BY estado
       ORDER BY cantidad DESC`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo generar el reporte de volumen de pedidos.', error: error.message })
  }
}

export const getOcupabilidadReport = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT fecha,
              COUNT(*) AS reservas,
              COALESCE(SUM(cantidad_comensales), 0) AS comensales,
              ROUND((COALESCE(SUM(cantidad_comensales), 0) / 40) * 100, 2) AS ocupabilidad_porcentaje
       FROM reserva
       GROUP BY fecha
       ORDER BY fecha DESC
       LIMIT 10`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo generar el reporte de ocupabilidad.', error: error.message })
  }
}

export const getClientesTopReport = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id_cliente, c.nombre, c.email,
              COUNT(p.id_pedido) AS pedidos_realizados,
              COALESCE(SUM(p.total), 0) AS gasto_total
        FROM cliente c
        LEFT JOIN pedido p ON p.id_cliente = c.id_cliente AND p.estado <> 'cancelado'
        GROUP BY c.id_cliente, c.nombre, c.email
        ORDER BY gasto_total DESC, pedidos_realizados DESC
        LIMIT 10`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo generar el reporte de clientes top.', error: error.message })
  }
}
