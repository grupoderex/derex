const express = require("express");
const router = express.Router();
const { checkSchema, query } = require("express-validator");

/**
 * @type {ProjectSql.ProjectService}
 */
const Project = require("./project.sql");
const LogActivities = require("../../models/log_activities_sql");

const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");

const { createProjectSchema } = require("./project.schemas");

router.get("/proyectos_search", async (req, res) => {
  try {
    const { state, city, property } = req.query;
    const resultadosBusqueda = await Project.search({ state, city, property });
    return res.json(resultadosBusqueda);
  } catch (error) {
    console.error("Error durante la búsqueda de proyectos:", error);
    return res.status(500).json({
      error: "Error durante la búsqueda de proyectos. Detalles en el registro.",
    });
  }
});

// Obtener todos los proyectos
router.get(
  "/",
  query("show_invisible").optional().isBoolean(),
  async (req, res) => {
    try {
      const showInvisible = req.query.show_invisible === "true";
      const proyectos = await Project.getAll(showInvisible);
      return res.json(proyectos);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      return res.status(500).json({
        error: "Error al obtener proyectos. Detalles en el registro.",
      });
    }
  }
);

// Obtener proyecto por ID
router.get(
  "/id/:id",
  query("show_invisible").optional().isBoolean(),
  async (req, res) => {
    const projectId = req.params.id;
    const showInvisible = req.query.show_invisible === "true";
    try {
      const proyecto = await Project.getById(projectId, showInvisible);
      proyecto.is_presale = proyecto.is_presale == 1 ? true : false;
      proyecto.visible = proyecto.visible == 1 ? true : false;
      return res.json(proyecto);
    } catch (error) {
      console.error("Error al obtener proyecto:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener proyecto por ID." });
    }
  }
);

// POSTS
// Crear nuevo proyecto
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createProjectSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    /**
     * @type {ProjectSql.CreateProjectInput}
     */
    const body = req.body; // Asegúrate de enviar datos en el cuerpo de la solicitud
    body.video_url = body.video_url || "";
    body.additional_info = body.additional_info
      ? JSON.stringify(body.additional_info)
      : JSON.stringify({});
    body.contact_form = JSON.stringify(body.contact_form);
    body.short_name = body.short_name.toUpperCase();
    body.url_salesforce = body.url_salesforce;

    try {
      if ([true, "true"].includes(body.outstanding)) {
        const validate = await Project.checkExistsOutstandingByCityID(
          body.id_city
        );

        if (validate) {
          return res.status(409).json({
            msj: "Ya existe un proyecto destacado en ese estado",
            ...validate,
          });
        }
      }

      const idNuevoProyecto = await Project.create(body);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear nuevo proyecto id ${idNuevoProyecto[0]}`,
      });
      return res.json({ id: idNuevoProyecto[0] });
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      return res.status(500).json({ error: "Error al crear nuevo proyecto." });
    }
  }
);

// UPDATES
// Actualizar proyecto existente
router.put(
  "/id/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createProjectSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const projectId = req.params.id;
    /**
     * @type {ProjectSql.CreateProjectInput}
     */
    const body = req.body;
    body.video_url = body.video_url || "";
    body.additional_info = JSON.stringify(body.additional_info);
    body.contact_form = JSON.stringify(body.contact_form);
    body.url_salesforce = body.url_salesforce;
    try {
      const validate = await Project.checkExistsOutstandingByCityID(
        body.id_city
      );

      if (
        validate &&
        [true, "true"].includes(body.outstanding) &&
        validate.project_id != projectId
      ) {
        return res.status(409).json({
          msj: "Ya existe un proyecto destacado en ese estado",
          ...validate,
        });
      }

      await Project.update(projectId, body);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Proyecto actualizado id ${projectId}`,
      });
      return res.json({ mensaje: "Proyecto actualizado exitosamente." });
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
      return res.status(500).json({ error: "Error al actualizar proyecto." });
    }
  }
);

// DELETES
// Eliminar proyecto por ID
router.delete(
  "/id/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const projectId = req.params.id;
    try {
      await Project.delete(projectId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Proyecto eliminado id ${projectId}`,
      });
      return res.json({ mensaje: "Proyecto eliminado exitosamente." });
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      return res.status(500).json({ error: "Error al eliminar proyecto." });
    }
  }
);

// Obtener todos los proyectos y sus prototpipos por filtros
router.get("/get-all-projects-by-filters", async (req, res) => {
  try {
    const [status, data] = await Project.getAllProjectsByFilters(req.query);
    return res.status(status).json(data);
  } catch (error) {
    console.error("Error al obtener proyectos por filtros:", error);
    return res
      .status(409)
      .json({ error: "Error al obtener proyectos por filtros." });
  }
});

// Obtener todos los proyectos para home
router.get("/get-all-projects-for-home", async (req, res) => {
  try {
    const [status, data] = await Project.getAllProjectsForHome();
    return res.status(status).json(data);
  } catch (error) {
    console.error("Error al obtener proyectos para home:", error);
    return res
      .status(409)
      .json({ error: "Error al obtener proyectos para home." });
  }
});

// Obtener la URL completa de un documento por nombre de archivo
router.get("/get-document-url/:file_name", async (req, res) => {
  try {
    const fileName = req.params.file_name;

    if (!fileName) {
      return res.status(400).json({
        error: "El parámetro file_name es obligatorio",
      });
    }

    const documentUrl = await Project.getDocumentUrlByFileName(fileName);

    if (!documentUrl) {
      return res.status(404).json({
        error: "No se encontró ningún proyecto con el archivo especificado",
      });
    }

    return res.status(200).json({ document_url: documentUrl });
  } catch (error) {
    return res.status(500).json({
      error: "Error al procesar la solicitud. Detalles en el registro.",
    });
  }
});

// Get simple project list by state
router.get("/simple-list", async (req, res) => {
  try {
    const { state_id } = req.query;
    if (!state_id) {
      return res.status(400).json({ error: "state_id required" });
    }
    const projects = await Project.getSimpleByState(state_id);
    return res.json(projects);
  } catch (error) {
    console.error("Error al obtener lista simple de proyectos:", error);
    return res.status(500).json({ error: "Error al obtener proyectos." });
  }
});

module.exports = router;
