const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update } = require("./footer.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

/**
 * @type {SectionsFooterSql.SectionsFooterService}
 */
const FooterSql = require("./footer.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const footer = await FooterSql.create(body);

      return res.json({
        data: footer,
        message: "Sections Footer creada.",
      });
    } catch (error) {
      console.error("Error al crear Sections Footer :", error);
      return res
        .status(500)
        .json({ error: "Error al crear Sections Footer ." });
    }
  }
);

router.get("/", getAdminSession, async (req, res) => {
  try {
    const footerCertifications = await FooterSql.getAll();
    const data = footerCertifications.map((footer) => ({
      ...footer,
      is_url: Boolean(footer.is_url),
      active: Boolean(footer.active),
    }));
    return res.json({
      data,
      message: "Sections Footer  obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener Sections Footer :", error);
    return res
      .status(500)
      .json({ error: "Error al obtener Sections Footer ." });
  }
});

router.get("/actives", async (req, res) => {
  try {
    const footerCertifications = await FooterSql.getAllActives();
    const data = footerCertifications.map((footer) => ({
      ...footer,
      is_url: Boolean(footer.is_url),
      active: Boolean(footer.active),
    }));
    return res.json({
      data,
      message: "Sections Footer  obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener Sections Footer :", error);
    return res
      .status(500)
      .json({ error: "Error al obtener Sections Footer ." });
  }
});

router.get("/id/:id", async (req, res) => {
  const footerId = parseInt(req.params.id);
  try {
    const footer = await FooterSql.getById(footerId);
    const data = {
      ...footer,
      is_url: Boolean(footer.is_url),
      active: Boolean(footer.active),
    };

    return res.json({
      data,
    });
  } catch (error) {
    console.error("Error al obtener Sections Footer :", error);
    return res
      .status(500)
      .json({ error: "Error al obtener Sections Footer por ID." });
  }
});

router.patch(
  "/id/:id",
  checkSchema(update),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const footerId = parseInt(req.params.id);
    try {
      const body = req.body;
      const footer = await FooterSql.update(footerId, body);

      return res.json({
        data: footer,
        message: "Sections Footer actualizado.",
      });
    } catch (error) {
      console.error("Error al actualizar Sections Footer :", error);
      return res
        .status(500)
        .json({ error: "Error al actualizar Sections Footer ." });
    }
  }
);

router.delete("/id/:id", getAdminSession, async (req, res) => {
  const footerId = parseInt(req.params.id);
  try {
    const footer = await FooterSql.delete(footerId);

    return res.json({
      data: footer,
      message: "Sections Footer eliminado.",
    });
  } catch (error) {
    console.error("Error al eliminar Sections Footer :", error);
    return res
      .status(500)
      .json({ error: "Error al eliminar Sections Footer ." });
  }
});

module.exports = router;
