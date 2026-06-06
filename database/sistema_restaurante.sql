CREATE DATABASE IF NOT EXISTS sistema_restaurante;
USE sistema_restaurante;

DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS pedido;
DROP TABLE IF EXISTS reserva;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS repartidor;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS administrador;

CREATE TABLE administrador (
  id_administrador INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL
);

CREATE TABLE cliente (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  direccion_predeterminada VARCHAR(255),
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE repartidor (
  id_repartidor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  vehiculo VARCHAR(80) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  estado VARCHAR(40) NOT NULL
);

CREATE TABLE categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  descripcion VARCHAR(255)
);

CREATE TABLE producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  imagen_url VARCHAR(255),
  disponible TINYINT(1) NOT NULL DEFAULT 1,
  es_promocion TINYINT(1) NOT NULL DEFAULT 0,
  descuento DECIMAL(5, 2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE reserva (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  cantidad_comensales INT NOT NULL,
  estado VARCHAR(40) NOT NULL,
  observacion VARCHAR(255),
  CONSTRAINT fk_reserva_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE pedido (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_repartidor INT NULL,
  fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  direccion_entrega VARCHAR(255) NOT NULL,
  tarifa_envio DECIMAL(10, 2) NOT NULL DEFAULT 0,
  estado VARCHAR(40) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  CONSTRAINT fk_pedido_repartidor FOREIGN KEY (id_repartidor) REFERENCES repartidor(id_repartidor)
);

CREATE TABLE detalle_pedido (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

INSERT INTO administrador (nombre, email, password, rol) VALUES
('Yober Ramos', 'admin@saboresdelvalle.com', 'admin123', 'superadmin');

INSERT INTO cliente (nombre, email, password, telefono, direccion_predeterminada, fecha_registro) VALUES
('Lucia Flores', 'lucia@correo.com', 'cliente123', '999111222', 'Jr. Los Olivos 145', NOW()),
('Mateo Ponce', 'mateo@correo.com', 'cliente123', '988777666', 'Av. Circunvalacion 810', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Rosa Castillo', 'rosa@correo.com', 'cliente123', '977888999', 'Psje. Los Laureles 52', NOW());

INSERT INTO repartidor (nombre, vehiculo, telefono, estado) VALUES
('Carlos Rios', 'Moto lineal', '944112233', 'disponible'),
('Miriam Solis', 'Bicicleta electrica', '955223344', 'en ruta');

INSERT INTO categoria (nombre, descripcion) VALUES
('Entradas', 'Sabores ligeros para abrir el apetito.'),
('Fondos', 'Platos de fondo con identidad peruana.'),
('Bebidas', 'Refrescos y bebidas artesanales.'),
('Postres', 'Cierre dulce para la experiencia.');

INSERT INTO producto (id_categoria, nombre, descripcion, precio, imagen_url, disponible, es_promocion, descuento) VALUES
(1, 'Causa de pollo', 'Causa limeña con pollo al olivo y brotes frescos.', 18.50, 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(1, 'Tequenos criollos', 'Rellenos de queso andino y salsa de aji amarillo.', 16.00, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', 1, 1, 10),
(2, 'Lomo saltado del valle', 'Lomo fino salteado con papas crocantes y arroz.', 32.90, 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(2, 'Aji de gallina especial', 'Crema casera con pecanas tostadas y arroz norteño.', 28.50, 'https://images.unsplash.com/photo-1625944524162-0f0d3ba93926?auto=format&fit=crop&w=1200&q=80', 1, 1, 12),
(3, 'Chicha morada artesanal', 'Jarra fria con frutas y canela.', 12.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(3, 'Limonada de hierbaluisa', 'Bebida fresca con menta y hierbaluisa.', 10.50, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(4, 'Suspiro de maracuya', 'Version fresca del clasico suspiro limeño.', 14.90, 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80', 1, 1, 8),
(4, 'Torta de chocolate tibia', 'Bizcocho humedo con salsa de cacao y helado.', 15.50, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80', 1, 0, 0);

INSERT INTO reserva (id_cliente, fecha, hora, cantidad_comensales, estado, observacion) VALUES
(1, CURDATE(), '20:00:00', 4, 'confirmada', 'Mesa cerca a la ventana'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '21:00:00', 2, 'pendiente', 'Cena aniversario');

INSERT INTO pedido (id_cliente, id_repartidor, fecha_hora, direccion_entrega, tarifa_envio, estado, total) VALUES
(1, 1, NOW(), 'Av. Principal 450, Huanuco', 7.50, 'en_preparacion', 58.90),
(2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Av. Circunvalacion 810, Huanuco', 7.50, 'entregado', 51.00),
(3, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Psje. Los Laureles 52, Huanuco', 7.50, 'pendiente', 40.00);

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 3, 1, 32.90, 32.90),
(1, 5, 1, 12.00, 12.00),
(1, 7, 1, 14.00, 14.00),
(2, 4, 1, 28.50, 28.50),
(2, 5, 1, 12.00, 12.00),
(2, 8, 1, 10.50, 10.50),
(3, 2, 1, 16.00, 16.00),
(3, 6, 1, 10.50, 10.50),
(3, 7, 1, 13.50, 13.50);
