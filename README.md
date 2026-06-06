# Sistema Integral Web de Gestion y Pedidos para Restaurantes

Proyecto full stack para administrar menu, pedidos delivery, reservas y reportes del restaurante "Sabores del Valle".

## Tecnologias usadas

- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express
- Base de datos: MySQL
- Conexion a MySQL: mysql2
- Utilidades: CORS, dotenv, nodemon

## Estructura del proyecto

```text
sistemarestaurante/
├── backend/
├── frontend/
├── database/
├── README.md
└── .gitignore
```

## Configurar MySQL

1. Asegura que MySQL este ejecutandose en `localhost:3306`.
2. Abre tu cliente MySQL preferido.
3. Ejecuta el script `database/sistema_restaurante.sql`.
4. Esto creara la base de datos `sistema_restaurante`, las tablas y algunos datos iniciales.

## Instalar y ejecutar el backend

```bash
cd backend
npm install
npm run dev
```

Variables de entorno usadas en `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Yober12+
DB_NAME=sistema_restaurante
DB_PORT=3306
PORT=3001
```

## Instalar y ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend consume la API en `http://localhost:3001/api`.

## Endpoints principales

### Menu

- `GET /api/menu/productos`
- `GET /api/menu/productos/:id`
- `GET /api/menu/categoria/:idCategoria`
- `GET /api/menu/promociones`

### Pedidos delivery

- `POST /api/pedidos/checkout`
- `GET /api/pedidos/cliente/:idCliente`
- `GET /api/pedidos/:idPedido/estado`

### Reservas

- `GET /api/reservas/disponibilidad`
- `POST /api/reservas`
- `PUT /api/reservas/:idReserva`
- `DELETE /api/reservas/:idReserva`
- `PATCH /api/reservas/:idReserva/asistencia`

### Gestion de pedidos

- `GET /api/gestion/pedidos/activos`
- `PATCH /api/gestion/pedidos/:id/estado`
- `PATCH /api/gestion/pedidos/:id/repartidor`
- `GET /api/gestion/pedidos/historial`

### Administracion del menu

- `GET /api/admin/productos`
- `POST /api/admin/productos`
- `PUT /api/admin/productos/:id`
- `PATCH /api/admin/productos/:id/precio`
- `PATCH /api/admin/productos/:id/disponibilidad`
- `DELETE /api/admin/productos/:id`

### Reportes

- `GET /api/reportes/ventas`
- `GET /api/reportes/volumen-pedidos`
- `GET /api/reportes/ocupabilidad`
- `GET /api/reportes/clientes-top`

## Flujo funcional implementado

- Catalogo principal con filtros por categorias, buscador y carrito.
- Carrito con calculo de subtotal, envio y checkout conectado al backend.
- Reservas con consulta de disponibilidad y registro en MySQL.
- Panel administrador con dashboard, pedidos activos, historial, menu y reportes.
