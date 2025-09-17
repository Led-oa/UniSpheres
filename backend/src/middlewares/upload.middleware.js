const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");
const profilesDir = path.join(uploadsDir, "profile");
const messagesDir = path.join(uploadsDir, "message");
const coursDir = path.join(uploadsDir, "cours");
const annonceDir = path.join(uploadsDir, "annonces");

[uploadsDir, profilesDir, messagesDir, coursDir, annonceDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuration de base pour le stockage
const createStorage = (destination) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      // Créer un nom de fichier unique pour éviter les collisions
      // Format: timestamp-randomNumber-originalname
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanName = file.originalname
        .toLowerCase() // Tout en minuscules
        .normalize("NFD") // Normalise les caractères Unicode
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/[^a-z0-9._-]/g, "_") // Remplace tout caractère non autorisé par _
        .replace(/_+/g, "_") // Évite les _____ multiples
        .replace(/^_+|_+$/g, "") // Enlève les _ au début et à la fin
        .substring(0, 100); // Limite la longueur
      cb(null, uniqueSuffix + "-" + cleanName);
    },
  });

// Filtrage des types de fichiers (Validation)
const fileFilter = (allowedMimeTypes) => (req, file, cb) => {
  // Vérifier si le type MIME du fichier est dans la liste autorisée
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accepter le fichier
  } else {
    // Rejeter le fichier et passer l'erreur
    cb(
      new Error(
        `Type de fichier non supporté. Types autorisés: ${allowedMimeTypes.join(
          ", "
        )}`
      ),
      false
    );
  }
};

// Configuration spécifique pour les photos de profil
// Formats image classiques + HEIC/HEIF pour iOS
const profileUpload = multer({
  storage: createStorage(profilesDir),
  fileFilter: fileFilter([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
  ]),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Configuration pour les messages (images et documents)
// Formats image + documents Office, PDF, etc.
const messageUpload = multer({
  storage: createStorage(messagesDir),
  fileFilter: fileFilter([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp", // Images
    "application/pdf", // PDF
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "text/plain", // .txt
  ]),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// Configuration pour les cours (documents, présentations, PDF)
const courseUpload = multer({
  storage: createStorage(coursDir),
  fileFilter: fileFilter([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "application/zip", // Archives
    "application/x-rar-compressed",
  ]),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max pour les cours
  },
});

// Configuration pour les annonces (documents, images, PDF)
const annoncesUpload = multer({
  storage: createStorage(annonceDir),
  fileFilter: fileFilter([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp", // Images
    "application/pdf", // PDF
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "text/plain", // .txt
  ]),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max pour les cours
  },
});

// Middleware pour gérer les erreurs de Multer de manière propre
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: { message: "Le fichier est trop volumineux." },
      });
    }
    // Gérer d'autres erreurs Multer...
  }
  // Si c'est l'erreur de type de fichier que nous avons créée
  if (error.message.includes("Type de fichier non supporté")) {
    return res.status(400).json({
      success: false,
      error: { message: error.message },
    });
  }
  // Passer toute autre erreur au middleware d'erreur global
  next(error);
};

module.exports = {
  profileUpload,
  messageUpload,
  courseUpload,
  annoncesUpload,
  handleMulterError,
};
