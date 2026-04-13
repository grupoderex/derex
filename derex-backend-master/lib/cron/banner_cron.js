const cron = require("node-cron");
const PropertyPrice = require("../../api/property_price/property_price.sql");

/**
 * Cron job to apply scheduled banners
 * Runs every minute to check for scheduled banners (America/Mexico_City)
 */
const scheduleBannerCron = () => {
  // Cron pattern: * * * * * (every minute)
  cron.schedule(
    "* * * * *",
    async () => {
      console.log(
        `[Banner Cron] Ejecutando actualización de banners programados - ${new Date().toISOString()}`
      );

      try {
        const result = await PropertyPrice.applyScheduledBanners();
        console.log(
          `[Banner Cron] ${result.message} - ${new Date().toISOString()}`
        );
      } catch (error) {
        console.error(
          `[Banner Cron] Error al aplicar banners programados:`,
          error
        );
      }
    },
    {
      scheduled: true,
      timezone: "America/Mexico_City",
    }
  );

  console.log(
    "[Banner Cron] Cron job de actualización de banners iniciado (cada minuto - America/Mexico_City)"
  );
};

module.exports = { scheduleBannerCron };
