const userService = require("../services/user.service");
const bcrypt = require("bcrypt");

const userController = {
  async register(req, res) {
    try {
      const userData = {
        matricule: req.body.matricule,
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        class_id: req.body.class_id,
        profile_pic: req.file ? req.file.path : null,
        is_active: 0,
      };

      console.log("User Data controller : ", userData);

      const newUser = await userService.createUser(userData);
      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.login(email, password);
      res.json({ user, token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async me(req, res) {
    try {
      const { password, ...userWithoutPassword } = req.user;
      console.log("Controller ME :", userWithoutPassword);
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des données utilisateur",
      });
    }
  },

  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      console.log("controller.gerUserById : Profile pic : ", user.profile_pic);

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { users, totalCount } = await userService.getAllUsers(
        limit,
        offset
      );
      console.log("Listes user : ", users);

      res.json({
        success: true,
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUsersByRole(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { users, totalCount } = await userService.getUsersByRole(
        req.params.role,
        limit,
        offset
      );
      console.log("Listes user by role: ", users);

      res.json({
        success: true,
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalItems: totalCount,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async getAllTeachers(req, res) {
    try {
      const { users, totalCount } = await userService.getAllTeacher();
      console.log("Listes user by role: ", users);

      res.json({
        success: true,
        data: users,
        totalItems: totalCount,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      console.log("ReqParams Id : ", req.params.id);

      // Récupérer l'utilisateur actuel
      const user = await userService.getUserById(req.params.id);
      if (!user)
        return res.status(404).json({ error: "Utilisateur non trouvé" });

      // Construire les données à mettre à jour
      const updatedData = { ...req.body };

      // Si un fichier est envoyé (photo de profil)
      if (req.file && req.file.path) {
        updatedData.profile_pic = req.file.path;
      }

      // --- Gestion mot de passe ---
      if (updatedData.oldPassword && updatedData.newPassword) {
        // Vérifier que l'ancien mot de passe est correct
        const isValid = await bcrypt.compare(
          updatedData.oldPassword,
          user.password_hash
        );
        if (!isValid) {
          return res
            .status(400)
            .json({ error: "Ancien mot de passe incorrect" });
        }

        // Hasher le nouveau mot de passe
        updatedData.password_hash = await bcrypt.hash(
          updatedData.newPassword,
          10
        );

        // Supprimer les champs temporaires
        delete updatedData.oldPassword;
        delete updatedData.newPassword;
      }

      // Supprimer la propriété password si elle est vide ou non fournie
      if (!updatedData.password) {
        delete updatedData.password;
      }

      console.log("Données reçues pour update : ", updatedData);

      // Appel du service pour mettre à jour l'utilisateur
      const updatedUser = await userService.updateUser(
        req.params.id,
        updatedData
      );

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Erreur updateUser : ", error);
      res.status(400).json({ error: error.message });
    }
  },

  async activateUser(req, res) {
    try {
      const userId = req.params.id;

      console.log("User Controller : User Id : ", userId);

      await userService.activateUser(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async desactivateUser(req, res) {
    try {
      await userService.desactivateUser(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = userController;
