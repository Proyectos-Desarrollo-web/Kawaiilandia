// Contenido editorial del sitio (textos de la home, reseñas, preguntas frecuentes, contacto).

const Site = {
  contact: {
    phone: '315 783 65 45',
    whatsapp: 'https://wa.me/573157836545',
    instagram: 'https://www.instagram.com/kawaiilandia__',
    instagramHandle: '@kawaiilandia__',
    address: ['C.C. San Gil Plaza', 'Carrera 17 #35-46', 'San Gil, Santander'],
    hours: ['Lun–Vie: 9:00am–4:00pm'],
  },

  ticker: ['Peluches', 'Mugs', 'Termos', 'Cuadros en aluminio', 'Globos burbuja', 'Ancheteas y detalles', 'Centro Comercial San Gil Plaza', '315 783 65 45'],

  categories: [
    { title: 'Peluches', description: 'Peluches suaves y abrazables para regalar o coleccionar.', image: 'https://images.unsplash.com/photo-1744608257868-b3a034a85d22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', tag: '⭐ Más vendidos', color: '#FF4DA6', filter: 'Peluches' },
    { title: 'Mugs', description: 'Mugs con diseños kawaii para tus bebidas favoritas.', image: 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', tag: '☕ Para el día a día', color: '#A855F7', filter: 'Mugs' },
    { title: 'Termos', description: 'Termos para llevar tu bebida a todas partes.', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', tag: '💜 Útiles y lindos', color: '#00A8CC', filter: 'Termos' },
    { title: 'Cuadros en aluminio', description: 'Cuadros de colores vivos y acabado duradero.', image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', tag: '🖼️ Decoración', color: '#FF6B35', filter: 'Cuadros en aluminio' },
    { title: 'Globos burbuja', description: 'Globos burbuja para sorprender en fechas especiales.', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', tag: '🎈 Celebraciones', color: '#FF4DA6', filter: 'Globos burbuja' },
    { title: 'Ancheteas y detalles', description: 'Anchetas y detalles armados a tu gusto.', image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800', tag: '🎁 Para regalar', color: '#A855F7', filter: 'Ancheteas y detalles' },
  ],

  features: [
    { icon: '🌸', title: 'Calidad premium', text: 'Productos seleccionados para que duren y se disfruten.' },
    { icon: '🚀', title: 'Envíos nacionales', text: 'Despachamos a todo Colombia, coordinando por WhatsApp.' },
    { icon: '💜', title: 'Atención personalizada', text: 'Te ayudamos a encontrar el detalle perfecto.' },
    { icon: '🎁', title: 'Pedidos especiales', text: '¿Buscas algo en particular? Lo conseguimos para ti.' },
  ],

  reviews: [
    { name: 'Valentina R.', avatar: 'V', color: '#FF4DA6', text: '¡El mejor lugar de San Gil! Encontré el detalle perfecto para regalar. La atención es increíble.' },
    { name: 'Sebastián M.', avatar: 'S', color: '#A855F7', text: 'Los peluches son divinos y los precios súper accesibles. Ya voy por mi quinta visita este mes 😄' },
    { name: 'Camila T.', avatar: 'C', color: '#00A8CC', text: 'Vine de visita a San Gil y no pude irme sin entrar. Me llevé un peluche y un mug. ¡Volveré pronto!' },
  ],

  faqs: [
    { q: '¿Dónde están ubicados?', a: 'Estamos en el Centro Comercial San Gil Plaza, Carrera 17 #35-46, San Gil, Santander.' },
    { q: '¿Cuáles son los horarios de atención?', a: 'Lunes a viernes de 9:00 am a 4:00 pm.' },
    { q: '¿Hacen envíos a todo Colombia?', a: '¡Sí! Realizamos envíos a todo el país. Contáctanos por WhatsApp para coordinar tu pedido.' },
    { q: '¿Puedo hacer pedidos personalizados?', a: 'Claro que sí. Escríbenos y buscamos ese producto especial que estás buscando.' },
  ],
};

module.exports = Site;
