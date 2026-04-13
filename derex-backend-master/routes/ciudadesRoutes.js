const express = require("express");
const router = express.Router();
const City = require("../models/city_sql");
const LogActivities = require("../models/log_activities_sql");

const { checkSchema, param, body } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");

// Obtener todas las ciudades
router.get("/", async (req, res) => {
  try {
    const ciudades = await City.getAll();
    return res.json(ciudades);
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener ciudades. Detalles en el registro." });
  }
});

// Crear nueva ciudad
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  body("id_state").isInt({ min: 0 }).exists(),
  body("name").isString().trim().notEmpty(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const { email, id: id_admin, name } = req.session;
      const nuevaCiudad = req.body;
      const id = await City.create(nuevaCiudad);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Ciudad ${nuevaCiudad.name} creada en el estado id ${nuevaCiudad.id_state}`,
      });

      return res.json({ id });
    } catch (error) {
      console.error("Error al crear nueva ciudad:", error);
      return res
        .status(500)
        .json({
          error: "Error al crear nuevas ciudades. Detalles en el registro.",
        });
    }
  }
);

// Actualizar ciudad existente
router.put(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  body("id_state").isInt({ min: 0 }).optional(),
  body("name").isString().trim().notEmpty().optional(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const cityId = req.params.id;
      const { email, id: id_admin, name: admin_name } = req.session;
      const { id_state, name } = req.body;
      await City.update(cityId, { id_state, name });

      await LogActivities.create({
        email,
        name: admin_name,
        id_admin,
        activity: `Ciudad id ${cityId} actualizada - Nombre: ${name}, Estado ID: ${id_state}`,
      });

      return res.json({ mensaje: "Ciudad actualizada exitosamente." });
    } catch (error) {
      console.error("Error al actualizar ciudad:", error);
      return res.status(500).json({ error: "Error al actualizar ciudad." });
    }
  }
);

// Eliminar ciudad por ID
// router.delete('/:id', async (req, res) => {
//     const cityId = req.params.id;
//     try {
//         await City.delete(cityId);
//         return res.json({ mensaje: 'Ciudad eliminada exitosamente.' });
//     } catch (error) {
//         return res.status(500).json({ error: 'Error al eliminar ciudad.' });
//     }
// });

module.exports = router;
