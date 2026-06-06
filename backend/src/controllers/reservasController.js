import pool from '../config/db.js'

const MAX_COMENSALES_POR_TURNO = 40

const validateReserva = ({ fecha, hora, cantidadComensales }) => {
  if (!fecha || !hora || !cantidadComensales) {
    return 'fecha, hora y cantidadComensales son obligatorios.'
  }

  if (Number(cantidadComensales) < 1) {
    return 'La cantidad de comensales debe ser mayor a cero.'
  }

  return null
}

export const getDisponibilidad = async (req, res) => {
  const { fecha, hora, cantidadComensales = 1 } = req.query

  const validationError = validateReserva({ fecha, hora, cantidadComensales })
  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  try {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(cantidad_comensales), 0) AS comensales_reservados
       FROM reserva
       WHERE fecha = ?
         AND hora = ?
         AND estado IN ('pendiente', 'confirmada')`,
      [fecha, hora]
    )

    const reservados = Number(rows[0].comensales_reservados)
    const disponibles = MAX_COMENSALES_POR_TURNO - reservados

    res.json({
      fecha,
      hora,
      capacidad_total: MAX_COMENSALES_POR_TURNO,
      comensales_reservados: reservados,
      cupos_disponibles: disponibles,
      disponible: disponibles >= Number(cantidadComensales),
    })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo consultar la disponibilidad.', error: error.message })
  }
}

export const createReserva = async (req, res) => {
  const { idCliente = 1, fecha, hora, cantidadComensales, estado = 'pendiente', observacion = '' } = req.body
  const validationError = validateReserva({ fecha, hora, cantidadComensales })

  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  try {
    const [availabilityRows] = await pool.query(
      `SELECT COALESCE(SUM(cantidad_comensales), 0) AS comensales_reservados
       FROM reserva
       WHERE fecha = ?
         AND hora = ?
         AND estado IN ('pendiente', 'confirmada')`,
      [fecha, hora]
    )

    const disponibles = MAX_COMENSALES_POR_TURNO - Number(availabilityRows[0].comensales_reservados)
    if (disponibles < Number(cantidadComensales)) {
      return res.status(409).json({ message: 'No hay disponibilidad suficiente para esa reserva.' })
    }

    const [result] = await pool.query(
      `INSERT INTO reserva (id_cliente, fecha, hora, cantidad_comensales, estado, observacion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [idCliente, fecha, hora, cantidadComensales, estado, observacion]
    )

    res.status(201).json({
      message: 'Reserva registrada correctamente.',
      reserva: {
        id_reserva: result.insertId,
        id_cliente: idCliente,
        fecha,
        hora,
        cantidad_comensales: cantidadComensales,
        estado,
        observacion,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo registrar la reserva.', error: error.message })
  }
}

export const updateReserva = async (req, res) => {
  const { fecha, hora, cantidadComensales, estado, observacion = '' } = req.body
  const validationError = validateReserva({ fecha, hora, cantidadComensales })

  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  try {
    const [result] = await pool.query(
      `UPDATE reserva
       SET fecha = ?, hora = ?, cantidad_comensales = ?, estado = ?, observacion = ?
       WHERE id_reserva = ?`,
      [fecha, hora, cantidadComensales, estado || 'pendiente', observacion, req.params.idReserva]
    )

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Reserva no encontrada.' })
    }

    res.json({ message: 'Reserva actualizada correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar la reserva.', error: error.message })
  }
}

export const deleteReserva = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM reserva WHERE id_reserva = ?', [req.params.idReserva])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Reserva no encontrada.' })
    }

    res.json({ message: 'Reserva eliminada correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar la reserva.', error: error.message })
  }
}

export const marcarAsistencia = async (req, res) => {
  const { estado = 'asistio' } = req.body

  try {
    const [result] = await pool.query('UPDATE reserva SET estado = ? WHERE id_reserva = ?', [estado, req.params.idReserva])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Reserva no encontrada.' })
    }

    res.json({ message: 'Asistencia actualizada correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar la asistencia.', error: error.message })
  }
}
