const express = require("express");
const router = express.Router();
const pdfModel = require("../models/pdf_sql");
const multer = require("multer");
const { checkSchema } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");
const LogActivities = require("../models/log_activities_sql");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // limit file size to 10MB
  },
});

// Endpoint para obtener un PDF por su ID
router.get("/get_pdf", async (req, res) => {
  const { pdfId } = req.query;
  try {
    const { name, url } = await pdfModel.getPdf(pdfId);
    res.json({ pdf_name: name, pdf_url: url });
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    res.status(500).json({ error: "Error al obtener el PDF." });
  }
});

// Endpoint para establecer un PDF
router.post(
  "/set_pdf",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  upload.single("file"),
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ error: "Debe seleccionar un archivo." });
    }

    try {
      const result = await pdfModel.setPdf(pdfFile);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear pdf`,
      });
      res.json(result);
    } catch (error) {
      console.error("Error al establecer el PDF:", error);
      res.status(500).json({ error: "Error al establecer el PDF." });
    }
  }
);

// Endpoint para establecer un archivo
router.post(
  "/set_file",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  upload.single("file"),
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Debe seleccionar un archivo." });
    }

    try {
      const result = await pdfModel.setFile(file);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear archivo`,
      });
      res.json(result);
    } catch (error) {
      console.error("Error al establecer el archivo:", error);
      res.status(500).json({ error: "Error al establecer el archivo." });
    }
  }
);

router.use((error, _req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: "El archivo excede el tamano maximo permitido (10MB).",
      });
    }

    return res.status(400).json({
      error: `Error al subir archivo: ${error.message}`,
    });
  }

  return next(error);
});

// Endpoint para eliminar un PDF por su ID
router.delete(
  "/delete_pdf/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const pdfId = req.params.id;
    try {
      const rowsAffected = await pdfModel.deletePdfById(pdfId);

      if (rowsAffected === 0) {
        return res.status(404).json({ error: "PDF no encontrado." });
      }
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Borrar pdf`,
      });
      o;
      res.json({ mensaje: "PDF eliminado exitosamente." });
    } catch (error) {
      console.error("Error al eliminar el PDF por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

module.exports = router;
