const express = require("express");

const router = express.Router();
/**
 * @type {ProjectPromotionsSql.ProjectPromotionsService}
 */
const ProjectPromotions = require("./project_promotions.sql");
const LogActivities = require("../../models/log_activities_sql");

const { checkSchema, param } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");
const {
  createProjectPromotionSchema,
  toggleActiveSchema,
} = require("./project_promotions.schemas");

// Crear una nueva promoción para un desarrollo
router.post(
  "/create",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createProjectPromotionSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const body = req.body;
      const createInput = {
        project_id: body.project_id,
        title_es: body.title_es,
        title_en: body.title_en,
        description_es: body.description_es,
        description_en: body.description_en,
        promo_image: body.promo_image,
        is_active: body.is_active || false,
      };

      const promotion = await ProjectPromotions.create(createInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear promoción para desarrollo id ${body.project_id}`,
      });

      return res.status(201).json(promotion);
    } catch (error) {
      console.error("Error al crear una nueva promoción:", error);

      // Verificamos si es error de desarrollo con promoción ya existente
      if (error.message && error.message.includes("ya tiene una promoción")) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Actualizar una promoción
router.patch(
  "/update/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createProjectPromotionSchema, ["body"]),
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const promotionId = req.params.id;
      const body = req.body;
      const updateInput = {
        project_id: body.project_id,
        title_es: body.title_es,
        title_en: body.title_en,
        description_es: body.description_es,
        description_en: body.description_en,
        promo_image: body.promo_image,
        is_active: body.is_active,
      };

      const promotion = await ProjectPromotions.update(
        promotionId,
        updateInput
      );

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar promoción id ${promotionId}`,
      });

      res.status(200).json(promotion);
    } catch (error) {
      console.error("Error al actualizar una promoción por ID:", error);

      // Verificamos si es error de desarrollo con promoción ya existente
      if (error.message && error.message.includes("ya tiene una promoción")) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Cambiar estado activo/inactivo de una promoción
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
      const promotionId = req.params.id;
      const { is_active } = req.body;

      await ProjectPromotions.toggleActive(promotionId, is_active);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `${
          is_active ? "Activar" : "Desactivar"
        } promoción id ${promotionId}`,
      });

      res.status(200).json({
        success: true,
        message: `Promoción ${
          is_active ? "activada" : "desactivada"
        } correctamente.`,
      });
    } catch (error) {
      console.error("Error al cambiar el estado de la promoción:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener una promoción por ID
router.get(
  "/get/:id",
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  async (req, res) => {
    try {
      const promotionId = req.params.id;
      const promotion = await ProjectPromotions.getById(promotionId);

      if (!promotion) {
        return res.status(404).json({
          error: "Promoción no encontrada.",
        });
      }

      if (promotion.is_active !== undefined) {
        promotion.is_active = !!promotion.is_active;
      }

      res.status(200).json({ success: true, promotion });
    } catch (error) {
      console.error("Error al obtener una promoción por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener una promoción por ID de proyecto
router.get(
  "/get-by-project/:projectId",
  param("projectId").isInt().exists().toInt(),
  validationMiddleware,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const promotion = await ProjectPromotions.getByProjectId(projectId);

      if (!promotion) {
        return res.status(404).json({
          error: "Promoción no encontrada para este proyecto.",
        });
      }

      if (promotion.is_active !== undefined) {
        promotion.is_active = !!promotion.is_active;
      }

      res.status(200).json({ success: true, promotion });
    } catch (error) {
      console.error(
        "Error al obtener una promoción por ID de proyecto:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Eliminar una promoción
router.delete(
  "/delete/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;

    try {
      const promotionId = req.params.id;
      await ProjectPromotions.delete(promotionId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Eliminar promoción id ${promotionId}`,
      });

      res.status(200).json({
        success: true,
        message: "Promoción eliminada correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar una promoción por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

module.exports = router;
