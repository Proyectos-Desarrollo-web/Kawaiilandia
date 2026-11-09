// Tabla sizes
module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define(
    'Size',
    {
      id: { type: DataTypes.SMALLINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    },
    { tableName: 'sizes', timestamps: false }
  );

  Size.associate = (db) => {
    Size.belongsToMany(db.Product, { as: 'products', through: db.ProductSize, foreignKey: 'sizeId', otherKey: 'productId' });
  };

  return Size;
};
