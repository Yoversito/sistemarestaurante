import { BadgePercent, ShoppingCart, Sparkles } from 'lucide-react'

const fallbackImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80'

function ProductCard({ product, onAdd }) {
  const image = product.imagen_url || fallbackImage
  const isAvailable = Boolean(product.disponible)
  const promoPrice = product.es_promocion
    ? Number(product.precio) * (1 - Number(product.descuento || 0) / 100)
    : Number(product.precio)

  return (
    <article className="product-card">
      <div className="product-image">
        <img
          alt={product.nombre}
          className="product-image-element"
          onError={(event) => {
            event.currentTarget.src = fallbackImage
          }}
          src={image}
        />
        <div className="product-image-overlay" />
        <div className="product-image-top">
          <span className="pill pill-soft">{product.categoria_nombre}</span>
          {product.es_promocion ? (
            <span className="pill pill-accent">
              <BadgePercent size={14} />
              {product.descuento}% off
            </span>
          ) : null}
        </div>
      </div>

        <div className="product-content">
          <div className="product-copy">
            <h3 className="product-title">{product.nombre}</h3>
            <p className="muted-text product-description">{product.descripcion}</p>
          </div>

          <div className="product-footer">
            <div>
              <div className="price-stack">
              <span className="price">S/ {promoPrice.toFixed(2)}</span>
              {product.es_promocion ? <span className="price-old">S/ {Number(product.precio).toFixed(2)}</span> : null}
            </div>
              <span className={`product-note ${isAvailable ? 'is-available' : 'is-unavailable'}`}>
                <Sparkles size={14} />
                {isAvailable ? 'Disponible' : 'No disponible'}
              </span>
            </div>

            <button
              className="primary-button product-cart-button"
              disabled={!isAvailable}
              onClick={() => onAdd(product)}
              type="button"
            >
              <ShoppingCart size={16} />
              Agregar al carrito
            </button>
          </div>
        </div>
    </article>
  )
}

export default ProductCard
