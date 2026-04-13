const express = require("express");
const router = express.Router();
const Stylings = require("../models/stylings_sql");
const { checkSchema, param, body } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");
const LogActivities = require("../models/log_activities_sql");

// Obtener todos los stylings
router.get("/", async (req, res) => {
  try {
    const stylings = await Stylings.getAll();
    return res.json(stylings);
  } catch (error) {
    console.error("Error al obtener stylings:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener stylings. Detalles en el registro." });
  }
});

// Obtener styling por key
router.get("/:key", async (req, res) => {
  const key = req.params.key;
  try {
    const styling = await Stylings.getByKey(key);
    return res.json(styling);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener styling por key." });
  }
});

// Crear nuevo styling
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const nuevoStyling = req.body;
    try {
      const id = await Stylings.create(nuevoStyling);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Estilo actualizado por id ${id}`,
      });
      return res.json({ id });
    } catch (error) {
      console.error("Error al crear nuevos stylings:", error);
      return res
        .status(500)
        .json({
          error: "Error al crear nuevos stylings. Detalles en el registro.",
        });
    }
  }
);

// Actualizar el value de acuerdo al key
router.put(
  "/:key",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const key = req.params.key;
    const datosActualizados = req.body;
    try {
      await Stylings.updateBykey(key, datosActualizados);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Estilo actualizado por key ${key} a ${datosActualizados}`,
      });
      return res.json({ mensaje: "Styling actualizado exitosamente." });
    } catch (error) {
      console.error("Error al actualizar styling por key:", error);
      return res
        .status(500)
        .json({ error: "Error al actualizar styling por key." });
    }
  }
);

module.exports = router;
