-- ============================================================================
-- Kawaiilandia: datos de ejemplo (MySQL / MariaDB)
-- Ejecutar DESPUÉS de structure.sql:   mysql -u root -p < database/data.sql
--
-- Usuarios: 8 (2 admin y 6 customer). Todos tienen la contraseña Kawaii2026!
-- (se guarda solo el hash scrypt).
-- Solo los precios de Vacas corredoras y Domo de Snoopy vienen de la tienda;
-- el resto de productos y precios son de ejemplo y deben validarse con la tienda.
-- ============================================================================

USE kawaiilandia;
SET NAMES utf8mb4;

-- Tipos de usuario
INSERT INTO user_categories (id, name) VALUES
  (1, 'admin'),
  (2, 'customer');

-- Usuarios
INSERT INTO users (id, first_name, last_name, email, password, category_id, image) VALUES
  (1, 'Valentina', 'Rojas', 'valentina.rojas@example.com', 'scrypt$9846cc730f77dc34b0e5197d525d121e$4f938b34a3c19061fb3cc018dd47e76b73291e6dafe1b8723ff6a76d918ec59bc169d609162207e8e0196eabcedb9da341775ef315415c61b679079dd377d9c4', 1, '/img/logo.svg'),
  (2, 'Sebastián', 'Mendoza', 'sebastian.mendoza@example.com', 'scrypt$d67ccd7c165c110e47a1b42fa71d1049$74edbe7d207a38b1166e290ee253b04b003252ecb412b4edf93fe7e8fc510f1a3cae8442447b5db9f3993e1d5fbdee75b9c84ef058373a0ff10482e18fa0a652', 1, '/img/logo.svg'),
  (3, 'Camila', 'Torres', 'camila.torres@example.com', 'scrypt$f4d577fe59449ed9dd4cc470339cff69$758ba81e3122248f5a94f367753dc0c9e0a71f768799c05042b22436000f176d31895d8ad69d74a79fe9a6422a0e8be01e80ea013d49a498be38e7e74284fb19', 2, '/img/logo.svg'),
  (4, 'Juan', 'Gómez', 'juan.gomez@example.com', 'scrypt$ffc4eeda74e1bf47f67fd526737ba35f$627e24517298da6b8a424c0db21a5748572b2738d6c7b4adf32e4df32b6b6745d61171d45a2c65490c96818b2948ed86d280f958af38b5b79fadefa8c50b9fb0', 2, '/img/logo.svg'),
  (5, 'Laura', 'Pinzón', 'laura.pinzon@example.com', 'scrypt$0daa45d7bbb42506ba48e4ada1010227$040278d1765a98f7b60098bc28b4346d270f5c51031e2f931d95e0c611c2e7de9cf0a820d0adc8e5e41e1f77f72bfe276801db5a478553928f2f13339090a29f', 2, '/img/logo.svg'),
  (6, 'Andrés', 'Quintero', 'andres.quintero@example.com', 'scrypt$fe7d4312375e5f2813192ce64b3be485$7b3db2f52df8c243b7b433088ebb391ec4a700c9383b9ccd75b691d5f3823a725578376d1043f1c2c8c0cf7ab731e6e50847f4994f1b082fdbc44e143b1b0348', 2, '/img/logo.svg'),
  (7, 'Daniela', 'Ortiz', 'daniela.ortiz@example.com', 'scrypt$88e1938ea3993daf074fa6cbf180cef3$f6c4d0c420eb218e07b399dc6799c6972e7a8abad9e28e9360d1da28115db7cc30555c57d089dd1590fc417fe8d0025fc778ebfa153f2799bce79b1b6185fa01', 2, '/img/logo.svg'),
  (8, 'Mateo', 'Vargas', 'mateo.vargas@example.com', 'scrypt$abfb8e1a9d0cbb533a5fb06ef4a47fa4$15fa2d0e1333c94f943f5890fe861194c312d0edfa23b8ad291a0b60f67d7a09d41a3be6341ab41064bd581a790f859aeea75a1fef1aaea50052ba96073237a9', 2, '/img/logo.svg');

-- Categorías de productos
INSERT INTO categories (id, name) VALUES
  (1, 'Peluches'),
  (2, 'Mugs'),
  (3, 'Termos'),
  (4, 'Cuadros en aluminio'),
  (5, 'Globos burbuja'),
  (6, 'Ancheteas y detalles');

-- Colores
INSERT INTO colors (id, name) VALUES
  (1, 'Blanco y negro'),
  (2, 'Blanco'),
  (3, 'Rosa'),
  (4, 'Café'),
  (5, 'Lila'),
  (6, 'Celeste'),
  (7, 'Multicolor'),
  (8, 'Transparente');

-- Tamaños
INSERT INTO sizes (id, name) VALUES
  (1, '30 cm'),
  (2, '45 cm'),
  (3, '11 oz'),
  (4, '500 ml'),
  (5, '20x30 cm'),
  (6, '18 pulgadas');

-- Productos
INSERT INTO products (id, slug, name, description, price, tag, material, image, category_id) VALUES
  (1, 'vacas-corredoras', 'Vacas corredoras', 'Divertidas vacas corredoras, un detalle original para sorprender a alguien especial.', 40000, 'Más vendido', '', 'https://images.unsplash.com/photo-1631567210298-d385d8d9476c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 1),
  (2, 'domo-snoopy', 'Domo de Snoopy', 'Domo de Snoopy para decorar tu espacio o regalar a quien más quieres.', 80000, 'Nuevo', '', 'https://images.unsplash.com/photo-1762089423685-60f5cef02cda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 1),
  (3, 'peluche-kawaii', 'Peluche kawaii', 'Peluche suave y abrazable, perfecto para regalar o sumar a tu colección.', 45000, '', 'Felpa suave con relleno hipoalergénico', 'https://images.unsplash.com/photo-1744608257868-b3a034a85d22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 1),
  (4, 'mug-personalizado', 'Mug personalizado', 'Mug con diseños kawaii para acompañar tus mañanas de estudio o trabajo.', 25000, '', 'Cerámica', 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 2),
  (5, 'termo-personalizado', 'Termo personalizado', 'Termo para llevar tu bebida favorita a todas partes, con diseño a tu gusto.', 55000, '', 'Acero inoxidable', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 3),
  (6, 'cuadro-aluminio', 'Cuadro en aluminio', 'Cuadro impreso en aluminio de colores vivos y acabado duradero, listo para colgar.', 60000, 'Edición limitada', 'Aluminio', 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 4),
  (7, 'globo-burbuja', 'Globo burbuja', 'Globo burbuja para sorprender: transparente, grande y personalizable.', 18000, '', '', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 5),
  (8, 'ancheta-detalle', 'Ancheta de regalo', 'Ancheta armada a tu gusto con detalles kawaii, ideal para cumpleaños y fechas especiales.', 70000, '', '', 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', 6);

-- Colores de cada producto (position = orden en que se muestran)
INSERT INTO product_colors (product_id, color_id, position) VALUES
  (1, 1, 0),
  (2, 2, 0),
  (3, 3, 0),
  (3, 2, 1),
  (3, 4, 2),
  (4, 2, 0),
  (4, 3, 1),
  (5, 3, 0),
  (5, 5, 1),
  (5, 6, 2),
  (6, 7, 0),
  (7, 8, 0),
  (7, 3, 1),
  (8, 3, 0),
  (8, 5, 1);

-- Tamaños de cada producto
INSERT INTO product_sizes (product_id, size_id, position) VALUES
  (3, 1, 0),
  (3, 2, 1),
  (4, 3, 0),
  (5, 4, 0),
  (6, 5, 0),
  (7, 6, 0);

-- Carrito de ejemplo de Camila Torres (usuaria 3), el mismo que mostraba el sitio antes
INSERT INTO carts (id, user_id, status) VALUES
  (1, 3, 'open');

INSERT INTO cart_items (cart_id, product_id, quantity, color, size) VALUES
  (1, 3, 1, '', '45 cm'),
  (1, 1, 2, 'Blanco y negro', ''),
  (1, 4, 1, 'Rosa', '');
