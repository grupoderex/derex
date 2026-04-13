const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { signJwt } = require("../utils/auth");
const { checkSchema, body } = require("express-validator");

const User = require("../models/user_sql");
const UserFavoritesProperty = require("../models/ufp_sql");

const {
  registerUserSchema,
  loginUserSchema,
  tokenHeadersSchema,
  generateSHA256,
} = require("../utils");

const { validationMiddleware, getUserSession } = require("../middlewares");

// Crear nuevo usuario
router.post(
  "/register",
  checkSchema(registerUserSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    try {
      //TODO: validate email (send a code by email to verification)
      const newUser = req.body;
      const previousUsers = await User.search({
        primary_email: newUser.primary_email.toLowerCase(),
      });

      if (previousUsers.length > 0) {
        return res.status(400).json({
          error: "Email previamente registrado",
        });
      }

      const hashPassword = generateSHA256(newUser.password);

      registerUser = {
        first_name: newUser.first_name.toLowerCase(),
        last_name: newUser.last_name.toLowerCase(),
        password: hashPassword,
        primary_phone: newUser.primary_phone,
        primary_email: newUser.primary_email.toLowerCase(),
      };

      const result = await User.create(registerUser);

      // Verificar si result es un objeto de error
      if (!result || result?.error) {
        console.error("Error al crear nuevo usuario:", result.error);
        return res
          .status(500)
          .json({ error: result.error, stack: result.stack });
      }

      const userWithoutPassword = Object.assign({}, registerUser, {
        password: undefined,
        id: result,
      });

      const token = signJwt(userWithoutPassword);

      return res.status(201).json({
        ...userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Error al crear nuevo usuario:", error);
      return res.status(500).json({
        error: `Error interno del servidor`,
        stack: error.stack,
      });
    }
  }
);

// Endpoint para inicio de sesión (login)
router.post(
  "/login",
  checkSchema(loginUserSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const [previousUser] = await User.search({
        primary_email: email.toLowerCase(),
      });

      if (!previousUser) {
        return res.status(400).json({
          error: "Usuario no existente",
        });
      }

      if (previousUser.active !== 1)
        return res.status(400).json({
          error: "Usuario suspendido, por favor contacte a soporte",
        });

      const validPassword = bcrypt.compareSync(
        generateSHA256(password),
        previousUser.password
      );

      if (!validPassword)
        return res.status(400).json({
          error: "Credenciales incorrectas",
        });

      const userWithoutPassword = Object.assign({}, previousUser, {
        password: undefined,
        secondary_email: undefined,
        secondary_phone: undefined,
        avatar: undefined,
        active: undefined,
        auth_provider: undefined,
        email_promos: undefined,
        phone_promos: undefined,
        ubication: undefined,
        created_at: undefined,
        updated_at: undefined,
      });

      const token = signJwt(userWithoutPassword);

      return res.status(201).json({
        ...userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Error al logear un nuevo usuario:", error);
      return res.status(500).json({
        error: "Error interno del servidor",
        // stack: error.stack,
      });
    }
  }
);

// Endpoint para refrescar sesión
router.post(
  "/refresh",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getUserSession,
  async (req, res) => {
    try {
      const { id } = req.session;

      const { primary_email, primary_phone, first_name, last_name, active } =
        await User.getById(id);

      if (active !== 1)
        return res.status(400).json({
          error: "Usuario suspendido, por favor contacte a soporte",
        });

      const userData = {
        id,
        primary_email,
        primary_phone,
        first_name,
        last_name,
      };

      const token = signJwt(userData);
      return res.status(200).json({ ...userData, token });
    } catch (error) {
      console.error("Error al refrescar session: ", error);
      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }
);

router.post(
  "/manage_favorites",
  checkSchema(tokenHeadersSchema, ["headers"]),
  body("property_id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getUserSession,
  async (req, res) => {
    try {
      const userId = req.session.id;
      const { property_id } = req.body;

      // Verificar si la propiedad ya está en los favoritos
      const propertyExists = await UserFavoritesProperty.exists({
        user_id: userId,
        property_id,
      });

      if (propertyExists) {
        // Si la propiedad ya está en los favoritos, eliminarla
        await UserFavoritesProperty.deletebyUser({
          id_user: userId,
          id_property: property_id,
        });

        const favorites = await UserFavoritesProperty.getAllByUserId(userId);

        return res.status(201).json({
          success: true,
          message: "Propiedad eliminada de favoritos.",
          favorites,
        });
      } else {
        // Si la propiedad no está en los favoritos, agregarla
        await UserFavoritesProperty.create({
          userId: userId, // Asegúrate de que estas coincidan con las propiedades del modelo
          propertyId: property_id,
        });

        const favorites = await UserFavoritesProperty.getAllByUserId(userId);

        return res.status(201).json({
          success: true,
          message: "Propiedad agregada a favoritos.",
          favorites,
        });
      }
    } catch (error) {
      console.error("Error al gestionar propiedades favoritas:", error);
      console.error(error.stack);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Ruta para obtener todos los favoritos de un usuario por ID
router.post(
  "/get_all_favorites",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getUserSession,
  async (req, res) => {
    try {
      // Obtener el usuario autenticado
      const userId = req.session.id;

      // Obtener todos los favoritos del usuario
      const favorites = await UserFavoritesProperty.getAllByUserId(userId);

      res.status(200).json({ success: true, favorites });
    } catch (error) {
      console.error(
        "Error al obtener todos los favoritos por ID de usuario:",
        error
      );
      res
        .status(500)
        .json({ error: "Error interno del servidor.", stack: error.stack });
    }
  }
);

module.exports = router;
