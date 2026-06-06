import pool from '../config/db.js'

export const getProductos = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id_producto, p.id_categoria, c.nombre AS categoria_nombre, p.nombre, p.descripcion,
              p.precio, p.imagen_url, p.disponible, p.es_promocion, p.descuento
       FROM producto p
       INNER JOIN categoria c ON c.id_categoria = p.id_categoria
       WHERE p.disponible = 1
       ORDER BY c.nombre, p.nombre`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron obtener los productos.', error: error.message })
  }
}

export const getProductoById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id_producto, p.id_categoria, c.nombre AS categoria_nombre, p.nombre, p.descripcion,
              p.precio, p.imagen_url, p.disponible, p.es_promocion, p.descuento
       FROM producto p
       INNER JOIN categoria c ON c.id_categoria = p.id_categoria
       WHERE p.id_producto = ?`,
      [req.params.id]
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }

    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'No se pudo obtener el producto.', error: error.message })
  }
}

export const getProductosByCategoria = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id_producto, p.id_categoria, c.nombre AS categoria_nombre, p.nombre, p.descripcion,
              p.precio, p.imagen_url, p.disponible, p.es_promocion, p.descuento
       FROM producto p
       INNER JOIN categoria c ON c.id_categoria = p.id_categoria
       WHERE p.id_categoria = ? AND p.disponible = 1
       ORDER BY p.nombre`,
      [req.params.idCategoria]
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudo obtener la categoria.', error: error.message })
  }
}

export const getPromociones = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id_producto, p.id_categoria, c.nombre AS categoria_nombre, p.nombre, p.descripcion,
              p.precio, p.imagen_url, p.disponible, p.es_promocion, p.descuento,
              ROUND(p.precio * (1 - (p.descuento / 100)), 2) AS precio_promocional
       FROM producto p
       INNER JOIN categoria c ON c.id_categoria = p.id_categoria
       WHERE p.es_promocion = 1 AND p.disponible = 1
       ORDER BY p.nombre`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron obtener las promociones.', error: error.message })
  }
}
