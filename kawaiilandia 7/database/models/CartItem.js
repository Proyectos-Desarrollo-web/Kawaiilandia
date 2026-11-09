// Tabla cart_items: productos de cada carrito
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      cartId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      quantity: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 1 },
      color: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
      size: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
    },
    { tableName: 'cart_items', timestamps: true }
  );

  CartItem.associate = (db) => {
    CartItem.belongsTo(db.Cart, { as: 'cart', foreignKey: 'cartId' });
    CartItem.belongsTo(db.Product, { as: 'product', foreignKey: 'productId' });
  };

  return CartItem;
};
