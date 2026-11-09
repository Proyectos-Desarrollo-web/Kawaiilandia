// Tabla users
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      firstName: { type: DataTypes.STRING(40), allowNull: false },
      lastName: { type: DataTypes.STRING(40), allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false }, // hash scrypt
      categoryId: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
      image: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '/img/logo.svg' },
    },
    { tableName: 'users', timestamps: true }
  );

  User.associate = (db) => {
    User.belongsTo(db.UserCategory, { as: 'category', foreignKey: 'categoryId' });
    User.hasMany(db.Cart, { as: 'carts', foreignKey: 'userId' });
  };

  return User;
};
