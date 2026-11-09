// Tabla carts: un carrito por usuario (el "open" es el activo)
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      status: { type: DataTypes.ENUM('open', 'completed'), allowNull: false, defaultValue: 'open' },
    },
    { tableName: 'carts', timestamps: true }
  );

  Cart.associate = (db) => {
    Cart.belongsTo(db.User, { as: 'user', foreignKey: 'userId' });
    Cart.hasMany(db.CartItem, { as: 'items', foreignKey: 'cartId' });
  };

  return Cart;
};
