const { schedulePropertyPriceCron } = require("./property_price_cron");
const { scheduleBannerCron } = require("./banner_cron");

/**
 * Initialize all cron jobs
 */
const initializeCronJobs = () => {
  if (String(process.env.DISABLE_CRON_JOBS || "").toLowerCase() === "true") {
    console.log("[Cron] Cron jobs deshabilitados por DISABLE_CRON_JOBS=true");
    return;
  }

  schedulePropertyPriceCron();
  scheduleBannerCron();
};

module.exports = { initializeCronJobs };
