const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update } = require("./decalogue.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { castDate } = require("../../utils");

/**
 * @type {DecalogueSql.DecalogueService}
 */
const DecalogueService = require("./decalogue.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const decalogue = await DecalogueService.create(body);

      return res.json({
        data: decalogue,
        message: "Decalogue creado.",
      });
    } catch (error) {
      console.error("Error al crear Decalogue :", error);
      return res.status(500).json({ error: "Error al crear Decalogue ." });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const decalogue = await DecalogueService.getAll();
    return res.json({
      data: decalogue,
      message: "Decalogue  obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener Decalogue :", error);
    return res.status(500).json({ error: "Error al obtener Decalogue ." });
  }
});

router.get("/id/:id", async (req, res) => {
  const decalogueId = parseInt(req.params.id);
  try {
    const decalogue = await DecalogueService.getById(decalogueId);
    const data = {
      ...decalogue,
      content_date: castDate(decalogue.content_date),
    };

    return res.json({
      data,
    });
  } catch (error) {
    console.error("Error al obtener Decalogue :", error);
    return res
      .status(500)
      .json({ error: "Error al obtener Decalogue por ID." });
  }
});

router.patch(
  "/id/:id",
  checkSchema(update),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const decalogueId = parseInt(req.params.id);
    try {
      const body = req.body;
      const decalogue = await DecalogueService.update(decalogueId, body);

      return res.json({
        data: decalogue,
        message: "Decalogue actualizado.",
      });
    } catch (error) {
      console.error("Error al actualizar Decalogue :", error);
      return res.status(500).json({ error: "Error al actualizar Decalogue ." });
    }
  }
);

router.delete("/id/:id", getAdminSession, async (req, res) => {
  const decalogueId = parseInt(req.params.id);
  try {
    const decalogue = await DecalogueService.delete(decalogueId);

    return res.json({
      data: decalogue,
      message: "Decalogue eliminado.",
    });
  } catch (error) {
    console.error("Error al eliminar Decalogue :", error);
    return res.status(500).json({ error: "Error al eliminar Decalogue ." });
  }
});

module.exports = router;
