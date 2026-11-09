const Product = require('../services/product.service');
const Site = require('../models/site.model');
const { wrapController } = require('../utils/asyncHandler');

const mainController = {
  async home(req, res) {
    res.render('home/index', {
      title: 'Kawaiilandia | Peluches, mugs, termos y detalles para regalar en San Gil',
      description:
        'Tienda kawaii en San Gil, Santander: peluches, mugs, termos, cuadros en aluminio, globos burbuja y ancheteas. Envíos a todo Colombia.',
      active: 'home',
      featured: await Product.findFeatured(8),
      site: Site,
    });
  },
};

module.exports = wrapController(mainController);
