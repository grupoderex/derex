const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @type {PropertyPriceSql.PropertyPriceService}
 */
const PropertyPrice = {
  
  /**
   * Get property prices by state with grouped city/property structure
   * @param {number} stateId - The state ID to filter by
   * @returns {Promise<Array>} Array of cities with their properties
   */
  getPropertiesListByState: async (stateId) => {
    try {
      const results = await knex
        .select(
          "s.id as state_id",
          "s.name as state_name",
          "s.active as state_active",
          "s.created_at as state_created_at",
          "s.update_at as state_update_at",
          "s.banner_url as state_banner_url",
          "c.id as city_id",
          "c.name as city_name",
          "c.active as city_active",
          "c.created_at as city_created_at",
          "c.update_at as city_update_at",
          "p.id as project_id",
          "p.name as project_name",
          "p.short_name as project_short_name",
          "p.created_at as project_created_at",
          "p.update_at as project_update_at",
          "pr.id as property_id",
          "pr.name as property_name",
          "pr.short_name as property_short_name",
          "pr.price_base_mxn",
          "pr.price_m2_extra_mxn",
          "pr.created_at as property_created_at",
          "pr.update_at as property_update_at",

        )
        .from("state as s")
        .innerJoin("city as c", "s.id", "c.id_state")
        .innerJoin("project as p", "c.id", "p.id_city")
        .innerJoin("property as pr", "p.id", "pr.id_project")
        // Soft delete clients
        // .where("s.active", 1)
        // .andWhere("c.active", 1)
        // .andWhere("p.active", 1)
        // .andWhere("pr.active", 1)
        .andWhere("s.id", stateId)
        .orderByRaw("IF(s.id = 1, 0, 1)")
        .orderBy("s.name")
        .orderBy("c.name")
        .orderBy("p.name");

      // Group by project
      const projectMap = new Map();

      results.forEach((row) => {
        const projectKey = row.project_id;

        if (!projectMap.has(projectKey)) {
          projectMap.set(projectKey, {
            project_id: row.project_id,
            project: row.project_name,
            properties: [],
          });
        }
        projectMap.get(projectKey).properties.push({
          id: row.property_id,
          name: row.property_name,
        });
      });

      return Array.from(projectMap.values());
    } catch (error) {
      console.error(
        "Error al obtener lista de propiedades por estado:",
        error
      );
      throw error;
    }
  },

  /**
   * Get prices list for a property with scheduled updates
   * @param {number} propertyId - The property ID
   * @returns {Promise<Array>} Array of price list items with schedule info
   */
  getPricesListByPropertyId: async (propertyId) => {
    try {
      const results = await knex("prices_list_property as plp")
        .select(
          "plp.*",
          "pps.new_price_base",
          "pps.new_price_m2_ext",
          "pps.effective_datetime"
        )
        .leftJoin("property_price_schedule as pps", function () {
          this.on("plp.id", "=", "pps.prices_list_property_id").andOnNull(
            "pps.applied_at"
          );
        })
        .where("plp.id_property", propertyId);
      return results;
    } catch (error) {
      console.error("Error getting prices list by property:", error);
      throw error;
    }
  },

  /**
   * Upsert scheduled prices for multiple properties
   * @param {Array} prices - Array of price objects {property_id, new_price_base, new_price_m2, date}
   * @returns {Promise<Object>} Result of the operation
   */
  upsertScheduledPrices: async (prices) => {
    try {
      const insertData = prices.map((price) => {
        // La fecha viene en formato local YYYY-MM-DD HH:mm:ss del frontend
        // Se guarda directamente sin conversión (el cron usando timezone local la compara correctamente)
        const datetime = price.effective_datetime || null;

        return {
          prices_list_property_id: price.prices_list_property_id,
          new_price_base: price.new_price_base,
          new_price_m2_ext: price.new_price_m2_ext,
          effective_datetime: datetime,
        };
      });

      const result = await knex("property_price_schedule")
        .insert(insertData)
        .onConflict("prices_list_property_id")
        .merge({
          new_price_base: knex.raw("VALUES(new_price_base)"),
          new_price_m2_ext: knex.raw("VALUES(new_price_m2_ext)"),
          effective_datetime: knex.raw("VALUES(effective_datetime)"),
          applied_at: null,
        });

      return {
        success: true,
        affected: result,
      };
    } catch (error) {
      console.error("Error al programar precios de propiedades:", error);
      throw error;
    }
  },

  /**
   * Apply scheduled prices that have reached their effective date
   * @returns {Promise<Object>} Result with number of properties updated
   */
  applyScheduledPrices: async () => {
    const trx = await knex.transaction();

    try {
      // Get all scheduled prices that need to be applied now or before
      const scheduledPrices = await trx("property_price_schedule")
        .whereNull("applied_at")
        .where("effective_datetime", "<=", knex.fn.now())
        .select("*");

      if (scheduledPrices.length === 0) {
        await trx.commit();
        return {
          success: true,
          updated: 0,
          message: "No hay precios programados para aplicar",
        };
      }

      // Update property prices
      for (const schedule of scheduledPrices) {
        await trx("prices_list_property")
          .where("id", schedule.prices_list_property_id)
          .update({
            price_base: schedule.new_price_base,
            price_m2_ext: schedule.new_price_m2_ext,
          });

        // Mark as applied
        await trx("property_price_schedule").where("id", schedule.id).update({
          applied_at: knex.fn.now(),
        });
      }

      await trx.commit();

      return {
        success: true,
        updated: scheduledPrices.length,
        message: `${scheduledPrices.length} precio(s) actualizado(s)`,
      };
    } catch (error) {
      await trx.rollback();
      console.error("Error al aplicar precios programados:", error);
      throw error;
    }
  },

  /**
   * Get banner schedule for a project
   * @param {number} projectId - The project ID
   * @returns {Promise<Object>} Banner schedule details
   */
  getBannerSchedule: async (projectId) => {
    try {
      const result = await knex("project as p")
        .leftJoin("project_banner_schedule as pbs", "p.id", "pbs.project_id")
        .select(
          "p.banner_url as current_banner_url",
          "pbs.new_banner_url",
          "pbs.effective_datetime"
        )
        .where("p.id", projectId)
        .first();

      return result;
    } catch (error) {
      console.error("Error al obtener programación de banner:", error);
      throw error;
    }
  },

  /**
   * Upsert banner schedule for a project
   * @param {Object} data - { project_id, new_banner_url, effective_datetime }
   * @returns {Promise<Object>} Result of the operation
   */
  upsertBannerSchedule: async (data) => {
    try {
      const datetime = data.effective_datetime
        ? new Date(data.effective_datetime)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
        : null;

      const result = await knex("project_banner_schedule")
        .insert({
          project_id: data.project_id,
          new_banner_url: data.new_banner_url,
          effective_datetime: datetime,
        })
        .onConflict("project_id")
        .merge({
          new_banner_url: knex.raw("VALUES(new_banner_url)"),
          effective_datetime: knex.raw("VALUES(effective_datetime)"),
          applied_at: null,
        });

      return {
        success: true,
        affected: result,
      };
    } catch (error) {
      console.error("Error al programar banner:", error);
      throw error;
    }
  },

  /**
   * Apply scheduled banners that have reached their effective date
   * @returns {Promise<Object>} Result with number of projects updated
   */
  applyScheduledBanners: async () => {
    const trx = await knex.transaction();

    try {
      // Get all scheduled banners that need to be applied now or before
      const scheduledBanners = await trx("project_banner_schedule")
        .whereNull("applied_at")
        .where("effective_datetime", "<=", knex.fn.now())
        .select("*");

      if (scheduledBanners.length === 0) {
        await trx.commit();
        return {
          success: true,
          updated: 0,
          message: "No hay banners programados para aplicar",
        };
      }

      // Update project banners
      for (const schedule of scheduledBanners) {
        await trx("project").where("id", schedule.project_id).update({
          banner_url: schedule.new_banner_url,
          update_at: knex.fn.now(),
        });

        // Mark as applied
        await trx("project_banner_schedule").where("id", schedule.id).update({
          applied_at: knex.fn.now(),
        });
      }

      await trx.commit();

      return {
        success: true,
        updated: scheduledBanners.length,
        message: `${scheduledBanners.length} banner(s) actualizado(s)`,
      };
    } catch (error) {
      await trx.rollback();
      console.error("Error al aplicar banners programados:", error);
      throw error;
    }
  },
};

module.exports = PropertyPrice;
