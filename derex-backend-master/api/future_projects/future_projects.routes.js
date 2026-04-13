const express = require("express");
const recaptcha = require("../../utils/recaptcha");
const { sendEmail, EmailSender } = require("../../utils/email");
const {
  future_project_mjml_template,
  future_project_mjml_custom_template,
} = require("../../lib/mjml/mjml_templates");
const mjml2html = require("mjml");

const router = express.Router();
/**
 * @type {FutureProjectsSql.FutureProjectsService}
 */
const FutureProjects = require("./future_projects.sql");
const LogActivities = require("../../models/log_activities_sql");

const { checkSchema, param } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../../middlewares");
const { tokenHeadersSchema } = require("../../utils");
const {
  createFutureProjectSchema,
  createFutureProjectAmenitySchema,
  validateUniqueUrl,
  contactFutureProjectSchema,
} = require("./future_projects.schemas");

// Crear un nuevo proyecto futuro
router.post(
  "/create",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createFutureProjectSchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const body = req.body;
      const createInput = {
        main_image: body.main_image,
        main_image_alt: body.main_image_alt,
        secondary_image: body.secondary_image || null,
        secondary_image_alt: body.secondary_image_alt || null,
        name: body.name,
        state_id: body.state_id || null,
        city_id: body.city_id || null,
        launch_date: body.launch_date || null,
        contact_phone: body.contact_phone || null,
        contact_email: body.contact_email,
        type: body.type,
        unique_url: body.unique_url,
      };

      const project = await FutureProjects.create(createInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear proyecto futuro id ${project.id}`,
      });

      return res.status(201).json(project);
    } catch (error) {
      console.error("Error al crear un nuevo proyecto futuro:", error);

      // Verificamos si es error de URL única
      if (error.message && error.message.includes("URL única")) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Validar URL única
router.post(
  "/validate-unique-url",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(validateUniqueUrl, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const body = req.body;
      const createInput = {
        unique_url: body.unique_url,
        project_id: body.project_id || null,
      };

      const isUnique = await FutureProjects.checkUniqueUrl(
        createInput.unique_url,
        createInput.project_id
      );

      return res.status(200).json({ isUnique });
    } catch (error) {
      console.error("Error al validar la URL única:", error);
      // Verificamos si es error de URL única
      if (error.message && error.message.includes("URL única")) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Actualizar un proyecto futuro
router.patch(
  "/update/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createFutureProjectSchema, ["body"]),
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const projectId = req.params.id;
      const body = req.body;
      const updateInput = {
        main_image: body.main_image,
        main_image_alt: body.main_image_alt,
        secondary_image: body.secondary_image,
        secondary_image_alt: body.secondary_image_alt,
        name: body.name,
        state_id: body.state_id,
        city_id: body.city_id ?? null,
        launch_date: body.launch_date,
        contact_phone: body.contact_phone,
        contact_email: body.contact_email,
        type: body.type,
        unique_url: body.unique_url,
      };

      const project = await FutureProjects.update(projectId, updateInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar proyecto futuro id ${projectId}`,
      });

      res.status(200).json(project);
    } catch (error) {
      console.error("Error al actualizar un proyecto futuro por ID:", error);

      // Verificamos si es error de URL única
      if (error.message && error.message.includes("URL única")) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener todos los proyectos futuros
router.get("/get-all", async (req, res) => {
  try {
    const projects = await FutureProjects.getAll();
    res.status(200).json({
      success: true,
      projects: projects.map((project) => ({
        ...project,
        amenities: typeof project.amenities === 'string' ? JSON.parse(project.amenities) : project.amenities || [],
      })),
    });
  } catch (error) {
    console.error("Error al obtener todos los proyectos futuros:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Obtener proyectos futuros por estado
router.get(
  "/get-by-state/:stateId",
  param("stateId").isInt().exists().toInt(),
  validationMiddleware,
  async (req, res) => {
    try {
      const stateId = req.params.stateId;
      const projects = await FutureProjects.getAllByStateId(stateId);
      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.error("Error al obtener proyectos futuros por estado:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener proyectos futuros por tipo
router.get(
  "/get-by-type/:type",
  param("type").isString().isIn(["Vertical", "Horizontal", "Mixed"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const type = req.params.type;
      const projects = await FutureProjects.getAllByType(type);
      res.status(200).json({ success: true, projects });
    } catch (error) {
      console.error("Error al obtener proyectos futuros por tipo:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener un proyecto futuro por ID
router.get(
  "/get/:id",
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const project = await FutureProjects.getById(projectId);

      if (!project) {
        return res.status(404).json({
          error: "Proyecto futuro no encontrado.",
        });
      }

      res.status(200).json({ success: true, project });
    } catch (error) {
      console.error("Error al obtener un proyecto futuro por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Eliminar un proyecto futuro
router.delete(
  "/delete/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;

    try {
      const projectId = req.params.id;
      await FutureProjects.delete(projectId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Eliminar proyecto futuro id ${projectId}`,
      });

      res.status(200).json({
        success: true,
        message: "Proyecto futuro eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error al eliminar un proyecto futuro por ID:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Enviar un correo de contacto
router.post(
  "/email/:id",
  param("id").isInt({ min: 0 }).exists(),
  checkSchema(contactFutureProjectSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const projectId = req.params.id;
      const project = await FutureProjects.getById(projectId);

      if (!project) {
        return res.status(404).json({
          error: "Proyecto futuro no encontrado.",
        });
      }

      const body = req.body;

      const recaptchaResponse = await recaptcha.verifyRecaptcha(body.recaptcha);
      if (!recaptchaResponse.success) {
        return res.status(400).json({
          success: false,
          error: "Fallo en la verificación de Recaptcha",
        });
      }

      const templateVars = [
        {
          name: "{{nombre}}",
          value: body.first_name,
        },
        {
          name: "{{apellido}}",
          value: body.last_name,
        },
        {
          name: "{{genero}}",
          value: body.gender,
        },
        {
          name: "{{estado}}",
          value: body.state,
        },
        {
          name: "{{correo}}",
          value: body.email,
        },
        {
          name: "{{telefono}}",
          value: body.phone,
        },
        {
          name: "{{proyecto}}",
          value: project.name,
        },
        {
          name: "{{mensaje}}",
          value: body.message,
        },
      ];

      let supportMjml = future_project_mjml_template;
      let customerMjml = future_project_mjml_custom_template;

      templateVars.forEach(
        ({ name, value }) =>
          (supportMjml = supportMjml.replace(new RegExp(name, "g"), value))
      );

      templateVars.forEach(
        ({ name, value }) =>
          (customerMjml = customerMjml.replace(new RegExp(name, "g"), value))
      );

      const supportHtml = mjml2html(supportMjml).html;
      const cc = [process.env.EMAIL_DESARROLLOS_FUTUROS].filter(Boolean);

      const contactEmail =
        project.contact_email || process.env.EMAIL_DESARROLLOS_FUTUROS;

      if (contactEmail) {
        await sendEmail(
          contactEmail,
          "Solicitud de Información sobre próximo lanzamiento - Javer",
          supportHtml,
          cc,
          null,
          false,
          EmailSender.futureProjects
        );
      }

      const customerHtml = mjml2html(customerMjml).html;
      await sendEmail(
        body.email,
        "Gracias por tu interés en Javer",
        customerHtml,
        null,
        null,
        false,
        EmailSender.futureProjects
      );

      return res.status(200).json({
        success: true,
        message: "Solicitud de información enviada correctamente.",
      });
    } catch (error) {
      console.error(
        "Error al enviar correo de contacto de proyecto futuro:",
        error
      );
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// ----- Rutas para amenidades de proyectos futuros -----

// Crear una nueva amenidad para un proyecto futuro
router.post(
  "/amenity/create",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createFutureProjectAmenitySchema, ["body"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const body = req.body;
      const createInput = {
        id_future_project: body.id_future_project,
        name_es: body.name_es,
        name_en: body.name_en,
      };

      const amenity = await FutureProjects.createAmenity(createInput);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear amenidad de proyecto futuro id ${amenity.id}`,
      });

      return res.status(201).json(amenity);
    } catch (error) {
      console.error(
        "Error al crear una nueva amenidad de proyecto futuro:",
        error
      );
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Obtener todas las amenidades de un proyecto futuro
router.get(
  "/amenity/get-all/:projectId",
  param("projectId").isInt().exists().toInt(),
  validationMiddleware,
  async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const amenities = await FutureProjects.getAmenitiesByProjectId(projectId);
      res.status(200).json({ success: true, amenities });
    } catch (error) {
      console.error(
        "Error al obtener amenidades por ID de proyecto futuro:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Actualizar una amenidad de proyecto futuro
router.patch(
  "/amenity/update/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  checkSchema(createFutureProjectAmenitySchema, ["body"]),
  param("id").isInt().exists().toInt(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    try {
      const amenityId = req.params.id;
      const body = req.body;
      const updateInput = {
        name_es: body.name_es,
        name_en: body.name_en,
      };

      const amenity = await FutureProjects.updateAmenity(
        amenityId,
        updateInput
      );

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Actualizar amenidad de proyecto futuro id ${amenityId}`,
      });

      res.status(200).json(amenity);
    } catch (error) {
      console.error(
        "Error al actualizar una amenidad de proyecto futuro por ID:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

// Eliminar una amenidad de proyecto futuro
router.delete(
  "/amenity/delete/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  param("id").isInt({ min: 0 }).exists(),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;

    try {
      const amenityId = req.params.id;
      await FutureProjects.deleteAmenity(amenityId);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Eliminar amenidad de proyecto futuro id ${amenityId}`,
      });

      res.status(200).json({
        success: true,
        message: "Amenidad de proyecto futuro eliminada correctamente.",
      });
    } catch (error) {
      console.error(
        "Error al eliminar una amenidad de proyecto futuro por ID:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

module.exports = router;
