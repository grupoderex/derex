const express = require("express");
const router = express.Router();
const SectionsNavbar = require("../models/sections_navbar_sql");
const SectionsFooter = require("../models/sections_footer_sql");
const LogActivities = require("../models/log_activities_sql");

const { checkSchema, body, param } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");

// Obtener todas las secciones
router.get("/all", async (req, res) => {
  try {
    const navbar = await SectionsNavbar.getAll();
    const footer = await SectionsFooter.getAll();
    res.json({ navbar, footer });
  } catch (error) {
    console.error("Error al obtener secciones:", error);
    res
      .status(500)
      .json({ error: "Error al obtener secciones. Detalles en el registro." });
  }
});

// Setear la visibilidad de una sección del navbar
router.put(
  "/navbar/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  body("active").isBoolean().exists(),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const id = req.params.id;
    const newActive = req.body.active; // Asegúrate de que 'active' se envía en el cuerpo de la solicitud
    try {
      await SectionsNavbar.updateActive(id, newActive);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizada navbar id ${id}`,
      });
      return res.json({
        mensaje: "Visibilidad del navbar actualizada exitosamente.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al actualizar la visibilidad del navbar." });
    }
  }
);

// Setear la visibilidad de una sección del footer
router.put(
  "/footer/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  body("active").isBoolean().exists(),
  param("id").isInt({ min: 0 }).exists(),
  getAdminSession,
  async (req, res) => {
    try {
      const { email, id: id_admin, name } = req.session;
      const id = req.params.id;
      const newActive = req.body.active;

      await SectionsFooter.updateActive(id, newActive);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizado footer id ${id}`,
      });
      return res.json({
        mensaje: "Visibilidad del footer actualizada exitosamente.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al actualizar la visibilidad del footer." });
    }
  }
);

module.exports = router;
