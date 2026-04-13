const express = require("express");
const router = express.Router();
const Stats = require("../models/stats_sql");
const { checkSchema } = require("express-validator");
const { validationMiddleware, getAdminSession } = require("../middlewares");
const { tokenHeadersSchema } = require("../utils");

router.get(
  "/",
  checkSchema(tokenHeadersSchema, ["headers"]),
  validationMiddleware,
  getAdminSession,
  async (req, res) => {
    try {
      const [
        totalHouses,
        totalProjects,
        totalUsers,
        totalLotForms,
        totalReserveForms,
        likedHouses,
      ] = await Promise.all([
        Stats.getTotalHouses(),
        Stats.getTotalProjects(),
        Stats.getTotalUsers(),
        Stats.getTotalLotForms(),
        Stats.getTotalReserveForms(),
        Stats.getPopularHousesWithDetails(),
      ]);

      const analytics = [
        { name: "Prototipos Totales", value: totalHouses },
        { name: "Desarrollos Totales", value: totalProjects },
        { name: "Usuarios Unicos Registrados", value: totalUsers },
        { name: "Formularios de Lotes Recibidos", value: totalLotForms },
        { name: "Formularios de Reservas Recibidos", value: totalReserveForms },
      ];

      return res.json({ analytics, likedHouses });
    } catch (error) {
      console.error("Error al obtener el total de casas:", error);
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
);

module.exports = router;
