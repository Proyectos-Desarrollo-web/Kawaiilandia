// Tabla user_categories: tipos de usuario (admin, customer)
module.exports = (sequelize, DataTypes) => {
  const UserCategory = sequelize.define(
    'UserCategory',
    {
      id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    },
    { tableName: 'user_categories', timestamps: false }
  );

  UserCategory.associate = (db) => {
    UserCategory.hasMany(db.User, { as: 'users', foreignKey: 'categoryId' });
  };

  return UserCategory;
};
