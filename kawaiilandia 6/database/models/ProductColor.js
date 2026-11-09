// Tabla intermedia product_colors (producto <-> color). "position" guarda el orden de los colores.
module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'ProductColor',
    {
      productId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
      colorId: { type: DataTypes.SMALLINT.UNSIGNED, primaryKey: true },
      position: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, defaultValue: 0 },
    },
    { tableName: 'product_colors', timestamps: false }
  );
};
