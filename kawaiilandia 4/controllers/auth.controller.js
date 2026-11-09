const authController = {
  registerForm(req, res) {
    res.render('auth/register', {
      title: 'Crear cuenta | Kawaiilandia',
      description: 'Regístrate en Kawaiilandia para ver tu historial de compras y comprar más rápido.',
      active: 'register',
    });
  },

  loginForm(req, res) {
    res.render('auth/login', {
      title: 'Ingresar | Kawaiilandia',
      description: 'Ingresa a tu cuenta de Kawaiilandia.',
      active: 'login',
    });
  },
};

module.exports = authController;
