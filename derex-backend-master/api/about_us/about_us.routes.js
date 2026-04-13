const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update, upsertMany } = require("./about_us.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @type {AboutUsSql.AboutUsService}
 */
const AboutUs = require("./about_us.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const aboutUs = await AboutUs.create(body);

      return res.json({
        data: aboutUs,
        message: "About us creado.",
      });
    } catch (error) {
      console.error("Error al crear About us:", error);
      return res.status(500).json({ error: "Error al crear About us." });
    }
  }
);

router.post(
  "/create-or-update-many",
  validationMiddleware,
  checkSchema(upsertMany),
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const data = body.data;
      const aboutUs = await AboutUs.upsertMany(data);

      return res.json({
        data: aboutUs,
        message: "About us creados.",
      });
    } catch (error) {
      console.error("Error al crear About us:", error);
      return res.status(500).json({ error: "Error al crear About us." });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const aboutUsList = await AboutUs.getAll();
    const data = aboutUsList.map((aboutUs) => ({
      ...aboutUs,
      is_image_left: Boolean(aboutUs.is_image_left),
    }));
    return res.json({
      data,
      message: "About us obtenidos.",
    });
  } catch (error) {
    console.error("Error al obtener About us:", error);
    return res.status(500).json({ error: "Error al obtener About us." });
  }
});

router.get("/id/:id", async (req, res) => {
  const aboutUsId = parseInt(req.params.id);
  try {
    const aboutUs = await AboutUs.getById(aboutUsId);
    const data = {
      ...aboutUs,
      is_image_left: Boolean(aboutUs.is_image_left),
    };

    return res.json({
      data,
    });
  } catch (error) {
    console.error("Error al obtener About ust:", error);
    return res.status(500).json({ error: "Error al obtener About us por ID." });
  }
});

router.patch(
  "/id/:id",
  checkSchema(update),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const aboutUsId = parseInt(req.params.id);
    try {
      const body = req.body;
      const aboutUs = await AboutUs.update(aboutUsId, body);

      return res.json({
        data: aboutUs,
        message: "About us actualizado.",
      });
    } catch (error) {
      console.error("Error al actualizar About us:", error);
      return res.status(500).json({ error: "Error al actualizar About us." });
    }
  }
);

router.delete("/id/:id", getAdminSession, async (req, res) => {
  const customerExperienceId = parseInt(req.params.id);
  try {
    const aboutUs = await AboutUs.delete(customerExperienceId);

    const currents = await AboutUs.getAll();
    const reordered = currents.map((current, index) => ({
      ...current,
      index_order: index + 1,
    }));
    await Promise.all(
      reordered.map((current) => AboutUs.update(current.id, current))
    );

    return res.json({
      data: aboutUs,
      message: "About us eliminado.",
    });
  } catch (error) {
    console.error("Error al eliminar About us:", error);
    return res.status(500).json({ error: "Error al eliminar About us." });
  }
});

module.exports = router;
