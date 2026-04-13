const express = require("express");
const router = express.Router();
const Blog = require("../models/blog_sql");
const { checkSchema, param, body } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");
const LogActivities = require("../models/log_activities_sql");

// Obtener todas las blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.getAll();
    return res.json(blogs);
  } catch (error) {
    console.error("Error al obtener blogs:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener blogs. Detalles en el registro." });
  }
});

router.get("/active-blogs", async (req, res) => {
  try {
    const blogs = await Blog.getAllByActive();
    return res.json(blogs);
  } catch (error) {
    console.error("Error al obtener blogs:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener blogs. Detalles en el registro." });
  }
});

// Obtener blog por ID
router.get("/id/:id", async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.getById(blogId);
    if (blog) {
      return res.json(blog);
    } else {
      return res
        .status(404)
        .json({ error: "No se encontró la blog con el ID especificado." });
    }
  } catch (error) {
    console.error("Error al obtener blog por ID ", blogId, error);
    return res.status(500).json({ error: "Error al obtener blog por ID." });
  }
});

// Crear nueva blog
router.post(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const nuevaBlog = req.body;
    try {
      const idNuevaBlog = await Blog.create(nuevaBlog);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Entrada de blog creada id ${blogId}`,
      });
      return res.json({ id: idNuevaBlog[0] });
    } catch (error) {
      console.error("Error al crear nueva blog", error);
      return res.status(500).json({ error: "Error al crear nueva Blog." });
    }
  }
);

// Actualizar blog existente
router.put(
  "/id/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const blogId = req.params.id;
    const datosActualizados = req.body;
    try {
      const rowsActual = await Blog.update(blogId, datosActualizados);
      if (rowsActual > 0) {
        await LogActivities.create({
          email,
          name,
          id_admin,
          activity: `Entrada de blog actualizada id ${blogId}`,
        });
        return res.json({ mensaje: "Blog actualizados exitosamente." });
      } else {
        return res
          .status(404)
          .json({ error: "No se encontró la blog con el ID especificado." });
      }
    } catch (error) {
      console.error("Error al actualizar blog", error);
      return res.status(500).json({ error: "Error al actualizar blog." });
    }
  }
);

// Eliminar blog por ID
router.delete(
  "/id/:id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const blogId = req.params.id;
    try {
      const rowsActual = await Blog.delete(blogId);
      if (rowsActual > 0) {
        await LogActivities.create({
          email,
          name,
          id_admin,
          activity: `Entrada de blog eliminada id ${blogId}`,
        });
        return res.json({ mensaje: "Blog eliminada exitosamente." });
      } else {
        return res
          .status(404)
          .json({ error: "No se encontró la blog con el ID especificado." });
      }
    } catch (error) {
      console.error("Error al eliminar blog", error);
      return res.status(500).json({ error: "Error al eliminar blog." });
    }
  }
);

module.exports = router;
