const express = require("express");
const router = express.Router();
const AvisosPrivacidad = require("../models/avisos_sql");

// Crear un nuevo aviso de privacidad
router.post("/", async (req, res) => {
  const nuevoAviso = req.body;
  try {
    const idNuevoAviso = await AvisosPrivacidad.create(nuevoAviso);
    res.json({ ID: idNuevoAviso });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear nuevo aviso de privacidad." });
  }
});

// Actualizar un aviso de privacidad
router.put("/:id", async (req, res) => {
  const avisoId = req.params.id;
  const datosActualizados = req.body;
  try {
    await AvisosPrivacidad.update(avisoId, datosActualizados);
    res.json({ mensaje: "Aviso de privacidad actualizado exitosamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar aviso de privacidad." });
  }
});

// Activar/desactivar un aviso de privacidad por ID
router.patch("/:id/toggleActive", async (req, res) => {
  const avisoId = req.params.id;
  try {
    await AvisosPrivacidad.toggleActive(avisoId);
    res.json({
      mensaje: "Estado del aviso de privacidad actualizado exitosamente.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al activar/desactivar aviso de privacidad." });
  }
});

// Obtener todos los avisos de privacidad
router.get("/", async (req, res) => {
  try {
    const avisos = await AvisosPrivacidad.getAll();
    res.json(avisos);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener todos los avisos de privacidad." });
  }
});

// Obtener aviso de privacidad por ID
router.get("/:id", async (req, res) => {
  const avisoId = req.params.id;
  try {
    const aviso = await AvisosPrivacidad.getById(avisoId);
    if (aviso) {
      res.json(aviso);
    } else {
      res.status(404).json({ error: "Aviso de privacidad no encontrado." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener aviso de privacidad por ID." });
  }
});

module.exports = router;
