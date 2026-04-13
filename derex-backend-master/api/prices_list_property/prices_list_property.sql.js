const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @type {PricesListPropertySql.PricesListPropertyService}
 */
const PricesListProperty = {
  /**
   * Get all prices list properties
   * @returns {Promise<Array>} Array of all prices list properties
   */
  getAll: async () => {
    try {
      const results = await knex("prices_list_property").select("*");
      return results;
    } catch (error) {
      console.error("Error al obtener todas las listas de precio:", error);
      throw error;
    }
  },

  /**
   * Get a price list property by ID
   * @param {number} id - The price list property ID
   * @returns {Promise<Object|null>} Price list property object or null if not found
   */
  getById: async (id) => {
    try {
      const result = await knex("prices_list_property").where("id", id).first();
      return result || null;
    } catch (error) {
      console.error("Error al obtener lista de precio por ID:", error);
      throw error;
    }
  },

  /**
   * Get price list properties by property ID
   * @param {number} idProperty - The property ID
   * @returns {Promise<Array>} Array of price list properties for the given property
   */
  getByPropertyId: async (idProperty) => {
    try {
      const results = await knex("prices_list_property")
        .where("id_property", idProperty)
        .select("*");
      return results;
    } catch (error) {
      console.error("Error al obtener lista de precio por id_property:", error);
      throw error;
    }
  },

  /**
   * Create a new price list property
   * @param {Object} data - The price list property data
   * @returns {Promise<Array>} Array with the inserted ID
   */
  create: async (data) => {
    try {
      const result = await knex("prices_list_property").insert(data);
      return result;
    } catch (error) {
      console.error("Error al crear lista de precio:", error);
      throw error;
    }
  },

  /**
   * Update a price list property by ID
   * @param {number} id - The price list property ID
   * @param {Object} data - The updated data
   * @returns {Promise<number>} Number of affected rows
   */
  update: async (id, data) => {
    try {
      const result = await knex("prices_list_property")
        .where("id", id)
        .update(data);
      return result;
    } catch (error) {
      console.error("Error al actualizar lista de precio:", error);
      throw error;
    }
  },

  /**
   * Update price list properties by property ID
   * @param {number} idProperty - The property ID
   * @param {Object} data - The updated data
   * @returns {Promise<number>} Number of affected rows
   */
  updateByPropertyId: async (idProperty, data) => {
    try {
      const result = await knex("prices_list_property")
        .where("id_property", idProperty)
        .update(data);
      return result;
    } catch (error) {
      console.error(
        "Error al actualizar lista de precio por id_property:",
        error,
      );
      throw error;
    }
  },

  /**
   * Delete a price list property by ID
   * Deletes related records in property_price_schedule first to avoid foreign key constraint errors
   * @param {number} id - The price list property ID
   * @returns {Promise<Object>} Object with deletion details
   */
  delete: async (id) => {
    const trx = await knex.transaction();

    try {
      const schedulesDeleted = await trx("property_price_schedule")
        .where("prices_list_property_id", id)
        .del();
      const result = await trx("prices_list_property").where("id", id).del();

      await trx.commit();

      return {
        success: true,
        deleted: result,
        schedulesDeleted,
      };
    } catch (error) {
      await trx.rollback();
      console.error("Error al eliminar lista de precio:", error);
      throw error;
    }
  },
};

module.exports = PricesListProperty;
