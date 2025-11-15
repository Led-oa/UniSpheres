const FileService = require("../services/file.service");
const FilePathToUrl = require("../utils/urlCleaner.utils");

const fileController = {
  async uploadFile(req, res) {
    try {
      // Multer met le fichier uploadé dans req.file

      console.log("Req.file : ", req.files);

      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ success: false, error: "Aucun fichier envoyé." });
      }

      const { owner_type, owner_id } = req.body;

      // Prépare les champs dynamiques en fonction de owner_type
      let annonce_id = null;
      let course_id = null;
      let message_id = null;

      switch (owner_type) {
        case "annonce":
          annonce_id = owner_id;
          break;
        case "course":
          course_id = owner_id;
          break;
        case "message":
          message_id = owner_id;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: "owner_type invalide (attendu: annonce|course|message)",
          });
      }

      const uploaded = [];

      for (const file of req.files) {
        const data = {
          file_name: file.originalname, // ✅
          file_path: file.path.replace(/\\/g, "/"), // chemin relatif (ou adapte selon ton dossier)
          annonce_id,
          course_id,
          message_id,
        };

        console.log("Data of upload file name: ", data.file_name);
        console.log("Data of upload file path: ", data.file_path);
        console.log("Data of upload annonceid : ", data.annonce_id);
        console.log("Data of upload courseid : ", data.course_id);
        console.log("Data of upload messagid : ", data.message_id);

        // Insertion BDD
        const saved = await FileService.create(data);
        uploaded.push(saved);
      }

      res.status(201).json({ success: true, data: uploaded });
    } catch (err) {
      console.error("FileController.uploadFile error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await FileService.update(req.params.id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error("FileController.update error:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async removeFile(req, res) {
    try {
      // Optionnel : supprimer le fichier du disque
      // const fileToDelete = await FileService.fetchByOwnerId(null, req.params.id);
      // if (fileToDelete?.file_path) {
      //   const fs = require("fs");
      //   fs.unlink(fileToDelete.file_path, (err) => {
      //     if (err)
      //       console.warn("Impossible de supprimer le fichier du disque :", err);
      //   });
      // }

      await FileService.remove(req.params.id);
      res.json({ success: true, message: "Fichier supprimé avec succès" });
    } catch (err) {
      console.error("FileController.remove error:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async fetchByOwner(req, res) {
    try {
      const { ownerType, ownerId } = req.params;
      const files = await FileService.fetchByOwnerId(ownerType, ownerId);
      res.json({ success: true, data: files });
    } catch (err) {
      console.error("FileController.fetchByOwner error:", err);
      res.status(400).json({ success: false, error: err.message });
    }
  },
};

module.exports = fileController;

// Upload et création d'un fichier (multipart/form-data)
// exports.uploadFile = async (req, res) => {
//   try {
//     // Multer met le fichier uploadé dans req.file

//     console.log("Req.file : ", req.files);

//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Aucun fichier envoyé." });
//     }

//     const { owner_type, owner_id } = req.body;

//     // Prépare les champs dynamiques en fonction de owner_type
//     let annonce_id = null;
//     let course_id = null;
//     let message_id = null;

//     switch (owner_type) {
//       case "annonce":
//         annonce_id = owner_id;
//         break;
//       case "course":
//         course_id = owner_id;
//         break;
//       case "message":
//         message_id = owner_id;
//         break;
//       default:
//         return res.status(400).json({
//           success: false,
//           error: "owner_type invalide (attendu: annonce|course|message)",
//         });
//     }

//     const uploaded = [];

//     for (const file of req.files) {
//       const data = {
//         file_name: file.originalname, // ✅
//         file_path: file.path.replace(/\\/g, "/"), // chemin relatif (ou adapte selon ton dossier)
//         annonce_id,
//         course_id,
//         message_id,
//       };

//       console.log("Data of upload file name: ", data.file_name);
//       console.log("Data of upload file path: ", data.file_path);
//       console.log("Data of upload annonceid : ", data.annonce_id);
//       console.log("Data of upload courseid : ", data.course_id);
//       console.log("Data of upload messagid : ", data.message_id);

//       // Insertion BDD
//       const saved = await FileService.create(data);
//       uploaded.push(saved);
//     }

//     res.status(201).json({ success: true, data: uploaded });
//   } catch (err) {
//     console.error("FileController.uploadFile error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// Mise à jour d'un fichier
// exports.update = async (req, res) => {
//   try {
//     const updated = await FileService.update(req.params.id, req.body);
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     console.error("FileController.update error:", err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// Suppression d'un fichier
// exports.removeFile = async (req, res) => {
//   try {
//     // Optionnel : supprimer le fichier du disque
//     // const fileToDelete = await FileService.fetchByOwnerId(null, req.params.id);
//     // if (fileToDelete?.file_path) {
//     //   const fs = require("fs");
//     //   fs.unlink(fileToDelete.file_path, (err) => {
//     //     if (err)
//     //       console.warn("Impossible de supprimer le fichier du disque :", err);
//     //   });
//     // }

//     await FileService.remove(req.params.id);
//     res.json({ success: true, message: "Fichier supprimé avec succès" });
//   } catch (err) {
//     console.error("FileController.remove error:", err);
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// Récupération des fichiers par owner
exports.fetchByOwner = async (req, res) => {
  try {
    const { ownerType, ownerId } = req.params;
    const files = await FileService.fetchByOwnerId(ownerType, ownerId);
    res.json({ success: true, data: files });
  } catch (err) {
    console.error("FileController.fetchByOwner error:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};
