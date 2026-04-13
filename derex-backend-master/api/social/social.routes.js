const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update } = require("./social.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

/**
 * @type {SocialSql.SocialService}
 */
const SocialSql = require("./social.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const social = await SocialSql.create(body);

      return res.json({
        data: social,
        message: "Red social creada.",
      });
    } catch (error) {
      console.error("Error al crear Red social:", error);
      return res.status(500).json({ error: "Error al crear Red social." });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const sociales = await SocialSql.getAll();

    return res.json({
      data: sociales,
      message: "Certificaciones obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener Red social:", error);
    return res.status(500).json({ error: "Error al obtener Red social." });
  }
});

router.get("/id/:id", async (req, res) => {
  const socialId = parseInt(req.params.id);
  try {
    const social = await SocialSql.getById(socialId);

    return res.json({
      data: social,
    });
  } catch (error) {
    console.error("Error al obtener Red social:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener Red social por ID." });
  }
});

router.patch(
  "/id/:id",
  checkSchema(update),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const socialId = parseInt(req.params.id);
    try {
      const body = req.body;
      const social = await SocialSql.update(socialId, body);

      return res.json({
        data: social,
        message: "Red social actualizado.",
      });
    } catch (error) {
      console.error("Error al actualizar Red social:", error);
      return res.status(500).json({ error: "Error al actualizar Red social." });
    }
  }
);

router.delete("/id/:id", getAdminSession, async (req, res) => {
  const socialId = parseInt(req.params.id);
  try {
    const social = await SocialSql.delete(socialId);

    return res.json({
      data: social,
      message: "Red social eliminado.",
    });
  } catch (error) {
    console.error("Error al eliminar Red social:", error);
    return res.status(500).json({ error: "Error al eliminar Red social." });
  }
});

module.exports = router;
