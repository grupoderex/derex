const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");

const Documents = require("../models/documents_sql");
const LogActivities = require("../models/log_activities_sql");

const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");

// Crear un nuevo documento
router.post("/", async (req, res) => {
  const nuevoDocumento = req.body;
  try {
    const idNuevoDocumento = await Documents.create(nuevoDocumento);
    res.json({ id: idNuevoDocumento });
  } catch (error) {
    res.status(500).json({ error: "Error al crear nuevo documento." });
  }
});

// Actualizar el URL de un documento o subir uno nuevo
router.put(
  "/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const documentoId = req.params.id;
    const datosActualizados = req.body;
    try {
      await Documents.update(documentoId, datosActualizados);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar documento id ${idNuevoProyecto[0]}`,
      });
      return res.json({ mensaje: "Documento actualizado exitosamente." });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar documento." });
    }
  }
);

// Activar/desactivar un documento por ID
router.patch(
  "/:id/toggleActive",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;

    const documentoId = req.params.id;
    try {
      await Documents.toggleActive(documentoId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar documento id ${idNuevoProyecto[0]}`,
      });
      return res.json({
        mensaje: "Estado del documento actualizado exitosamente.",
      });
    } catch (error) {
      res.status(500).json({ error: "Error al activar/desactivar documento." });
    }
  }
);

// Obtener todos los enlaces de una página
router.get("/page/:page", async (req, res) => {
  const page = req.params.page;
  try {
    const documents = await Documents.getByPage(page);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener enlaces por página." });
  }
});

// Obtener todos los enlaces separados por página en un objeto JSON
router.get("/allByPages", async (req, res) => {
  try {
    const allDocuments = await Documents.getAllByPages();
    res.json(allDocuments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener todos los enlaces por páginas." });
  }
});

router.get("/contratos_adhesion", async (req, res) => {
  try {
    const allDocumentsGrouped = await Documents.getBySection();
    res.json(allDocumentsGrouped);
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          "Error al obtener todos los enlaces por páginas agrupados por sección.",
      });
  }
});

module.exports = router;
