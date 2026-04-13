const express = require("express");
const router = express.Router();
const Blueprints = require("./blueprint.sql");
const LogActivities = require("../../models/log_activities_sql");
const { checkSchema, param, body } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");
const {
  createBlueprintSchema,
  updateBlueprintSchema,
} = require("./blueprint.schemas");

// Crear un plano del proyecto
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createBlueprintSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const blueprintData = req.body;

    try {
      blueprintData.characteristics_architectural_plans = JSON.stringify(
        blueprintData.characteristics_architectural_plans
      );
      /* TODO: Descomentar cuando se implemente el orden
      await Blueprints.validateOrder(
        blueprintData.id_property,
        blueprintData.orden
      );
      */
      const idBlueprint = await Blueprints.create(blueprintData);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear imagen de planta arquitectonica id ${idBlueprint}`,
      });

      return res.json({ id: idBlueprint });
    } catch (error) {
      return res.status(500).json({
        error: error.message ?? "Error al crear nuevo plano del proyecto.",
      });
    }
  }
);

// Actualizar un plano del proyecto por ID
router.put(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(updateBlueprintSchema, ["body"]),
  param("id").isInt().exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const idBlueprint = req.params.id;
    const blueprintData = req.body;

    try {
      /* TODO: Descomentar cuando se implemente el orden
      await Blueprints.validateOrder(
        blueprintData.id_property,
        blueprintData.orden,
        idBlueprint
      );
      */
      await Blueprints.update(idBlueprint, blueprintData);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar imagen de planta arquitectonica id ${idBlueprint}`,
      });
      return res.json({ id: idBlueprint });
    } catch (error) {
      return res.status(500).json({
        error: error.message ?? "Error al crear nuevo plano del proyecto.",
      });
    }
  }
);

// Eliminar un plano del proyecto por ID
router.delete(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const idBlueprint = req.params.id;

    try {
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Borrar imagen de planta arquitectonica id ${idBlueprint}`,
      }); //TODO: saber el nombre de la propiedad para dejarlo en el log

      await Blueprints.delete(idBlueprint);
      // TODO: Hacer borrado del S3

      return res.json({
        mensaje: "Plano del proyecto eliminado exitosamente.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error al eliminar plano del proyecto." });
    }
  }
);

// Obtener todos los planos del proyecto por ID de propiedad
router.get("/property/:id", async (req, res) => {
  const propertyId = req.params.id;
  try {
    const planos = await Blueprints.getAllByPropertyId(propertyId);
    res.json(planos);
  } catch (error) {
    console.error("Error al obtener planos por ID de propiedad:", error);
    res
      .status(500)
      .json({ error: "Error al obtener planos por ID de propiedad." });
  }
});

module.exports = router;
