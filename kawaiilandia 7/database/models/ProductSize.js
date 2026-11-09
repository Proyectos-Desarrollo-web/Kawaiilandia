// Tabla intermedia product_sizes (producto <-> tamaño)
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductSize',
    {
      productId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
      sizeId: { type: DataTypes.SMALLINT.UNSIGNED, primaryKey: true },
      position: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'product_sizes', timestamps: false }
  );
};
