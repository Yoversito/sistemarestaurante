import { Search, Sparkles, Truck, UtensilsCrossed } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import ProductCard from '../components/ProductCard'
import { menuService } from '../services/api'

const categoryOrder = ['Todos', 'Entradas', 'Fondos', 'Bebidas', 'Postres']

function HomePage({ addToCart, cartCount = 0, embedded = false }) {
  const [products, setProducts] = useState([])
  const [promotions, setPromotions] = useState([])
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, promotionsResponse] = await Promise.all([
          menuService.getProducts(),
          menuService.getPromotions(),
        ])

        setProducts(productsResponse.data)
        setPromotions(promotionsResponse.data)
      } catch (error) {
        setMessage(error.response?.data?.message || 'No se pudo cargar el catalogo.')
      }
    }

    loadData()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const byCategory = activeCategory === 'Todos' || product.categoria_nombre === activeCategory
      const bySearch = `${product.nombre} ${product.descripcion}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      return byCategory && bySearch
    })
  }, [activeCategory, products, searchTerm])

  return (
    <div className="page-grid">
      {embedded ? (
        <section className="catalog-module">
          <div className="panel catalog-header compact">
            <div>
              <span className="eyebrow">Modulo de catalogo</span>
              <h2>Catalogo de productos</h2>
              <p className="muted-text">Gestion comercial y pedidos del restaurante.</p>
            </div>

            <div className="catalog-mini-stats">
              <div className="mini-stat-card">
                <div>
                  <span>Productos</span>
                  <strong>{products.length}</strong>
                </div>
              </div>
              <div className="mini-stat-card">
                <div>
                  <span>Promociones</span>
                  <strong>{promotions.length}</strong>
                </div>
              </div>
              <div className="mini-stat-card">
                <div>
                  <span>En carrito</span>
                  <strong>{cartCount}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="panel catalog-toolbar-panel catalog-toolbar-compact">
            <div className="catalog-tools catalog-tools-compact">
              <div className="tabs">
                {categoryOrder.map((category) => (
                  <button
                    className={`tab-button ${activeCategory === category ? 'active' : ''}`}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="catalog-search">
                <Search size={18} />
                <input
                  className="search-input"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre o descripcion..."
                  value={searchTerm}
                />
              </div>
            </div>
          </div>

          {message ? <div className="message">{message}</div> : null}

          <section className="product-grid compact-grid">
            {filteredProducts.length ? (
              filteredProducts.map((product) => <ProductCard key={product.id_producto} onAdd={addToCart} product={product} />)
            ) : (
              <EmptyState
                icon={Search}
                title="No encontramos productos con ese filtro"
              />
            )}
          </section>
        </section>
      ) : (
        <>
          <section className="hero hero-catalog">
            <div className="hero-card hero-card-lg">
              <span className="pill pill-soft">Sabores del Valle</span>
              <h1>Catalogo, reservas y pedidos en un solo lugar.</h1>

              <div className="hero-actions">
                <div className="hero-action-card">
                  <UtensilsCrossed size={18} />
                  <div>
                    <strong>{products.length} platos disponibles</strong>
                  </div>
                </div>
                <div className="hero-action-card">
                  <Truck size={18} />
                  <div>
                    <strong>Delivery conectado</strong>
                  </div>
                </div>
              </div>

              <div className="hero-metrics">
                <div className="metric">
                  <strong>{promotions.length}</strong>
                  <span>Promociones activas</span>
                </div>
                <div className="metric">
                  <strong>4</strong>
                  <span>Categorias visibles</span>
                </div>
                <div className="metric">
                  <strong>24/7</strong>
                  <span>Atencion</span>
                </div>
              </div>
            </div>

            <div className="hero-showcase-card">
              <div className="hero-showcase-head">
                <span className="pill pill-accent">
                  <Sparkles size={14} />
                  Destacados del dia
                </span>
              </div>

              <div className="promo-list">
                {promotions.slice(0, 3).map((promotion) => (
                  <div className="promo-item" key={promotion.id_producto}>
                    <div>
                      <strong>{promotion.nombre}</strong>
                      <span>{promotion.categoria_nombre}</span>
                    </div>
                    <div className="promo-price-block">
                      <strong>S/ {Number(promotion.precio_promocional || promotion.precio).toFixed(2)}</strong>
                      <span>-{promotion.descuento}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="panel catalog-toolbar-panel">
            <div className="page-header compact-header">
              <div>
                <span className="eyebrow">Catalogo principal</span>
                <h2>Productos</h2>
              </div>
            </div>

            <div className="catalog-tools">
              <div className="tabs">
                {categoryOrder.map((category) => (
                  <button
                    className={`tab-button ${activeCategory === category ? 'active' : ''}`}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="catalog-search">
                <Search size={18} />
                <input
                  className="search-input"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre o descripcion..."
                  value={searchTerm}
                />
              </div>
            </div>
          </section>

          {message ? <div className="message">{message}</div> : null}

          <section className="product-grid">
            {filteredProducts.length ? (
              filteredProducts.map((product) => <ProductCard key={product.id_producto} onAdd={addToCart} product={product} />)
            ) : (
              <EmptyState
                icon={Search}
                title="No encontramos productos con ese filtro"
              />
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default HomePage
