// Validaciones del front-end (JavaScript puro, sin librerías).
// Cada campo se revisa al salir de él y el formulario no se envía si hay errores.
// No reemplazan a las del servidor (carpeta validations/): las reglas y los mensajes son los mismos.
//
// Cada <form data-validate="nombre"> tiene sus reglas en FORMS (más abajo).
// Una regla recibe el valor del campo y devuelve '' si está bien o el mensaje de error si está mal.
(() => {
  'use strict';

  const NAME_RE = /^[\p{L}][\p{L}\s'’.-]*$/u;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  const IMAGE_EXT = /\.(jpe?g|png|gif)$/i;
  const length = (text) => [...text].length; // cuenta caracteres, no bytes

  // ---------------------------------------------------------------------------
  // Reglas reutilizables
  // ---------------------------------------------------------------------------
  const required = (msg) => (value) => (value.trim() === '' ? msg : '');
  // Las demás reglas ignoran los campos vacíos: de eso se encarga `required` (o el campo es opcional)
  const min = (n, msg) => (value) => (value.trim() !== '' && length(value.trim()) < n ? msg : '');
  const max = (n, msg) => (value) => (length(value.trim()) > n ? msg : '');
  const pattern = (regex, msg) => (value) => (value.trim() !== '' && !regex.test(value.trim()) ? msg : '');
  const emailFormat = (value) => (value.trim() !== '' && !EMAIL_RE.test(value.trim()) ? 'Ingresa un email válido (ejemplo@correo.com)' : '');
  const sameAs = (otherName, msg) => (value, field) => (value !== '' && value !== field.form.elements[otherName].value ? msg : '');

  // La contraseña no se recorta (los espacios cuentan), igual que en el servidor
  const passwordMin = (value) => (value !== '' && length(value) < 8 ? 'La contraseña debe tener al menos 8 caracteres' : '');
  const passwordMax = (value) => (length(value) > 64 ? 'La contraseña no puede tener más de 64 caracteres' : '');
  const passwordChecks = {
    length: (v) => length(v) >= 8,
    lower: (v) => /\p{Ll}/u.test(v),
    upper: (v) => /\p{Lu}/u.test(v),
    number: (v) => /\d/.test(v),
    special: (v) => /[^\p{L}\p{N}\s]/u.test(v),
  };
  const passwordStrong = (value) =>
    value !== '' && !(passwordChecks.lower(value) && passwordChecks.upper(value) && passwordChecks.number(value) && passwordChecks.special(value))
      ? 'La contraseña debe tener mayúsculas, minúsculas, un número y un carácter especial'
      : '';

  // Aplica una regla solo si se cumple una condición (por ejemplo: "solo si escribió una contraseña nueva")
  const onlyIf = (condition, rule) => (value, field) => (condition(field) ? rule(value, field) : '');
  const wantsNewPassword = (field) => field.form.elements.password.value !== '';

  // Selector de cantidad: número entero entre 1 y 10
  const quantity = (value) => (/^\d+$/.test(value.trim()) && Number(value) >= 1 && Number(value) <= 10 ? '' : 'La cantidad debe ser un número entre 1 y 10');

  // Imagen: JPG, JPEG, PNG o GIF y con el peso máximo que indique el campo (data-max-mb)
  const imageFile = (value, field) => {
    const file = field.files && field.files[0];
    if (!file) return field.hasAttribute('data-required') ? 'Sube una imagen del producto (JPG, JPEG, PNG o GIF)' : '';
    if (!IMAGE_TYPES.includes(file.type) || !IMAGE_EXT.test(file.name)) return 'La imagen debe ser un archivo JPG, JPEG, PNG o GIF';
    const maxMB = Number(field.dataset.maxMb) || 2;
    if (file.size > maxMB * 1024 * 1024) return `La imagen no puede pesar más de ${maxMB} MB`;
    return '';
  };

  // Aviso en vivo sobre un email (lo usan el registro y el login). Pregunta al servidor si ya existe una cuenta con ese email.
  // Si no se puede consultar, no se bloquea nada: el servidor vuelve a comprobarlo al enviar.
  const emailChecks = new Map();
  const emailAvailable = async (value) => {
    const email = value.trim().toLowerCase();
    if (!EMAIL_RE.test(email) || typeof fetch !== 'function') return null; // null = no se sabe
    if (!emailChecks.has(email)) {
      try {
        const response = await fetch(`/check-email?email=${encodeURIComponent(email)}`, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
        if (!response.ok) throw new Error('sin respuesta');
        emailChecks.set(email, (await response.json()).available);
      } catch {
        return null;
      }
    }
    return emailChecks.get(email);
  };
  // Registro: el email NO debe existir. Login: el email SÍ debe existir
  const emailTaken = async (value) => ((await emailAvailable(value)) === false ? 'Ya existe una cuenta con ese email. ¿Quieres ingresar?' : '');
  const emailExists = async (value) => ((await emailAvailable(value)) === true ? 'No existe una cuenta con ese email' : '');
  emailTaken.remote = true; // reglas que consultan al servidor: se espera un momento a que el visitante termine de escribir
  emailExists.remote = true;

  // Reglas de nombre y apellido (iguales en registro y edición)
  const personName = (label) => [
    required(`El ${label} es obligatorio`),
    min(2, `El ${label} debe tener al menos 2 caracteres`),
    max(40, `El ${label} no puede tener más de 40 caracteres`),
    pattern(NAME_RE, `El ${label} solo puede tener letras, espacios, apóstrofes y guiones`),
  ];
  const emailRules = [required('El email es obligatorio'), emailFormat, max(100, 'El email no puede tener más de 100 caracteres')];

  // ---------------------------------------------------------------------------
  // Reglas de cada formulario (campo -> lista de reglas, se aplican en orden)
  // ---------------------------------------------------------------------------
  const FORMS = {
    register: {
      firstName: personName('nombre'),
      lastName: personName('apellido'),
      email: [...emailRules, emailTaken],
      password: [required('La contraseña es obligatoria'), passwordMin, passwordMax, passwordStrong],
      repassword: [required('Confirma tu contraseña'), sameAs('password', 'Las contraseñas no coinciden')],
      terms: [(value, field) => (field.checked ? '' : 'Debes aceptar los términos y condiciones')],
      avatar: [imageFile],
    },

    login: {
      email: [required('El email es obligatorio'), emailFormat, emailExists],
      password: [required('La contraseña es obligatoria')],
    },

    'user-edit': {
      firstName: personName('nombre'),
      lastName: personName('apellido'),
      email: emailRules,
      // La contraseña solo se valida si se escribe una nueva
      password: [passwordMin, passwordMax, passwordStrong],
      repassword: [onlyIf(wantsNewPassword, required('Confirma tu contraseña')), sameAs('password', 'Las contraseñas no coinciden')],
      currentPassword: [onlyIf(wantsNewPassword, required('Escribe tu contraseña actual para cambiarla'))],
      avatar: [imageFile],
    },

    product: {
      name: [
        required('El nombre es obligatorio'),
        min(5, 'El nombre debe tener al menos 5 caracteres'),
        max(60, 'El nombre no puede tener más de 60 caracteres'),
      ],
      category: [required('Selecciona una categoría')],
      price: [
        required('El precio es obligatorio'),
        pattern(/^\d+$/, 'El precio debe ser un número entero, sin puntos ni comas'),
        (value) => (/^\d+$/.test(value.trim()) && (Number(value) < 100 || Number(value) > 10000000) ? 'El precio debe estar entre $100 y $10.000.000' : ''),
      ],
      description: [
        required('La descripción es obligatoria'),
        min(20, 'La descripción debe tener al menos 20 caracteres'),
        max(400, 'La descripción no puede tener más de 400 caracteres'),
      ],
      tag: [max(20, 'La etiqueta no puede tener más de 20 caracteres')],
      material: [max(80, 'El material no puede tener más de 80 caracteres')],
      image: [imageFile],
    },

    'cart-add': {
      color: [required('Elige un color')],
      size: [required('Elige un tamaño')],
      qty: [quantity],
    },

    'cart-qty': {
      qty: [quantity],
    },
  };

  // ---------------------------------------------------------------------------
  // Mostrar y quitar errores (mismo marcado que usan las vistas del servidor)
  // ---------------------------------------------------------------------------
  const boxOf = (field) => field.closest('.field, .check-wrap') || field.form;

  function showError(field, message) {
    const box = boxOf(field);
    let note = box.querySelector(`#${field.name}-error`);

    if (message) {
      if (!note) {
        note = document.createElement('p');
        note.className = 'field__error';
        note.id = `${field.name}-error`;
        box.appendChild(note);
      }
      note.textContent = message;
      box.classList.add('field--error');
      box.classList.remove('field--ok');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', note.id);
    } else {
      if (note) note.remove();
      box.classList.remove('field--error');
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      // Solo se marca en verde un campo que tiene algo escrito o elegido
      const hasValue = field.type === 'checkbox' ? field.checked : field.type === 'file' ? field.files.length > 0 : field.value.trim() !== '';
      box.classList.toggle('field--ok', hasValue);
    }
  }

  // Revisa un campo: devuelve el mensaje de error ('' si está bien) y lo muestra
  async function validateField(field, rules) {
    const token = (field._token = (field._token || 0) + 1); // si el visitante sigue escribiendo, vale la última respuesta
    const value = field.value;
    let message = '';
    for (const rule of rules) {
      message = await rule(value, field);
      if (message) break;
    }
    if (token === field._token) showError(field, message);
    return message;
  }

  // ---------------------------------------------------------------------------
  // Extras: lista de requisitos de la contraseña y vista previa de imágenes
  // ---------------------------------------------------------------------------
  function setupPasswordRules(form) {
    form.querySelectorAll('[data-pw-rules-for]').forEach((list) => {
      const input = form.elements[list.dataset.pwRulesFor];
      const update = () => {
        list.querySelectorAll('[data-rule]').forEach((item) => {
          item.classList.toggle('is-ok', passwordChecks[item.dataset.rule](input.value));
        });
      };
      input.addEventListener('input', update);
      update();
    });
  }

  function setupImagePreview(form) {
    form.querySelectorAll('input[type="file"][data-preview]').forEach((input) => {
      const preview = document.getElementById(input.dataset.preview);
      if (!preview) return;
      const original = { src: preview.getAttribute('src'), hidden: preview.hidden }; // lo que había antes de elegir un archivo
      let objectUrl = null;

      input.addEventListener('change', () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = null;
        if (input.files[0] && imageFile('', input) === '') {
          objectUrl = URL.createObjectURL(input.files[0]);
          preview.src = objectUrl;
          preview.hidden = false;
        } else {
          preview.src = original.src;
          preview.hidden = original.hidden;
        }
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Conectar un formulario
  // ---------------------------------------------------------------------------
  function setup(form) {
    const config = FORMS[form.dataset.validate];
    if (!config) return;

    // Solo se validan los campos que existen en este formulario (por ejemplo, en el carrito no todos los productos tienen color)
    const entries = Object.entries(config)
      .map(([name, rules]) => [form.elements[name], rules])
      .filter(([field]) => field && field.name);
    const rulesOf = new Map(entries);
    const touched = new Set();
    const timers = new Map();

    setupPasswordRules(form);
    setupImagePreview(form);

    const run = (field) => validateField(field, rulesOf.get(field));

    // Al salir de un campo se revisa; después, se vuelve a revisar mientras escribe o cambia
    form.addEventListener('focusout', (event) => {
      if (rulesOf.has(event.target)) {
        touched.add(event.target);
        run(event.target);
      }
    });

    const onChange = (event) => {
      const field = event.target;
      if (!rulesOf.has(field)) return;
      const revalidate = touched.has(field) || boxOf(field).classList.contains('field--error') || field.type === 'checkbox' || field.type === 'file' || field.tagName === 'SELECT';
      if (field.type === 'file') touched.add(field);
      if (!revalidate) return;

      // El aviso de correo repetido consulta al servidor: se espera un momento a que termine de escribir
      const delay = rulesOf.get(field).some((rule) => rule.remote) ? 350 : 0;
      clearTimeout(timers.get(field));
      timers.set(field, setTimeout(() => run(field), delay));

      // Si cambia la contraseña, la confirmación puede dejar de coincidir
      if (field.name === 'password' && rulesOf.has(form.elements.repassword) && (touched.has(form.elements.repassword) || form.elements.repassword.value)) {
        run(form.elements.repassword);
      }
    };
    form.addEventListener('input', onChange);
    form.addEventListener('change', onChange);

    // Al enviar se revisa todo; si hay errores no se envía y se lleva al visitante al primero
    form.addEventListener('submit', async (event) => {
      if (form._validated) return;
      event.preventDefault();

      const messages = await Promise.all(entries.map(([field]) => run(field)));
      entries.forEach(([field]) => touched.add(field));
      const firstInvalid = entries.find((entry, i) => messages[i]);

      let summary = form.querySelector('[data-form-summary]');
      if (firstInvalid) {
        if (!summary) {
          summary = document.createElement('div');
          summary.className = 'alert alert--error';
          summary.setAttribute('role', 'alert');
          summary.setAttribute('data-form-summary', '');
          summary.textContent = 'Revisa los campos marcados en rojo para continuar.';
          form.prepend(summary);
        }
        firstInvalid[0].focus();
        return;
      }

      if (summary) summary.remove();
      form._validated = true; // evita volver a validar al enviar de verdad
      const button = form.querySelector('button[type="submit"]');
      if (button) {
        button.disabled = true; // evita enviar dos veces con doble clic
        button.dataset.label = button.textContent;
        button.textContent = 'Enviando...';
      }
      form.submit();
    });
  }

  // Si el visitante vuelve con el botón "atrás", el formulario no debe quedar bloqueado
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    document.querySelectorAll('form[data-validate]').forEach((form) => {
      form._validated = false;
      const button = form.querySelector('button[type="submit"]');
      if (button && button.dataset.label) {
        button.disabled = false;
        button.textContent = button.dataset.label;
      }
    });
  });

  document.querySelectorAll('form[data-validate]').forEach(setup);
})();
