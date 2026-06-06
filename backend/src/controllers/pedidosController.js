import pool from '../config/db.js'

const activeStatuses = ['pendiente', 'en_preparacion', 'en_camino']

export const checkoutPedido = async (req, res) => {
  const { idCliente, items, direccionEntrega, tarifaEnvio = 0, idRepartidor = null } = req.body

  if (!idCliente || !direccionEntrega || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'idCliente, direccionEntrega e items son obligatorios.' })
  }

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const productIds = items.map((item) => item.idProducto)
    const [products] = await connection.query(
      `SELECT id_producto, nombre, precio, disponible
       FROM producto
       WHERE id_producto IN (?)`,
      [productIds]
    )

    if (products.length !== items.length) {
      await connection.rollback()
      return res.status(404).json({ message: 'Uno o mas productos no existen.' })
    }

    const productMap = new Map(products.map((product) => [product.id_producto, product]))
    let subtotal = 0
    const detalles = []

    for (const item of items) {
      if (!item.idProducto || !item.cantidad || item.cantidad < 1) {
        await connection.rollback()
        return res.status(400).json({ message: 'Cada item debe tener idProducto y cantidad valida.' })
      }

      const product = productMap.get(item.idProducto)
      if (!product || !product.disponible) {
        await connection.rollback()
        return res.status(400).json({ message: `El producto ${item.idProducto} no esta disponible.` })
      }

      const precioUnitario = Number(product.precio)
      const subtotalItem = Number((precioUnitario * item.cantidad).toFixed(2))
      subtotal += subtotalItem
      detalles.push([item.idProducto, item.cantidad, precioUnitario, subtotalItem])
    }

    const total = Number((subtotal + Number(tarifaEnvio)).toFixed(2))

    const [pedidoResult] = await connection.query(
      `INSERT INTO pedido (id_cliente, id_repartidor, fecha_hora, direccion_entrega, tarifa_envio, estado, total)
       VALUES (?, ?, NOW(), ?, ?, 'pendiente', ?)`,
      [idCliente, idRepartidor, direccionEntrega, tarifaEnvio, total]
    )

    const values = detalles.map(([idProducto, cantidad, precioUnitario, subtotalItem]) => [
      pedidoResult.insertId,
      idProducto,
      cantidad,
      precioUnitario,
      subtotalItem,
    ])

    await connection.query(
      `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
       VALUES ?`,
      [values]
    )

    await connection.commit()

    res.status(201).json({
      message: 'Pedido registrado correctamente.',
      pedido: {
        id_pedido: pedidoResult.insertId,
        id_cliente: idCliente,
        direccion_entrega: direccionEntrega,
        tarifa_envio: Number(tarifaEnvio),
        total,
        estado: activeStatuses[0],
      },
    })
  } catch (error) {
    await connection.rollback()
    res.status(500).json({ message: 'No se pudo registrar el pedido.', error: error.message })
  } finally {
    connection.release()
  }
}

export const getPedidosByCliente = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_pedido, id_cliente, id_repartidor, fecha_hora, direccion_entrega, tarifa_envio, estado, total
       FROM pedido
       WHERE id_cliente = ?
       ORDER BY fecha_hora DESC`,
      [req.params.idCliente]
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron obtener los pedidos del cliente.', error: error.message })
  }
}

export const getEstadoPedido = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_pedido, estado, fecha_hora, total
       FROM pedido
       WHERE id_pedido = ?`,
      [req.params.idPedido]
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'Pedido no encontrado.' })
    }

    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'No se pudo obtener el estado del pedido.', error: error.message })
  }
}
