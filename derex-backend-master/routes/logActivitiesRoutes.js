const express = require("express");
const router = express.Router();
const LogActivities = require("../models/log_activities_sql");

const { checkSchema } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");

router.get(
  "/get_all",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const activities = await LogActivities.getAll();
      res.status(200).json({ success: true, activities });
    } catch (error) {
      console.error("Error al obtener todas las actividades:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

router.get(
  "/get_by_admin/:adminId",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const adminId = req.params.adminId;
      const activities = await LogActivities.getByAdminId(adminId);
      res.status(200).json({ success: true, activities });
    } catch (error) {
      console.error("Error al obtener actividades por id_admin:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

module.exports = router;
