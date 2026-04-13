const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update } = require("./customer_experience.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

/**
 * @type {CustomerExperienceSql.CustomerExperienceService}
 */
const CustomerExperience = require("./customer_experience.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const experience = await CustomerExperience.create(body);

      return res.json({
        data: experience,
        message: "Customer experience creado.",
      });
    } catch (error) {
      console.error("Error al crear customer support:", error);
      return res
        .status(500)
        .json({ error: "Error al crear customer support." });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const experiences = await CustomerExperience.getAll();
    return res.json({
      data: experiences,
      message: "Customer support obtenidos.",
    });
  } catch (error) {
    console.error("Error al obtener customer support:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener customer support." });
  }
});

router.get("/id/:id", async (req, res) => {
  const customerExperienceId = parseInt(req.params.id);
  try {
    const customerExperience = await CustomerExperience.getById(
      customerExperienceId
    );
    return res.json({
      data: customerExperience,
    });
  } catch (error) {
    console.error("Error al obtener customer support:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener customer support por ID." });
  }
});

router.patch(
  "/id/:id",
  checkSchema(update),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const customerExperienceId = parseInt(req.params.id);
    try {
      const body = req.body;
      const experience = await CustomerExperience.update(
        customerExperienceId,
        body
      );

      return res.json({
        data: experience,
        message: "Customer experience actualizado.",
      });
    } catch (error) {
      console.error("Error al actualizar customer experience:", error);
      return res
        .status(500)
        .json({ error: "Error al actualizar customer experience." });
    }
  }
);

router.delete("/id/:id", getAdminSession, async (req, res) => {
  const customerExperienceId = parseInt(req.params.id);
  try {
    const experience = await CustomerExperience.delete(customerExperienceId);

    return res.json({
      data: experience,
      message: "Customer experience eliminado.",
    });
  } catch (error) {
    console.error("Error al eliminar customer experience:", error);
    return res
      .status(500)
      .json({ error: "Error al eliminar customer experience." });
  }
});

module.exports = router;
