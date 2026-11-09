-- ============================================================================
-- Kawaiilandia: estructura de la base de datos (MySQL / MariaDB)
-- Crea la base de datos, todas las tablas, sus restricciones y sus relaciones.
--
-- Las restricciones CHECK repiten las reglas mínimas de los formularios (largos, formato de correo, precio y cantidad).
--
-- Uso:   mysql -u root -p < database/structure.sql
--   o:   npm run db:setup      (ejecuta structure.sql y luego data.sql)
--
-- Si la base "kawaiilandia" ya existe, se borra y se vuelve a crear.
-- ============================================================================

DROP DATABASE IF EXISTS kawaiilandia;
CREATE DATABASE kawaiilandia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE kawaiilandia;

-- ---------------------------------------------------------------------------
-- Usuarios
-- ---------------------------------------------------------------------------

-- Tipos de usuario (admin, customer)
CREATE TABLE user_categories (
  id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(20)      NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_categories_name (name)
) ENGINE=InnoDB;

CREATE TABLE users (
  id           INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  first_name   VARCHAR(40)      NOT NULL,
  last_name    VARCHAR(40)      NOT NULL,
  email        VARCHAR(100)     NOT NULL,
  password     VARCHAR(255)     NOT NULL COMMENT 'Hash scrypt, nunca la contraseña en texto plano',
  category_id  TINYINT UNSIGNED NOT NULL,
  image        VARCHAR(255)     NOT NULL DEFAULT '/img/logo.svg',
  created_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_category (category_id),
  CONSTRAINT chk_users_names CHECK (CHAR_LENGTH(TRIM(first_name)) >= 2 AND CHAR_LENGTH(TRIM(last_name)) >= 2),
  CONSTRAINT chk_users_email CHECK (email REGEXP '^[^@ ]+@[^@ ]+[.][^@ ]{2,}$'),
  CONSTRAINT chk_users_image CHECK (image <> ''),
  CONSTRAINT fk_users_category
    FOREIGN KEY (category_id) REFERENCES user_categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Catálogo
-- ---------------------------------------------------------------------------

-- Categorías de productos (Peluches, Mugs, Termos...)
CREATE TABLE categories (
  id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(40)      NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB;

CREATE TABLE products (
  id           INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  slug         VARCHAR(80)      NOT NULL COMMENT 'Identificador legible que se usa en la URL: /products/domo-snoopy',
  name         VARCHAR(60)      NOT NULL,
  description  VARCHAR(400)     NOT NULL,
  price        INT UNSIGNED     NOT NULL COMMENT 'Pesos colombianos, sin decimales',
  tag          VARCHAR(20)      NOT NULL DEFAULT '' COMMENT 'Etiqueta opcional: Nuevo, Más vendido...',
  material     VARCHAR(80)      NOT NULL DEFAULT '',
  image        VARCHAR(500)     NOT NULL,
  category_id  TINYINT UNSIGNED NOT NULL,
  created_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_slug (slug),
  KEY idx_products_category (category_id),
  KEY idx_products_name (name),
  CONSTRAINT chk_products_name CHECK (CHAR_LENGTH(TRIM(name)) >= 5),
  CONSTRAINT chk_products_description CHECK (CHAR_LENGTH(TRIM(description)) >= 20),
  CONSTRAINT chk_products_price CHECK (price BETWEEN 100 AND 10000000),
  CONSTRAINT chk_products_image CHECK (image <> ''),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Colores y tamaños disponibles (se reutilizan entre productos)
CREATE TABLE colors (
  id    SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(20)       NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_colors_name (name)
) ENGINE=InnoDB;

CREATE TABLE sizes (
  id    SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(20)       NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sizes_name (name)
) ENGINE=InnoDB;

-- Relación muchos a muchos: producto <-> color. "position" conserva el orden (el primero es el color por defecto).
CREATE TABLE product_colors (
  product_id  INT UNSIGNED      NOT NULL,
  color_id    SMALLINT UNSIGNED NOT NULL,
  position    TINYINT UNSIGNED  NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, color_id),
  KEY idx_product_colors_color (color_id),
  CONSTRAINT fk_product_colors_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_product_colors_color
    FOREIGN KEY (color_id) REFERENCES colors (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Relación muchos a muchos: producto <-> tamaño
CREATE TABLE product_sizes (
  product_id  INT UNSIGNED      NOT NULL,
  size_id     SMALLINT UNSIGNED NOT NULL,
  position    TINYINT UNSIGNED  NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, size_id),
  KEY idx_product_sizes_size (size_id),
  CONSTRAINT fk_product_sizes_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_product_sizes_size
    FOREIGN KEY (size_id) REFERENCES sizes (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Carrito de compras
-- ---------------------------------------------------------------------------

-- Un carrito pertenece a un usuario. Mientras está "open" es el carrito activo.
CREATE TABLE carts (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  status      ENUM('open', 'completed') NOT NULL DEFAULT 'open',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_carts_user_status (user_id, status),
  CONSTRAINT fk_carts_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Productos de cada carrito (cantidad y variante elegida). El precio se toma del producto.
CREATE TABLE cart_items (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  cart_id     INT UNSIGNED     NOT NULL,
  product_id  INT UNSIGNED     NOT NULL,
  quantity    TINYINT UNSIGNED NOT NULL DEFAULT 1,
  color       VARCHAR(20)      NOT NULL DEFAULT '',
  size        VARCHAR(20)      NOT NULL DEFAULT '',
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_items_variant (cart_id, product_id, color, size),
  KEY idx_cart_items_product (product_id),
  CONSTRAINT chk_cart_items_quantity CHECK (quantity BETWEEN 1 AND 10),
  CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id) REFERENCES carts (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;
