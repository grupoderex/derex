const cron = require("node-cron");
const PropertyPrice = require("../../api/property_price/property_price.sql");

/**
 * Cron job to apply scheduled property prices
 * Runs every minute to check for scheduled prices (America/Mexico_City)
 */
const schedulePropertyPriceCron = () => {
  // Cron pattern: * * * * * (every minute)
  cron.schedule(
    "* * * * *",
    async () => {
      console.log(
        `[Property Price Cron] Ejecutando actualización de precios programados - ${new Date().toISOString()}`
      );

      try {
        const result = await PropertyPrice.applyScheduledPrices();
        console.log(
          `[Property Price Cron] ${
            result.message
          } - ${new Date().toISOString()}`
        );
      } catch (error) {
        console.error(
          `[Property Price Cron] Error al aplicar precios programados:`,
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
    "[Property Price Cron] Cron job de actualización de precios iniciado (cada minuto - America/Mexico_City)"
  );
};

module.exports = { schedulePropertyPriceCron };
