// Subida de imágenes con Multer: foto de perfil (/uploads/avatars) e imagen de producto (/uploads/products).
// Solo se aceptan JPG, JPEG, PNG y GIF, con un tamaño máximo, y se revisa el tipo real del archivo.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const FOLDERS = ['avatars', 'products'];
FOLDERS.forEach((folder) => fs.mkdirSync(path.join(UPLOADS_DIR, folder), { recursive: true }));

// La extensión sale del tipo del archivo, no de su nombre (.jpg y .jpeg son el mismo formato)
const EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' };
const TYPE_ERROR = 'La imagen debe ser un archivo JPG, JPEG, PNG o GIF';

// Tipo real según los primeros bytes del archivo
function detectType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buffer.length >= 4 && buffer.subarray(0, 4).toString('latin1') === 'GIF8') return 'image/gif';
  return null;
}

function readHead(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const buffer = Buffer.alloc(12);
    const bytes = fs.readSync(fd, buffer, 0, 12, 0);
    return buffer.subarray(0, bytes);
  } finally {
    fs.closeSync(fd);
  }
}

function createImageUpload({ field, folder, maxMB }) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(UPLOADS_DIR, folder)),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${EXTENSIONS[file.mimetype]}`),
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxMB * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => (EXTENSIONS[file.mimetype] ? cb(null, true) : cb(new Error('INVALID_TYPE'))),
  });

  // Si la subida falla no se corta el pedido: el error queda en req.uploadError
  // y la validación del formulario lo muestra junto a los demás errores.
  return function uploadImage(req, res, next) {
    upload.single(field)(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') req.uploadError = `La imagen no puede pesar más de ${maxMB} MB`;
        else if (err.message === 'INVALID_TYPE') req.uploadError = TYPE_ERROR;
        else req.uploadError = 'No se pudo subir la imagen, intenta con otra';
      } else if (req.file) {
        let detected = null;
        try {
          detected = detectType(readHead(req.file.path));
        } catch {
          detected = null;
        }
        if (detected !== req.file.mimetype) {
          fs.unlink(req.file.path, () => {});
          req.file = undefined;
          req.uploadError = TYPE_ERROR;
        }
      }
      next();
    });
  };
}

const uploadAvatar = createImageUpload({ field: 'avatar', folder: 'avatars', maxMB: 2 });
const uploadProductImage = createImageUpload({ field: 'image', folder: 'products', maxMB: 3 });

// Borra un archivo recién subido (cuando el formulario no pasó la validación).
function removeUploaded(file) {
  if (file && file.path) fs.unlink(file.path, () => {});
}

// Borra una imagen guardada antes (al reemplazarla o al borrar el registro).
// Solo toca archivos de /uploads/avatars y /uploads/products.
function removeStoredImage(imagePath) {
  if (typeof imagePath !== 'string') return;
  const match = imagePath.match(/^\/uploads\/(avatars|products)\/([^/\\]+)$/);
  if (!match) return;
  fs.unlink(path.join(UPLOADS_DIR, match[1], path.basename(match[2])), () => {});
}

module.exports = { uploadAvatar, uploadProductImage, removeUploaded, removeStoredImage };
