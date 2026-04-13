const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");

const PropertyImages = require("../models/ppi_sql");
const LogActivities = require("../models/log_activities_sql");

const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");

// Crear una nueva imagen de propiedad
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const idProperty = Number(req.body?.id_property);
    const imageUrl = req.body?.image_url;
    const imageAltText = req.body?.image_alt_text ?? null;

    if (!idProperty || !imageUrl) {
      return res.status(400).json({
        error: "id_property e image_url son obligatorios.",
      });
    }

    const nuevaImagen = {
      id_property: idProperty,
      image_url: imageUrl,
      image_alt_text: imageAltText,
    };
    try {
      const idNuevaImagen = await PropertyImages.create(nuevaImagen);
      try {
        await LogActivities.create({
          email,
          name,
          id_admin,
          activity: `Crear imagen de propiedad id ${idNuevaImagen}`,
        });
      } catch (logError) {
        console.error("No se pudo registrar actividad de imagen de propiedad:", logError);
      }
      res.json({ id: idNuevaImagen });
    } catch (error) {
      console.error("Error al crear nueva imagen de propiedad:", {
        body: req.body,
        sqlMessage: error?.sqlMessage,
        message: error?.message,
      });

      res.status(500).json({
        error:
          error?.sqlMessage ||
          error?.message ||
          "Error al crear nueva imagen de propiedad.",
      });
    }
  }
);

//Actualizar una imagen de propiedad por ID
router.put(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const imageId = req.params.id;
    const datosActualizados = req.body;
    try {
      await PropertyImages.update(imageId, datosActualizados);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Imagen actualizada de propiedad id ${imageId}`,
      });
      res.json({ mensaje: "Imagen de propiedad actualizada exitosamente." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al actualizar imagen de propiedad." });
    }
  }
);

// Obtener todas las imágenes de propiedad por ID de propiedad
router.get("/property/:id", async (req, res) => {
  const propertyId = req.params.id;
  try {
    const images = await PropertyImages.getAllByPropertyId(propertyId);
    res.json(images);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener imágenes de propiedad por ID de propiedad.",
    });
  }
});

// Obtener una imagen de propiedad por ID
router.get("/:id", async (req, res) => {
  const imageId = req.params.id;
  try {
    const image = await PropertyImages.getById(imageId);
    if (image) {
      res.json(image);
    } else {
      res.status(404).json({ error: "Imagen de propiedad no encontrada." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener imagen de propiedad por ID." });
  }
});

// Actualizar una imagen de propiedad por ID
router.put(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const imageId = req.params.id;
    const datosActualizados = req.body;
    try {
      await PropertyImages.update(imageId, datosActualizados);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Imagen actualizada de propiedad id ${imageId}`,
      });
      res.json({ mensaje: "Imagen de propiedad actualizada exitosamente." });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al actualizar imagen de propiedad." });
    }
  }
);

// Eliminar una imagen de propiedad por ID
router.delete(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const imageId = req.params.id;
    try {
      await PropertyImages.delete(imageId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Imagen borrada de propiedad id ${imageId}`,
      });
      res.json({ mensaje: "Imagen de propiedad eliminada exitosamente." });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar imagen de propiedad." });
    }
  }
);
module.exports = router;
