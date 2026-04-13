const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @type {AmenitySql.AmenityService}
 */
const Amenities = {
  create: async (input) => {
    try {
      const [id] = await knex("amenity_property").insert(input);
      return id;
    } catch (error) {
      console.error("Error al crear una amenidad:", error);
      throw error;
    }
  },

  update: async (amenityId, input) => {
    try {
      return await knex("amenity_property")
        .where("id", amenityId)
        .update(input);
    } catch (error) {
      console.error("Error al actualizar una amenidad por ID:", error);
      throw error;
    }
  },

  getAllByProjectId: async (projectId) => {
    try {
      return await knex("amenity_property")
        .where("id_project", projectId)
        .orderByRaw(`CASE WHEN name IS NULL THEN 1 ELSE 0 END`)
        .orderBy("name", "asc");
    } catch (error) {
      console.error(
        "Error al obtener las amenidades por ID de un desarrollo (proyecto):",
        error
      );
      throw error;
    }
  },

  getAllByTypeFromProjectId: async (projectId, type) => {
    try {
      if (type === "text") {
        return await knex("amenity_property")
          .where("id_project", projectId)
          .whereNotNull("name")
          .orderBy("name", "asc");
      }
      if (type === "image") {
        return await knex("amenity_property")
          .where("id_project", projectId)
          .whereNull("name")
          .orderBy("order", "asc");
      }
    } catch (error) {
      console.error(
        "Error al obtener las amenidades por ID de un desarrollo (proyecto):",
        error
      );
      throw error;
    }
  },

  getById: async (amenityId) => {
    try {
      return await knex("amenity_property").where("id", amenityId).first();
    } catch (error) {
      console.error("Error al obtener una amenidad por ID:", error);
      throw error;
    }
  },

  delete: async (amenityId) => {
    try {
      return await knex("amenity_property").where("id", amenityId).del();
    } catch (error) {
      console.error("Error al eliminar una amenidad por ID:", error);
      throw error;
    }
  },

  validateOrder: async (order, projectId) => {
    try {
      return await knex("amenity_property")
        .where("order", order)
        .where("id_project", projectId)
        .first();
    } catch (error) {
      console.error("Error al validar el orden de una amenidad:", error);
      throw error;
    }
  },

  validateOrderExcludingItself: async (order, projectId, amenityId) => {
    try {
      return await knex("amenity_property")
        .where("order", order)
        .where("id_project", projectId)
        .where("id", "<>", amenityId)
        .first();
    } catch (error) {
      console.error("Error al validar el orden de una amenidad:", error);
      throw error;
    }
  },
};

module.exports = Amenities;
