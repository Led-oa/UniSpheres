const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const FilePathToUrl = require("../utils/urlCleaner.utils");

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES_IN = "1d";

const userService = {
  // Création d'un utilisateur avec hashage du mot de passe
  async createUser(userData) {
    try {
      console.log("UserData : ", userData);

      const requiredFieldsData = [
        "name",
        "lastname",
        "email",
        "password",
        "role",
      ];
      for (const field of requiredFieldsData) {
        if (!userData[field]) {
          throw apiError.badRequest(`Le champ ${field} est nécessaire`);
        }
      }
      // Verification du profile_pic
      // s'assurer que c'est une string et pas trop longue
      if (userData.profile_pic && typeof userData.profile_pic !== "string") {
        throw apiError.badRequest(
          "Le chemin de la photo de profil est invalide."
        );
      }
      if (userData.profile_pic && userData.profile_pic.length > 1000) {
        throw apiError.badRequest(
          "Le chemin de la photo de profil est trop long."
        );
      }

      const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
      const userToCreate = {
        ...userData,
        password_hash: hashedPassword,
      };

      const newUser = await userModel.create(userToCreate);

      if (newUser.profile_pic) {
        newUser.profile_pic = FilePathToUrl.urlCleaner(newUser.profile_pic);
      }

      return newUser;
    } catch (error) {
      console.error("userService.createUser error:", error);
      throw error;
    }
  },

  // Login : vérification du mot de passe et génération du token
  async login(email, password) {
    try {
      const user = await userModel.findByEmail(email);
      if (!user) throw new Error("USER_NOT_FOUND");

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) throw new Error("INVALID_PASSWORD");

      const token = jwt.sign(
        {
          id_user: user.id_user,
          class_id: user.class_id,
          role: user.role,
          email: user.email,
          is_active: user.is_active,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );

      if (user.profile_pic) {
        user.profile_pic = FilePathToUrl.urlCleaner(user.profile_pic);
      }
      return { user, token };
    } catch (error) {
      console.error("userService.login error:", error);
      throw error;
    }
  },

  // Récupération d'un utilisateur par ID
  async getUserById(userId) {
    try {
      const user = await userModel.findById(userId);
      if (!user) return null;

      console.log("Service.gerUserById : Profile pic : ", user.profile_pic);

      if (user.profile_pic) {
        user.profile_pic = FilePathToUrl.urlCleaner(user.profile_pic);
      }

      return user;
    } catch (error) {
      console.error("userService.getUserById error:", error);
      throw error;
    }
  },

  // Récupération de tous les utilisateurs
  async getAllUsers(limit, offset) {
    try {
      const users = await userModel.findAll(limit, offset);
      const totalCount = await userModel.getTotalCount();

      const cleanedUser = users.map((u) => {
        if (u.profile_pic)
          u.profile_pic = FilePathToUrl.urlCleaner(u.profile_pic);
        return u;
      });

      console.log("CLEANED USER : ", cleanedUser);

      return {
        users: cleanedUser,
        totalCount,
      };
    } catch (error) {
      console.error("userService.getAllUsers error:", error);
      throw error;
    }
  },

  // Récupération par rôle
  async getUsersByRole(role, limit, offset) {
    try {
      const users = await userModel.findAllByRole(limit, offset, role);
      const totalCount = await userModel.getCountByRole(role);

      const cleanedUser = users.map((u) => {
        if (u.profile_pic)
          u.profile_pic = FilePathToUrl.urlCleaner(u.profile_pic);
        return u;
      });

      return {
        users: cleanedUser,
        totalCount,
      };
    } catch (error) {
      console.error("userService.getUsersByRole error:", error);
      throw error;
    }
  },

  async getAllTeacher() {
    try {
      const role = "teacher";
      const users = await userModel.findAllTeacher();
      const totalCount = await userModel.getCountByRole(role);

      const cleanedUser = users.map((u) => {
        if (u.profile_pic)
          u.profile_pic = FilePathToUrl.urlCleaner(u.profile_pic);
        return u;
      });

      return {
        users: cleanedUser,
        totalCount,
      };
    } catch (error) {
      console.error("userService.getUsersByRole error:", error);
      throw error;
    }
  },

  async loadAll() {
    try {
      const users = await userModel.loadAll();

      const cleanedUser = users.map((u) => {
        if (u.profile_pic)
          u.profile_pic = FilePathToUrl.urlCleaner(u.profile_pic);
        return u;
      });

      return {
        users: cleanedUser,
      };
    } catch (error) {
      console.error("userService.getUsersByRole error:", error);
      throw error;
    }
  },

  // Mise à jour d'un utilisateur (hashage si mot de passe fourni)
  async updateUser(userId, updates) {
    try {
      console.log("UpdatesData : ", userId);
      console.log("UpdatesData : ", updates);
      const userUpdates = { ...updates };

      if (userUpdates.password) {
        userUpdates.password_hash = await bcrypt.hash(
          userUpdates.password,
          SALT_ROUNDS
        );
        delete userUpdates.password;
      }

      const success = await userModel.update({
        id_user: userId,
        ...userUpdates,
      });
      if (!success) throw new Error("UPDATE_FAILED");

      const updatedUser = await userModel.findById(userId);
      if (updatedUser.profile_pic) {
        updatedUser.profile_pic = FilePathToUrl.urlCleaner(
          updatedUser.profile_pic
        );
      }

      return updatedUser;
    } catch (error) {
      console.error("userService.updateUser error:", error);
      throw error;
    }
  },

  // Activation d'un utilisateur
  async activateUser(userId) {
    try {
      const success = await userModel.activate(userId);
      if (!success) throw new Error("ACTIVATE_FAILED");
      return true;
    } catch (error) {
      console.error("userService.activateUser error:", error);
      throw error;
    }
  },

  // Désactivation d'un utilisateur
  async desactivateUser(userId) {
    try {
      const success = await userModel.desactivate(userId);
      if (!success) throw new Error("DESACTIVATE_FAILED");
      return true;
    } catch (error) {
      console.error("userService.desactivateUser error:", error);
      throw error;
    }
  },

  // Suppression physique d'un utilisateur
  async deleteUser(userId) {
    try {
      const success = await userModel.hardDelete(userId);
      if (!success) throw new Error("DELETE_FAILED");
      return true;
    } catch (error) {
      console.error("userService.deleteUser error:", error);
      throw error;
    }
  },
};

module.exports = userService;
