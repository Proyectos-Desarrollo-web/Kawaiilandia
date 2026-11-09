// Tabla categories: categorías de productos
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    },
    { tableName: 'categories', timestamps: false }
  );

  Category.associate = (db) => {
    Category.hasMany(db.Product, { as: 'products', foreignKey: 'categoryId' });
  };

  return Category;
};
