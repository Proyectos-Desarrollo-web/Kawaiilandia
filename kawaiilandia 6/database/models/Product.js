// Tabla products
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      slug: { type: DataTypes.STRING(80), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(60), allowNull: false },
      description: { type: DataTypes.STRING(400), allowNull: false },
      price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      tag: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
      material: { type: DataTypes.STRING(80), allowNull: false, defaultValue: '' },
      image: { type: DataTypes.STRING(500), allowNull: false },
      categoryId: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
    },
    { tableName: 'products', timestamps: true }
  );

  Product.associate = (db) => {
    // Un producto pertenece a una categoría; una categoría tiene muchos productos
    Product.belongsTo(db.Category, { as: 'category', foreignKey: 'categoryId' });

    // Muchos a muchos con colores y tamaños (tablas intermedias product_colors y product_sizes)
    Product.belongsToMany(db.Color, { as: 'colors', through: db.ProductColor, foreignKey: 'productId', otherKey: 'colorId' });
    Product.belongsToMany(db.Size, { as: 'sizes', through: db.ProductSize, foreignKey: 'productId', otherKey: 'sizeId' });

    // Un producto puede estar en muchos carritos
    Product.hasMany(db.CartItem, { as: 'cartItems', foreignKey: 'productId' });
  };

  return Product;
};
