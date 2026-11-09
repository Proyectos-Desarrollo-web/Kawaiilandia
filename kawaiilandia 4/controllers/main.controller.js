const Product = require('../models/product.model');
const Site = require('../models/site.model');

const mainController = {
  home(req, res) {
    res.render('home/index', {
      title: 'Kawaiilandia | Peluches, mugs, termos y detalles para regalar en San Gil',
      description:
        'Tienda kawaii en San Gil, Santander: peluches, mugs, termos, cuadros en aluminio, globos burbuja y ancheteas. Envíos a todo Colombia.',
      active: 'home',
      featured: Product.findAll().slice(0, 8),
      site: Site,
    });
  },
};

module.exports = mainController;
