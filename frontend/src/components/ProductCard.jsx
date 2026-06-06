function ProductCard({ product, onAdd }) {
  const image = product.imagen_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'

  return (
    <article className="product-card">
      <div className="product-image" style={{ backgroundImage: `url(${image})` }} />
      <div className="product-content">
        <div className="product-meta">
          <span className="pill">{product.categoria_nombre}</span>
          {product.es_promocion ? <span className="pill">-{product.descuento}%</span> : null}
        </div>
        <h3 className="product-title">{product.nombre}</h3>
        <p className="muted-text">{product.descripcion}</p>
        <div className="price-row">
          <span className="price">S/ {Number(product.precio).toFixed(2)}</span>
          <button className="primary-button" onClick={() => onAdd(product)} type="button">
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
