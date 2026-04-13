const express = require("express");
const router = express.Router();
/**
 * @type {PropertySql.PropertyService}
 */
const Property = require("./property.sql");
const { tokenHeadersSchema } = require("../../utils");
const LogActivities = require("../../models/log_activities_sql");
const { query, checkSchema, param } = require("express-validator");
const { createPropertySchema } = require("./property.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

//Filtros buscador
router.get(
  "/properties_search",
  query("project").isInt({ min: 0 }).optional(),
  query("get_inactives").isBoolean().optional(),
  query("show_invisible").isBoolean().optional(),
  validationMiddleware,
  async (req, res) => {
    try {
      const { project, state, get_inactives, type, show_invisible } = req.query;
      const showInactives = get_inactives === "true";
      const showInvisible = show_invisible === "true";

      const resultadosBusqueda = await Property.search({
        project,
        state,
        showInactives,
        type,
        showInvisible,
      });
      return res.json(resultadosBusqueda);
    } catch (error) {
      console.error("Error durante la búsqueda de propiedades:", error);
      return res.status(500).json({
        error:
          "Error durante la búsqueda de propiedades. Detalles en el registro.",
      });
    }
  }
);

// Obtener todas las propiedades
router.get(
  "/",
  query("get_inactives").isBoolean().optional(),
  query("show_invisible").optional().isBoolean(),
  async (req, res) => {
    try {
      const showInactives = req.query.get_inactives === "true";
      const showInvisible = req.query.show_invisible === "true";
      const propiedades = await Property.getAll(showInactives, showInvisible);
      return res.json(propiedades);
    } catch (error) {
      console.error("Error al obtener propiedades:", error);
      return res.status(500).json({
        error: "Error al obtener propiedades. Detalles en el registro.",
      });
    }
  }
);

// Obtener propiedad por ID
router.get("/id/:id", async (req, res) => {
  const propertyId = req.params.id;
  try {
    const propiedad = await Property.getById(propertyId);
    return res.json(propiedad);
  } catch (error) {
    console.error("Error al obtener propiedad por id:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener propiedad por ID." });
  }
});

// Crear nueva propiedad
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createPropertySchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    /**
     * @type {PropertySql.CreateProperty}
     */
    const nuevaPropiedad = req.body;
    try {
      nuevaPropiedad.features = JSON.stringify(nuevaPropiedad.features);
      nuevaPropiedad.additional_info = JSON.stringify(
        nuevaPropiedad.additional_info
      );

      const idNuevaPropiedad = await Property.create(nuevaPropiedad);
      const createdPropertyId = Array.isArray(idNuevaPropiedad)
        ? idNuevaPropiedad[0]
        : idNuevaPropiedad;
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear nueva propiedad id ${createdPropertyId}`,
      });
      return res.json({ id: createdPropertyId });
    } catch (error) {
      console.error("Error al crear propiedad:", error);
      return res.status(500).json({ error: "Error al crear nueva propiedad." });
    }
  }
);

// Actualizar propiedad existente
router.put(
  "/id/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createPropertySchema, ["body"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const propertyId = req.params.id;

    const datosActualizados = req.body;

    datosActualizados.features = datosActualizados.features
      ? JSON.stringify(datosActualizados.features)
      : JSON.stringify({});

    datosActualizados.additional_info = datosActualizados.additional_info
      ? JSON.stringify(datosActualizados.additional_info)
      : JSON.stringify({});

    try {
      await Property.update(propertyId, datosActualizados);
      const propiedadActualizada = await Property.getById(propertyId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Propiedad Actualizada id ${propertyId}`,
      });
      return res.json({
        mensaje: "Propiedad actualizada exitosamente.",
        ...propiedadActualizada,
      });
    } catch (error) {
      console.error("Error al actualizar la propiedad:", error);
      return res.status(500).json({ error });
    }
  }
);

// Eliminar propiedad por ID
router.delete(
  "/id/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const propertyId = req.params.id;
    try {
      await Property.delete(propertyId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Propiedad eliminada id ${propertyId}`,
      });
      return res.json({ mensaje: "Propiedad eliminada exitosamente." });
    } catch (error) {
      console.error("Error al borrar la propiedad:", error);
      return res.status(500).json({ error: "Error al eliminar propiedad." });
    }
  }
);

// Obtener propiedad por ID
router.get(
  "/idwithproject/:id",
  query("get_inactives").isBoolean().optional(),
  async (req, res) => {
    const propertyId = req.params.id;
    const showInactives = req.query.get_inactives === "true";
    try {
      const propiedad = await Property.getByIdWithProject(
        propertyId,
        showInactives
      );
      return res.json(propiedad);
    } catch (error) {
      console.error(
        "Error al buscar propiedad con el id con propiedad:",
        error
      );
      return res
        .status(500)
        .json({ error: "Error al obtener propiedad por ID." });
    }
  }
);

// Obtener precio mas bajo por el id del proyecto
router.get(
  "/get-price-from-by-project-id/:project_id",
  param("project_id").isInt({ min: 1 }).withMessage("ID project is required"),
  validationMiddleware,
  async (req, res) => {
    try {
      const { project_id } = req.params;
      const [status, data] = await Property.getPriceFromByProjectId(project_id);
      return res.status(status).json({ data });
    } catch (error) {
      console.error("Error durante la búsqueda de propiedades:", error);
      return res.status(409).json({
        error:
          "Error durante la búsqueda de propiedades. Detalles en el registro.",
      });
    }
  }
);

// Obtener todos los prototpipos para home
router.get("/get-all-properties-for-home", async (req, res) => {
  try {
    const [status, data] = await Property.getAllPropertiesForHome();
    return res.status(status).json(data);
    return res.status(status).json(data);
  } catch (error) {
    console.error("Error al obtener propiedades para home:", error);
    return res
      .status(409)
      .json({ error: "Error al obtener propiedades para home." });
  }
});

// Get simple property list by state
router.get("/simple-list", async (req, res) => {
  try {
    const { state_id } = req.query;
    if (!state_id) {
      return res.status(400).json({ error: "state_id required" });
    }
    const properties = await Property.getSimpleByState(state_id);
    return res.json(properties);
  } catch (error) {
    console.error("Error al obtener lista simple de propiedades:", error);
    return res.status(500).json({ error: "Error al obtener propiedades." });
  }
});

module.exports = router;
