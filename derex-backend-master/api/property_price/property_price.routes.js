const express = require("express");
const router = express.Router();

/**
 * @type {PropertyPriceSql.PropertyPriceService}
 */
const PropertyPrice = require("./property_price.sql");

const { checkSchema } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");
const {
  upsertScheduledPricesSchema,
  getBannerScheduleSchema,
  upsertBannerScheduleSchema,
  getPricesListByPropertyIdSchema,
  getPropertyPriceByStateSchema,
} = require("./property_price.schemas");

// Get prices by state
router.get(
  "/properties-list",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(getPropertyPriceByStateSchema, ["query"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const { state_id } = req.query;

      const data = await PropertyPrice.getPropertiesListByState(state_id);

      return res.status(200).json({ data });
    } catch (error) {
      console.error("Error al obtener precios de propiedades:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);



// Get prices list by property
router.get(
  "/prices-list/:property_id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(getPricesListByPropertyIdSchema, ["params"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const { property_id } = req.params;

      const data = await PropertyPrice.getPricesListByPropertyId(property_id);

      return res.status(200).json({ data });
    } catch (error) {
      console.error("Error al obtener precios de lista:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Set scheduled prices (upsert)
router.post(
  "/schedule",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(upsertScheduledPricesSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const { prices } = req.body;

      const result = await PropertyPrice.upsertScheduledPrices(prices);

      return res.status(200).json({
        message: "Precios programados correctamente",
        ...result,
      });
    } catch (error) {
      console.error("Error al programar precios de propiedades:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Get banner schedule
router.get(
  "/banner-schedule",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(getBannerScheduleSchema, ["query"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const { project_id } = req.query;

      const data = await PropertyPrice.getBannerSchedule(project_id);

      return res.status(200).json({ data });
    } catch (error) {
      console.error("Error al obtener programación de banner:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Set banner schedule (upsert)
router.post(
  "/banner-schedule",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(upsertBannerScheduleSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const { project_id, new_banner_url, effective_datetime } = req.body;

      const result = await PropertyPrice.upsertBannerSchedule({
        project_id,
        new_banner_url,
        effective_datetime,
      });

      return res.status(200).json({
        message: "Banner programado correctamente",
        ...result,
      });
    } catch (error) {
      console.error("Error al programar banner:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

module.exports = router;
