// adminRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { checkSchema, param } = require("express-validator");

const User = require("../../models/user_sql");
const Admin = require("./admin.sql");

const { validationMiddleware, getAdminSession } = require("../../middlewares");
const {
  registerAdminSchema,
  loginUserSchema,
  tokenHeadersSchema,
  signJwt,
  updateAdminSchema,
  generateSHA256,
} = require("../../utils");

// Endpoint para obtener todos los administradores
router.post(
  "/register",
  checkSchema(registerAdminSchema, ["body"]),
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      if (req.session.role !== "owner")
        return res.status(400).json({
          error: "El adminisitrador no posee de los permisos necesarios",
        });

      const { name, email, password, role } = req.body;

      if ((await Admin.search({ email: email.toLowerCase() }).length) > 0)
        return res.status(400).json({ error: "Email previamente registrado" });

      const registerAdmin = {
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        hashed_password: generateSHA256(password),
        role,
      };

      const adminId = await Admin.create(registerAdmin);

      const adminWithoutPassword = {
        ...registerAdmin,
        hashed_password: undefined,
        id: adminId,
      };

      const token = signJwt({ ...adminWithoutPassword, isAdmin: true });

      return res.status(201).json({ ...adminWithoutPassword, token });
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Endpoint para obtener un administrador por ID
router.post(
  "/login",
  checkSchema(loginUserSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const [registerAdmin] = await Admin.search({
        email: email.toLowerCase(),
      });

      if (!registerAdmin) {
        return res.status(400).json({
          error: "Usuario no existente",
        });
      }

      if (registerAdmin.active !== 1)
        return res.status(400).json({
          error: "Admin suspendido, por favor contacte a soporte",
        });

      const validPassword = bcrypt.compareSync(
        generateSHA256(password),
        registerAdmin.hashed_password
      );

      if (!validPassword)
        return res.status(400).json({
          error: "Credenciales incorrectas",
        });

      const adminWithoutPassword = Object.assign({}, registerAdmin, {
        hashed_password: undefined,
        active: undefined,
        created_at: undefined,
        update_at: undefined,
      });

      const token = signJwt({ ...adminWithoutPassword, isAdmin: true });

      return res.status(200).json({
        ...adminWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Error al obtener administrador por ID:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.post(
  "/refresh",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const { id } = req.session;

      const { email, role, name, phone, avatar, active } = await Admin.getById(
        id
      );

      if (!active)
        return res.status(400).json({
          error: "Admin suspendido, por favor contacte a soporte",
        });

      const adminData = {
        id,
        email,
        role,
        name,
        phone,
        avatar,
      };

      const token = signJwt({ ...adminData, isAdmin: true });

      return res.status(200).json({ ...adminData, token });
    } catch (error) {
      console.error("Error al refrescar session: ", error);
      return res.status(500).json({
        error: "Error interno del servidor",
      });
    }
  }
);

// Endpoint para actualizar un administrador
router.post(
  "/update_admin/:id",
  checkSchema(updateAdminSchema, ["body"]),
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const adminId = req.params.id;
    const adminCreator = req.session;
    const updatedData = req.body;

    try {
      if (adminId !== adminCreator.id && adminCreator.role !== "owner") {
        return res.status(400).json({
          error: "No posees los permisos necesarios para modificar un admin",
        });
      }

      if (adminCreator.role !== "owner") updatedData.role = undefined;

      const registerAdmin = await Admin.getById(adminId);

      if (!registerAdmin) {
        return res.status(400).json({
          error: "Admin no existente",
        });
      }

      if (updatedData.email)
        updatedData.email = updatedData.email.toLowerCase();

      if (updatedData.name) updatedData.name = updatedData.name.toLowerCase();

      if (updatedData.password) {
        updatedData.hashed_password = generateSHA256(updatedData.password);
        updatedData.password = undefined;
      }

      await Admin.update(adminId, updatedData);
      const upadtedAdmin = await Admin.getById(adminId);
      const adminWithoutPassword = Object.assign({}, upadtedAdmin, {
        hashed_password: undefined,
        active: undefined,
        created_at: undefined,
        update_at: undefined,
      });

      res.json({
        admin: adminWithoutPassword,
        message: "Administrador actualizado correctamente",
      });
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Endpoint para eliminar un administrador
router.delete(
  "/ban/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,

  async (req, res) => {
    const adminId = req.params.id;
    const adminCreator = req.session;

    try {
      if (adminCreator.role !== "owner") {
        return res.status(400).json({
          error: "No posees los permisos necesarios para modificar un admin",
        });
      }

      const registerAdmin = await Admin.getById(adminId);

      if (!registerAdmin) {
        return res.status(400).json({
          error: "Admin no existente",
        });
      }

      const active = registerAdmin.active === 1 ? 0 : 1;

      await Admin.update(adminId, { active });

      return res.json({
        success: true,
        message: `Admin ${
          active === 1 ? "desbaneado" : "baneado"
        } correctamente`,
      });
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

router.get(
  "/get_all_admins",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const admins = await Admin.getAll();
      const response = admins.map((data) => ({
        id: data.id,
        role: data.role,
        avatar: data.avatar,
        email: data.email,
        name: data.name,
        active: data.active,
      }));
      return res.json(response);
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Obtener todos los usuarios
router.post(
  "/get_all_users",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const usuarios = await User.getAll();
      const response = usuarios.map((data) => ({
        id: data.id,
        primary_email: data.primary_email,
        primary_phone: data.primary_phone,
        first_name: data.first_name,
        last_name: data.last_name,
        active: data.active,
      }));
      return res.json(response);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res
        .status(500)
        .json({ error: "Error al obtener usuarios. Detalles en el registro." });
    }
  }
);

module.exports = router;
