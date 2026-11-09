// Tabla colors
module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define(
    'Color',
    {
      id: { type: DataTypes.SMALLINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    },
    { tableName: 'colors', timestamps: false }
  );

  Color.associate = (db) => {
    Color.belongsToMany(db.Product, { as: 'products', through: db.ProductColor, foreignKey: 'colorId', otherKey: 'productId' });
  };

  return Color;
};
