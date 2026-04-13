const express = require("express");
const router = express.Router();
/**
 * @type {StateSql.StateService}
 */
const Estados = require("./state.sql");
const LogActivities = require("../../models/log_activities_sql");

const { checkSchema, param } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");
const { createStateSchema, updateStateSchema } = require("./state.schemas");

// Obtener todos los estados
router.get("/", async (req, res) => {
  try {
    const estados = await Estados.getAll();
    return res.json(estados);
  } catch (error) {
    console.error("Error al obtener estados:", error); // Log the error
    return res
      .status(500)
      .json({ error: "Error al obtener estados. Detalles en el registro." });
  }
});

// Crear nuevo estado
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createStateSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    /**
     * @type {StateSchema.CreateStateSchema}
     */
    const body = req.body;
    const { email, id: id_admin, name } = req.session;

    try {
      const id = await Estados.create({
        name: body.name,
        active: 1,
      });

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear estado ${body.name} con ID ${id}`,
      });

      return res.json({ id });
    } catch (error) {
      console.error("Error al crear nuevos estados:", error);
      return res.status(500).json({
        error: "Error al crear nuevos estados. Detalles en el registro.",
      });
    }
  }
);

// Actualizar estado existente
router.put(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(updateStateSchema, ["body"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const idEstado = req.params.id;
    /**
     * @type {StateSchema.UpdateStateSchema}
     */
    const body = req.body;
    const { email, id: id_admin, name: admin_name } = req.session;

    try {
      await Estados.update(idEstado, {
        name: body.name,
        active: body.active,
      });

      await LogActivities.create({
        email,
        name: admin_name,
        id_admin,
        activity: `Estado id ${idEstado} actualizado - Nombre: ${body.name}`,
      });

      return res.json({ mensaje: "Estado actualizado exitosamente." });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      return res.status(500).json({ error: "Error al actualizar estado." });
    }
  }
);

//TODO: Eliminar estado por ID
// router.delete('/:id', async (req, res) => {
//     const idEstado = req.params.id;
//     try {
//         await Estados.delete(idEstado);
//         return res.json({ mensaje: 'Estado eliminado exitosamente.' });
//     } catch (error) {
//         return res.status(500).json({ error: 'Error al eliminar estado.' });
//     }
// });

// Obtener todos los estados con sus ciudades por filtros
router.get(
  "/get-all-states-cities-filters",
  async (req, res) => {
    /**
     * @type {StateSchema.GetStateCitiesFiltersSchema}
     */
    try {
      const [status, data] = await Estados.getAllStatesCitiesFilters(req.query);
      return res.status(status).json(data);
    } catch (error) {
      console.error("Error al obtener estados y sus ciudades:", error);
      return res.status(409).json({ error: "Error al obtener estados y sus ciudades" });
    }
  });

module.exports = router;
