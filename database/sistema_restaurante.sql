DROP DATABASE IF EXISTS sistema_restaurante;
CREATE DATABASE sistema_restaurante CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sistema_restaurante;

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
('Coordinador Demo', 'admin@saboresdelvalle.com', 'admin123', 'superadmin');

INSERT INTO cliente (nombre, email, password, telefono, direccion_predeterminada, fecha_registro) VALUES
('Lucia Flores', 'lucia.flores@demo.com', 'cliente123', '987451201', 'Jr. Los Olivos 145, Huanuco', NOW()),
('Mateo Ponce', 'mateo.ponce@demo.com', 'cliente123', '987451202', 'Av. Circunvalacion 810, Huanuco', NOW()),
('Rosa Castillo', 'rosa.castillo@demo.com', 'cliente123', '987451203', 'Psje. Los Laureles 52, Huanuco', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('Diego Vargas', 'diego.vargas@demo.com', 'cliente123', '987451204', 'Jr. Tarapaca 410, Huanuco', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('Camila Rojas', 'camila.rojas@demo.com', 'cliente123', '987451205', 'Av. Universitaria 155, Huanuco', NOW()),
('Adrian Salazar', 'adrian.salazar@demo.com', 'cliente123', '987451206', 'Jr. Huallayco 875, Huanuco', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('Fernanda Ruiz', 'fernanda.ruiz@demo.com', 'cliente123', '987451207', 'Psje. San Martin 94, Huanuco', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Joaquin Meza', 'joaquin.meza@demo.com', 'cliente123', '987451208', 'Av. Alameda 220, Huanuco', DATE_SUB(NOW(), INTERVAL 7 DAY)),
('Valeria Torres', 'valeria.torres@demo.com', 'cliente123', '987451209', 'Jr. Micaela Bastidas 63, Huanuco', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('Nicolas Herrera', 'nicolas.herrera@demo.com', 'cliente123', '987451210', 'Av. Tupac Amaru 770, Huanuco', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Gabriela Luna', 'gabriela.luna@demo.com', 'cliente123', '987451211', 'Jr. Progreso 331, Huanuco', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('Sebastian Paredes', 'sebastian.paredes@demo.com', 'cliente123', '987451212', 'Psje. Primavera 188, Huanuco', DATE_SUB(NOW(), INTERVAL 14 DAY));

INSERT INTO repartidor (nombre, vehiculo, telefono, estado) VALUES
('Carlos Rios', 'Moto lineal', '944112233', 'disponible'),
('Miriam Solis', 'Bicicleta electrica', '955223344', 'ocupado'),
('Jorge Huaman', 'Auto compacto', '966334455', 'disponible'),
('Paola Tineo', 'Scooter electrico', '977445566', 'inactivo');

INSERT INTO categoria (nombre, descripcion) VALUES
('Entradas', 'Sabores ligeros para abrir el apetito.'),
('Fondos', 'Platos de fondo con identidad peruana e internacional.'),
('Bebidas', 'Refrescos, jugos y bebidas artesanales.'),
('Postres', 'Cierre dulce para la experiencia.');

INSERT INTO producto (id_categoria, nombre, descripcion, precio, imagen_url, disponible, es_promocion, descuento) VALUES
(1, 'Causa limeña', 'Base de papa amarilla rellena con pollo, palta y toques de aji amarillo.', 19.50, 'https://images.unsplash.com/photo-1625944525533-473f1b3d54b1?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(1, 'Papa a la huancaina', 'Rodajas de papa bañadas en crema de queso fresco y aji amarillo.', 17.50, 'https://images.unsplash.com/photo-1604908177522-4029d3a4f1b3?auto=format&fit=crop&w=1200&q=80', 1, 1, 10),
(1, 'Brochetas parrilleras', 'Brochetas mixtas de pollo y verduras con salsa de la casa.', 24.00, 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(2, 'Lomo saltado', 'Lomo fino salteado al wok con tomate, cebolla roja, papas crocantes y arroz.', 34.90, 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(2, 'Aji de gallina', 'Pechuga de pollo deshilachada en crema de aji amarillo, pecanas y queso.', 29.50, 'https://images.unsplash.com/photo-1625944524162-0f0d3ba93926?auto=format&fit=crop&w=1200&q=80', 1, 1, 12),
(2, 'Arroz con mariscos', 'Arroz meloso con mariscos salteados, culantro y un toque de vino blanco.', 36.50, 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(2, 'Paella valenciana especial', 'Paella abundante con mariscos, pollo, chorizo y azafran.', 42.00, 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(3, 'Chicha morada', 'Bebida peruana artesanal con maiz morado, canela y frutas.', 11.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80', 1, 1, 8),
(3, 'Limonada frozen', 'Limonada frappe con hierbabuena fresca y hielo triturado.', 10.00, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(3, 'Jugo de maracuya', 'Jugo natural de maracuya con pulpa fresca y hielo.', 12.00, 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80', 1, 0, 0),
(4, 'Flan de huevo', 'Flan casero con caramelo suave y textura cremosa.', 13.50, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80', 1, 1, 15),
(4, 'Crema catalana', 'Postre cremoso con costra de azucar caramelizada al momento.', 15.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80', 1, 0, 0);

INSERT INTO reserva (id_cliente, fecha, hora, cantidad_comensales, estado, observacion) VALUES
(1, CURDATE(), '20:00:00', 4, 'confirmada', 'Mesa cerca a la ventana.'),
(2, CURDATE(), '20:00:00', 2, 'pendiente', 'Celebracion familiar.'),
(3, CURDATE(), '21:00:00', 3, 'confirmada', 'Sin picante para un comensal.'),
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:30:00', 2, 'pendiente', 'Cena de negocios.'),
(5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '20:30:00', 5, 'confirmada', 'Mesa amplia para grupo.'),
(6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '20:00:00', 4, 'asistio', 'Aniversario.'),
(7, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '19:00:00', 6, 'asistio', 'Reunion de amigos.'),
(8, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '21:00:00', 2, 'cancelada', 'Cambio de planes.'),
(9, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '20:00:00', 3, 'pendiente', 'Cena posterior a evento.'),
(10, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '20:30:00', 8, 'confirmada', 'Reserva corporativa.'),
(11, CURDATE(), '20:00:00', 5, 'confirmada', 'Cumpleaños con postre especial.'),
(12, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '19:30:00', 4, 'pendiente', 'Cliente frecuente.');

INSERT INTO pedido (id_cliente, id_repartidor, fecha_hora, direccion_entrega, tarifa_envio, estado, total) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 1 HOUR), 'Jr. Los Olivos 145, Huanuco', 7.50, 'en_preparacion', 53.40),
(2, NULL, DATE_SUB(NOW(), INTERVAL 35 MINUTE), 'Av. Circunvalacion 810, Huanuco', 7.50, 'pendiente', 37.00),
(3, 2, DATE_SUB(NOW(), INTERVAL 20 MINUTE), 'Psje. Los Laureles 52, Huanuco', 8.00, 'en_camino', 56.50),
(4, 1, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Jr. Tarapaca 410, Huanuco', 7.50, 'entregado', 48.00),
(5, 3, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Av. Universitaria 155, Huanuco', 7.50, 'entregado', 49.50),
(6, NULL, DATE_SUB(NOW(), INTERVAL 3 DAY), 'Jr. Huallayco 875, Huanuco', 0.00, 'cancelado', 31.00),
(1, 4, DATE_SUB(NOW(), INTERVAL 4 DAY), 'Jr. Los Olivos 145, Huanuco', 7.00, 'entregado', 41.00),
(7, NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Psje. San Martin 94, Huanuco', 6.50, 'pendiente', 56.40),
(8, 2, DATE_SUB(NOW(), INTERVAL 18 HOUR), 'Av. Alameda 220, Huanuco', 7.50, 'en_preparacion', 67.50),
(2, NULL, DATE_SUB(NOW(), INTERVAL 5 DAY), 'Av. Circunvalacion 810, Huanuco', 0.00, 'cancelado', 50.00),
(3, 3, DATE_SUB(NOW(), INTERVAL 30 HOUR), 'Psje. Los Laureles 52, Huanuco', 8.50, 'entregado', 72.90),
(4, 1, DATE_SUB(NOW(), INTERVAL 4 HOUR), 'Jr. Tarapaca 410, Huanuco', 7.50, 'entregado', 88.50);

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 4, 1, 34.90, 34.90),
(1, 8, 1, 11.00, 11.00),
(2, 1, 1, 19.50, 19.50),
(2, 9, 1, 10.00, 10.00),
(3, 6, 1, 36.50, 36.50),
(3, 10, 1, 12.00, 12.00),
(4, 5, 1, 29.50, 29.50),
(4, 8, 1, 11.00, 11.00),
(5, 7, 1, 42.00, 42.00),
(6, 2, 1, 17.50, 17.50),
(6, 11, 1, 13.50, 13.50),
(7, 3, 1, 24.00, 24.00),
(7, 9, 1, 10.00, 10.00),
(8, 4, 1, 34.90, 34.90),
(8, 12, 1, 15.00, 15.00),
(9, 1, 1, 19.50, 19.50),
(9, 5, 1, 29.50, 29.50),
(9, 8, 1, 11.00, 11.00),
(10, 6, 1, 36.50, 36.50),
(10, 11, 1, 13.50, 13.50),
(11, 2, 1, 17.50, 17.50),
(11, 4, 1, 34.90, 34.90),
(11, 10, 1, 12.00, 12.00),
(12, 3, 1, 24.00, 24.00),
(12, 7, 1, 42.00, 42.00),
(12, 12, 1, 15.00, 15.00);
