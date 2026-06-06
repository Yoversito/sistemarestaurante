import pool from '../config/db.js'

const validateProducto = ({ idCategoria, nombre, precio }) => {
  if (!idCategoria || !nombre || precio === undefined || precio === null) {
    return 'idCategoria, nombre y precio son obligatorios.'
  }

  if (Number(precio) < 0) {
    return 'El precio debe ser mayor o igual a cero.'
  }

  return null
}

export const getProductosAdmin = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id_producto, p.id_categoria, c.nombre AS categoria_nombre, p.nombre, p.descripcion,
              p.precio, p.imagen_url, p.disponible, p.es_promocion, p.descuento
       FROM producto p
       INNER JOIN categoria c ON c.id_categoria = p.id_categoria
       ORDER BY p.id_producto DESC`
    )

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron obtener los productos.', error: error.message })
  }
}

export const createProducto = async (req, res) => {
  const {
    idCategoria,
    nombre,
    descripcion = '',
    precio,
    imagenUrl = '',
    disponible = true,
    esPromocion = false,
    descuento = 0,
  } = req.body

  const validationError = validateProducto({ idCategoria, nombre, precio })
  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO producto (id_categoria, nombre, descripcion, precio, imagen_url, disponible, es_promocion, descuento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [idCategoria, nombre, descripcion, precio, imagenUrl, disponible, esPromocion, descuento]
    )

    res.status(201).json({ message: 'Producto creado correctamente.', id_producto: result.insertId })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo crear el producto.', error: error.message })
  }
}

export const updateProducto = async (req, res) => {
  const {
    idCategoria,
    nombre,
    descripcion = '',
    precio,
    imagenUrl = '',
    disponible = true,
    esPromocion = false,
    descuento = 0,
  } = req.body

  const validationError = validateProducto({ idCategoria, nombre, precio })
  if (validationError) {
    return res.status(400).json({ message: validationError })
  }

  try {
    const [result] = await pool.query(
      `UPDATE producto
       SET id_categoria = ?, nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, disponible = ?, es_promocion = ?, descuento = ?
       WHERE id_producto = ?`,
      [idCategoria, nombre, descripcion, precio, imagenUrl, disponible, esPromocion, descuento, req.params.id]
    )

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }

    res.json({ message: 'Producto actualizado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar el producto.', error: error.message })
  }
}

export const updateProductoPrecio = async (req, res) => {
  const { precio } = req.body

  if (precio === undefined || precio === null || Number(precio) < 0) {
    return res.status(400).json({ message: 'El precio es obligatorio y debe ser valido.' })
  }

  try {
    const [result] = await pool.query('UPDATE producto SET precio = ? WHERE id_producto = ?', [precio, req.params.id])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }

    res.json({ message: 'Precio actualizado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar el precio.', error: error.message })
  }
}

export const updateProductoDisponibilidad = async (req, res) => {
  const { disponible } = req.body

  if (disponible === undefined) {
    return res.status(400).json({ message: 'El campo disponible es obligatorio.' })
  }

  try {
    const [result] = await pool.query('UPDATE producto SET disponible = ? WHERE id_producto = ?', [disponible, req.params.id])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }

    res.json({ message: 'Disponibilidad actualizada correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo actualizar la disponibilidad.', error: error.message })
  }
}

export const deleteProducto = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM producto WHERE id_producto = ?', [req.params.id])

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Producto no encontrado.' })
    }

    res.json({ message: 'Producto eliminado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar el producto.', error: error.message })
  }
}
