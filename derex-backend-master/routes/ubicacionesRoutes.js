const express = require("express");
const router = express.Router();
const LocationHierarchy = require("../models/location_hierarchy_sql");

// Obtener todos los estados con ciudades y proyectos
router.get("/location_hierarchy", async (req, res) => {
  try {
    const jerarquiaUbicaciones = await LocationHierarchy.getAll();
    res.json(jerarquiaUbicaciones);
  } catch (error) {
    console.error("Error al obtener jerarquía de ubicaciones:", error);
    res.status(500).json({
      error:
        "Error al obtener jerarquía de ubicaciones. Detalles en el registro.",
    });
  }
});

// Obtener la jerarquía de ubicaciones formateada
router.get("/location_hierarchy/formatted", async (req, res) => {
  try {
    const jerarquiaUbicaciones =
      await LocationHierarchy.getHierarchyFormatted();
    res.json(jerarquiaUbicaciones);
  } catch (error) {
    console.error("Error al obtener jerarquía de ubicaciones:", error);
    res.status(404).json({
      error:
        "Error al obtener jerarquía de ubicaciones. Detalles en el registro.",
    });
  }
});

module.exports = router;
