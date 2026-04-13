const express = require("express");
const { checkSchema } = require("express-validator");
const router = express.Router();

const PricesListProperty = require("../models/prices_list_property_sql");
const LogActivities = require("../models/log_activities_sql");

const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");

// Obtener todas las listas de precio de propiedades
router.get("/all", async (req, res) => {
  try {
    const pricesList = await PricesListProperty.getAll();
    res.json({ pricesList });
  } catch (error) {
    console.error("Error al obtener listas de precio:", error);
    res
      .status(500)
      .json({
        error: "Error al obtener listas de precio. Detalles en el registro.",
      });
  }
});

// Obtener una lista de precio por ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const priceList = await PricesListProperty.getById(id);
    if (priceList) {
      res.json({ priceList });
    } else {
      res.status(404).json({ error: "Lista de precio no encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener lista de precio por ID." });
  }
});

// Crear una nueva lista de precio
router.post(
  "/create",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const newData = req.body;
    try {
      const result = await PricesListProperty.create(newData);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Lista de precio creada id ${result[0]}`,
      });
      res.json({
        mensaje: "Lista de precio creada exitosamente.",
        id: result[0],
      });
    } catch (error) {
      res.status(500).json({ error: "Error al crear lista de precio." });
    }
  }
);

// Actualizar una lista de precio por ID
router.put(
  "/update/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const id = req.params.id;
    const newData = req.body;
    try {
      await PricesListProperty.update(id, newData);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Lista de precio actualizada id ${id}`,
      });
      res.json({ mensaje: "Lista de precio actualizada exitosamente." });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar lista de precio." });
    }
  }
);

// Eliminar una lista de precio por ID
router.delete(
  "/delete/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const id = req.params.id;
    try {
      await PricesListProperty.delete(id);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Lista de precio eliminada id ${id}`,
      });
      res.json({ mensaje: "Lista de precio eliminada exitosamente." });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar lista de precio." });
    }
  }
);

// Obtener una lista de precio por id_property
router.get("/property/:id_property", async (req, res) => {
  const id_property = req.params.id_property;
  try {
    const priceList = await PricesListProperty.getByPropertyId(id_property);
    res.json({ priceList });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener lista de precio por id_property." });
  }
});

// Actualizar una lista de precio por id_property
router.put(
  "/update/property/:id_property",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const id_property = req.params.id_property;
    const newData = req.body;
    try {
      await PricesListProperty.updateByPropertyId(id_property, newData);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Lista de precio actualizada por id de propiedad ${id_property}`,
      });
      res.json({
        mensaje: "Lista de precio actualizada exitosamente por id_property.",
      });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error al actualizar lista de precio por id_property.",
        });
    }
  }
);

module.exports = router;
