const express = require("express");
const router = express.Router();
const mediaSql = require("../models/media_sql");
const multer = require("multer");
const { checkSchema, param, body } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");
const LogActivities = require("../models/log_activities_sql");

const upload = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //     fileSize: 10 * 1024 * 1024, // limit file size to 5MB
  // },
});

// Endpoint para obtener una imagen por su ID
router.get("/get_image", async (req, res) => {
  const { imgid } = req.query;
  try {
    const { data, type } = await mediaSql.getMedia(imgid);
    res.json({ media_data: data, media_type: type });
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    res.status(500).json({ error: "Error al obtener la imagen." });
  }
});

// Endpoint para establecer una imagen por su ID
router.post(
  "/set_image",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  upload.single("file"),
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const mediaFile = req.file;
    const mediaType = mediaFile.originalname.includes(".mp4")
      ? "video"
      : "image";

    try {
      const result = await mediaSql.setMedia(mediaFile, mediaType);
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear imagen`,
      });
      res.json(result);
    } catch (error) {
      console.error("Error al establecer la imagen:", error);
      res.status(500).json({ error: "Error al establecer la imagen." });
    }
  }
);

// Endpoint para obtener la URL del video de inicio
router.get("/get_home_video", async (req, res) => {
  try {
    const { data: videoUrl } = await mediaSql.getMedia("home_video");
    res.json({ video_url: videoUrl });
  } catch (error) {
    console.error("Error al obtener la URL del video de inicio:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la URL del video de inicio." });
  }
});

// Endpoint para establecer la URL del video de inicio
router.post(
  "/set_home_video",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    const { email, id: id_admin, name } = req.session;
    const { videoFile } = req.body;
    try {
      const result = await mediaSql.setMedia("home_video", videoFile, "video");
      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear video`,
      });
      res.json(result);
    } catch (error) {
      console.error("Error al establecer la URL del video de inicio:", error);
      res
        .status(500)
        .json({ error: "Error al establecer la URL del video de inicio." });
    }
  }
);

// Endpoint para establecer la URL del video de cada desarrollo
router.post(
  "/set_video_development",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  upload.single("file"),
  async (req, res) => {
    try {
      const { email, id: id_admin, name } = req.session;
      const mediaFile = req.file;
      const result = await mediaSql.setVideoDevelopment(mediaFile);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear video`,
      });

      res.json(result);
    } catch (error) {
      console.error(
        "Error al establecer la URL del video del desarrollo:",
        error
      );
      res
        .status(401)
        .json({
          error: "Error al establecer la URL del video del desarrollo.",
        });
    }
  }
);

// Endpoint para establecer el URL del banner de cada proyecto
router.post(
  "/set_banner_project/:project_id",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  upload.single("file"),
  async (req, res) => {
    try {
      const { email, id: id_admin, name } = req.session;
      const { project_id } = req.params;
      const mediaFile = req.file;
      const result = await mediaSql.setBannerProject(mediaFile, project_id);

      await LogActivities.create({
        email,
        name,
        id_admin,
        activity: `Crear banner proyecto`,
      });

      res.status(201).json(result);
    } catch (error) {
      console.error("Error al establecer el URL del banner del desarrollo:", error);
      res.status(401).json({ error: "Error al establecer el URL del banner del desarrollo.", });
    }
  }
);

module.exports = router;
