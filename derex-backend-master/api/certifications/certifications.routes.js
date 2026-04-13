const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { create, update } = require("./certification.schemas");
const { castDate } = require("../../utils/dates");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

/**
 * @type {CertificationSql.CertificationService}
 */
const CertificationSql = require("./certifications.sql");

router.post(
  "/",
  checkSchema(create),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const certification = await CertificationSql.create(body);

      return res.json({
        data: certification,
        message: "Certificación creada.",
      });
    } catch (error) {
      console.error("Error al crear Certificación:", error);
      return res.status(500).json({ error: "Error al crear Certificación." });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const certifications = await CertificationSql.getAll();
    const data = certifications.map((certification) => ({
      ...certification,
      new_tab: Boolean(certification.new_tab),
      show_date: Boolean(certification.show_date),
      date: castDate(certification.date),
    }));
    return res.json({
      data,
      message: "Certificaciones obtenidas.",
    });
  } catch (error) {
    console.error("Error al obtener Certificación:", error);
    return res.status(500).json({ error: "Error al obtener Certificación." });
  }
});

router.get("/id/:id", async (req, res) => {
  const aboutUsId = parseInt(req.params.id);
  try {
    const certification = await CertificationSql.getById(aboutUsId);
    const data = {
      ...certification,
      new_tab: Boolean(certification.new_tab),
      show_date: Boolean(certification.show_date),
      date: castDate(certification.date),
    };

    return res.json({
      data,
    });
  } catch (error) {
    console.error("Error al obtener Certificación:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener Certificación por ID." });
  }
});

router.patch(
  "/id/:id",
  checkSchema(update),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const certificationId = parseInt(req.params.id);
    try {
      const body = req.body;
      const certification = await CertificationSql.update(
        certificationId,
        body
      );

      return res.json({
        data: certification,
        message: "Certificación actualizado.",
      });
    } catch (error) {
      console.error("Error al actualizar Certificación:", error);
      return res
        .status(500)
        .json({ error: "Error al actualizar Certificación." });
    }
  }
);

router.delete("/id/:id", getAdminSession, async (req, res) => {
  const certificationId = parseInt(req.params.id);
  try {
    const certification = await CertificationSql.delete(certificationId);

    return res.json({
      data: certification,
      message: "Certificación eliminado.",
    });
  } catch (error) {
    console.error("Error al eliminar Certificación:", error);
    return res.status(500).json({ error: "Error al eliminar Certificación." });
  }
});

module.exports = router;
