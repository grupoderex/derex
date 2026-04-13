const express = require("express");

const router = express.Router();
/**
 * @type {propertyUrgencyChipSql.propertyUrgencyChipService}
 */
const PropertyUrgencyChip = require("./property_urgency_chip.sql");
const LogActivities = require("../../models/log_activities_sql");

const { checkSchema, param } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");
const {
  createPropertyUrgencyChipSchema,
  toggleActiveSchema,
} = require("./property_urgency_chip.schemas");

// Crear un nuevo chip de urgencia para un desarrollo
router.post(
  "/create",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createPropertyUrgencyChipSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const body = req.body;
      const createInput = {
        property_id: body.property_id,
        description_es: body.description_es,
        description_en: body.description_en,
        notification_text_es: body.notification_text_es,
        notification_text_en: body.notification_text_en,
        is_active: body.is_active || false,
      };

      const chip = await PropertyUrgencyChip.create(createInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear chip de urgencia para desarrollo id ${body.property_id}`,
      });

      return res.status(201).json(chip);
    } catch (error) {
      console.error("Error al crear un nuevo chip de urgencia:", error);

      // Verificamos si es error de desarrollo con chip ya existente
      if (error.message && error.message.includes("ya tiene un chip")) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Actualizar un chip de urgencia
router.patch(
  "/update/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createPropertyUrgencyChipSchema, ["body"]),
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const chipId = req.params.id;
      const body = req.body;
      const updateInput = {
        property_id: body.property_id,
        description_es: body.description_es,
        description_en: body.description_en,
        notification_text_es: body.notification_text_es,
        notification_text_en: body.notification_text_en,
        is_active: body.is_active,
      };

      const chip = await PropertyUrgencyChip.update(chipId, updateInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar chip de urgencia id ${chipId}`,
      });

      res.status(200).json(chip);
    } catch (error) {
      console.error("Error al actualizar un chip de urgencia por ID:", error);

      // Verificamos si es error de desarrollo con chip ya existente
      if (error.message && error.message.includes("ya tiene un chip")) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Cambiar estado activo/inactivo de un chip de urgencia
router.patch(
  "/toggle/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(toggleActiveSchema, ["body"]),
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const chipId = req.params.id;
      const { is_active } = req.body;

      await PropertyUrgencyChip.toggleActive(chipId, is_active);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `${is_active ? "Activar" : "Desactivar"
          } chip de urgencia id ${chipId}`,
      });

      res.status(200).json({
        success: true,
        message: `Chip de urgencia ${is_active ? "activado" : "desactivado"
          } correctamente.`,
      });
    } catch (error) {
      console.error("Error al cambiar el estado del chip de urgencia:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener un chip de urgencia por ID
router.get(
  "/get/:id",
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  async (req, res) => {
    try {
      const chipId = req.params.id;
      const chip = await PropertyUrgencyChip.getById(chipId);

      if (!chip) {
        return res.status(404).json({
          error: "Chip de urgencia no encontrado.",
        });
      }

      if (chip.is_active !== undefined) {
        chip.is_active = !!chip.is_active;
      }

      res.status(200).json({ success: true, chip });
    } catch (error) {
      console.error("Error al obtener un chip de urgencia por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener un chip de urgencia por ID de proyecto
router.get(
  "/get-by-property/:propertyId",
  param("propertyId").isInt().exists().toInt(),
  validationMiddleware,
  async (req, res) => {
    try {
      const propertyId = req.params.propertyId;
      const chip = await PropertyUrgencyChip.getByPropertyId(propertyId);

      if (!chip) {
        return res.status(200).json({ success: false, chip: null });
      }

      if (chip.is_active !== undefined) {
        chip.is_active = !!chip.is_active;
      }

      res.status(200).json({ success: true, chip });
    } catch (error) {
      console.error(
        "Error al obtener un chip de urgencia por ID de proyecto:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Eliminar un chip de urgencia
router.delete(
  "/delete/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;

    try {
      const chipId = req.params.id;
      await PropertyUrgencyChip.delete(chipId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Eliminar chip de urgencia id ${chipId}`,
      });

      res.status(200).json({
        success: true,
        message: "Chip de urgencia eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar un chip de urgencia por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener todos los chips de urgencia
router.get("/", async (req, res) => {
  try {
    const chips = await PropertyUrgencyChip.getAll();

    const chipsWithBooleans = chips.map((chip) => ({
      ...chip,
      is_active: !!chip.is_active,
    }));

    res.status(200).json({ success: true, chips: chipsWithBooleans });
  } catch (error) {
    console.error("Error al obtener todos los chips de urgencia:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
