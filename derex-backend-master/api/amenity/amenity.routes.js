const express = require("express");

const router = express.Router();
/**
 * @type {AmenitySql.AmenityService}
 */
const Amenities = require("./amenity.sql");
const LogActivities = require("../../models/log_activities_sql");

const { checkSchema, param, query } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");
const { createAmenitySchema } = require("./amenity.schemas");

router.post(
  "/create",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createAmenitySchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const body = req.body;
      const createInput = {
        name: body.name,
        name_eng: body.name_eng,
        id_project: body.id_project,
        img_url: body.img_url,
        order: body.order,
        img_alt_text: body.img_alt_text,
      };
      if (createInput.order) {
        const amenity = await Amenities.validateOrder(
          createInput.order,
          createInput.id_project
        );
        if (amenity) {
          return res.status(400).json({
            error: "El orden de la amenidad ya existe en este desarrollo.",
          });
        }
      }

      const amenity = await Amenities.create(createInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear animedad id ${amenity.id}`,
      });

      return res.status(201).json(amenity);
    } catch (error) {
      console.error("Error al crear una nueva amenidad:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

router.patch(
  "/update/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createAmenitySchema, ["body"]),
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const amenityId = req.params.id;
      const body = req.body;
      const updateInput = {
        name: body.name,
        name_eng: body.name_eng,
        img_url: body.img_url,
        order: body.order,
        img_alt_text: body.img_alt_text,
      };
      if (updateInput.order) {
        const amenity = await Amenities.validateOrderExcludingItself(
          updateInput.order,
          body.id_project,
          amenityId
        );
        if (amenity) {
          return res.status(400).json({
            error: "El orden de la amenidad ya existe en este desarrollo.",
          });
        }
      }
      if (updateInput.img_url === undefined) {
        updateInput.img_url = null;
        updateInput.order = null;
      }

      const amenity = await Amenities.update(amenityId, updateInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar amenidad id ${amenityId}`,
      });

      res.status(200).json(amenity);
    } catch (error) {
      console.error("Error al actualizar una amenidad por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

router.get(
  "/get_all/:projectId",
  param("projectId").exists().isInt().toInt(),
  query("type").optional().isString().isIn(["text", "image"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const type = req.query.type;
      if (type) {
        const amenities = await Amenities.getAllByTypeFromProjectId(
          projectId,
          type
        );
        return res.status(200).json({ success: true, amenities });
      }
      const amenities = await Amenities.getAllByProjectId(projectId);
      res.status(200).json({ success: true, amenities });
    } catch (error) {
      console.error("Error al obtener amenidades por ID de propiedad:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

router.delete(
  "/delete/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;

    try {
      const nipId = req.params.id;
      await Amenities.delete(nipId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear animedad id ${nipId}`,
      });

      res
        .status(200)
        .json({ success: true, message: "Amenidad eliminada correctamente." });
    } catch (error) {
      console.error("Error al eliminar una amenidad por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

module.exports = router;
