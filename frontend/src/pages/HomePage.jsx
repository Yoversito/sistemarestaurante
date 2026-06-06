import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { menuService } from '../services/api'

const categoryOrder = ['Todos', 'Entradas', 'Fondos', 'Bebidas', 'Postres']

function HomePage({ addToCart }) {
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
      <section className="hero">
        <div className="hero-card">
          <span className="pill">Menu activo y delivery integrado</span>
          <h1>Sabores del Valle une catalogo, reservas y pedidos en una sola experiencia.</h1>
          <p>
            Explora platos disponibles, agrega productos al carrito y confirma pedidos mientras el equipo
            administra el negocio desde un panel conectado a MySQL.
          </p>
          <div className="hero-metrics">
            <div className="metric">
              <strong>{products.length}</strong>
              <span>Productos activos</span>
            </div>
            <div className="metric">
              <strong>{promotions.length}</strong>
              <span>Promociones del dia</span>
            </div>
            <div className="metric">
              <strong>24/7</strong>
              <span>Panel operativo</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-content">
            <div className="hero-visual-badge">Cocina peruana contemporanea</div>
            <h2>Entradas frescas, fondos contundentes y postres con identidad.</h2>
            <p>Filtra por categoria, busca por nombre y arma pedidos con respuesta inmediata.</p>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="page-header">
          <h2>Catalogo principal</h2>
          <p>Productos activos con filtro por categoria y busqueda libre.</p>
        </div>

        <div className="filters-bar">
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

          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              className="search-input"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar producto..."
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
          <div className="empty-state">No se encontraron productos para este filtro.</div>
        )}
      </section>
    </div>
  )
}

export default HomePage
