// Subida de la foto de perfil con Multer.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const AVATAR_DIR = path.join(__dirname, '..', 'public', 'uploads', 'avatars');
fs.mkdirSync(AVATAR_DIR, { recursive: true });

// La extensión se saca del tipo real del archivo, no del nombre que manda el usuario.
const EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${EXTENSIONS[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2 MB
  fileFilter: (req, file, cb) => (EXTENSIONS[file.mimetype] ? cb(null, true) : cb(new Error('INVALID_TYPE'))),
});

// Si la subida falla no se corta la petición: el error queda en req.uploadError
// y el controlador lo muestra junto a los demás errores del formulario.
function uploadAvatar(req, res, next) {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') req.uploadError = 'La foto no puede pesar más de 2 MB.';
      else if (err.message === 'INVALID_TYPE') req.uploadError = 'La foto debe ser JPG, PNG, WEBP o GIF.';
      else req.uploadError = 'No se pudo subir la foto. Intenta con otra.';
    }
    next();
  });
}

// Borra un archivo subido (si el formulario no pasó la validación).
function removeUploaded(file) {
  if (file && file.path) fs.unlink(file.path, () => {});
}

// Borra la foto anterior de un usuario, pero solo si es una foto subida (no el logo por defecto ni una URL).
function removeAvatarFile(imagePath) {
  if (typeof imagePath !== 'string' || !imagePath.startsWith('/uploads/avatars/')) return;
  const file = path.join(AVATAR_DIR, path.basename(imagePath));
  fs.unlink(file, () => {});
}

module.exports = { uploadAvatar, removeUploaded, removeAvatarFile };
