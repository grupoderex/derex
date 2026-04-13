const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update } = require("./section_decalogue.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

/**
 * @type {SectionDecalogueSqlSql.SectionDecalogueService}
 */
const SectionDecalogueService = require("./section_decalogue.sql");

/**
 * @type {DecalogueSql.DecalogueService}
 * */
const DecalogueService = require("../decalogue/decalogue.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const section_decalogue = await SectionDecalogueService.create(body);

      return res.json({
        data: section_decalogue,
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
    const sections = await SectionDecalogueService.getAll();

    const data = await Promise.all(
      sections.map(async (section) => {
        const decalogueId = section.id;
        const decalogueData = await DecalogueService.getBySectionId(
          decalogueId
        );
        return {
          ...section,
          decalogue: decalogueData,
        };
      })
    );

    return res.json({
      data,
      message: "Decalogue obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener Decalogue:", error);
    return res.status(500).json({ error: "Error al obtener Decalogue." });
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const sections = await SectionDecalogueService.getAll(type);

    const data = await Promise.all(
      sections.map(async (section) => {
        const decalogueId = section.id;
        const decalogueData = await DecalogueService.getBySectionId(
          decalogueId
        );
        return {
          ...section,
          decalogue: decalogueData,
        };
      })
    );

    return res.json({
      data,
      message: "Decalogue obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener Decalogue:", error);
    return res.status(500).json({ error: "Error al obtener Decalogue." });
  }
});

router.get("/id/:id", async (req, res) => {
  const decalogueId = parseInt(req.params.id);
  try {
    const section_decalogue = await SectionDecalogueService.getById(
      decalogueId
    );
    section_decalogue.decalogue = await DecalogueService.getBySectionId(
      decalogueId
    );

    return res.json({
      data: section_decalogue,
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
      const section_decalogue = await SectionDecalogueService.update(
        decalogueId,
        body
      );

      return res.json({
        data: section_decalogue,
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
    const decalogue = await SectionDecalogueService.delete(decalogueId);

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
