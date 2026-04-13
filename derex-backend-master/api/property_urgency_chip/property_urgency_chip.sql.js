const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @type {PropertyUrgencyChipSql.PropertyUrgencyChipService}
 */
const PropertyUrgencyChip = {
  create: async (input) => {
    try {
      // Verificar si ya existe un chip de urgencia para este proyecto
      const existingChip = await knex("property_urgency_chip")
        .where("property_id", input.property_id)
        .first();

      if (existingChip) {
        throw new Error("Este proyecto ya tiene un chip de urgencia asociado.");
      }

      const [id] = await knex("property_urgency_chip").insert(input);
      return id;
    } catch (error) {
      console.error("Error al crear un chip de urgencia:", error);
      throw error;
    }
  },

  update: async (chipId, input) => {
    try {
      // Si se está actualizando property_id, verificar que sea único
      if (input.property_id) {
        const existingChip = await knex("property_urgency_chip")
          .where("property_id", input.property_id)
          .whereNot("id", chipId)
          .first();

        if (existingChip) {
          throw new Error(
            "Este proyecto ya tiene un chip de urgencia asociado."
          );
        }
      }

      return await knex("property_urgency_chip")
        .where("id", chipId)
        .update(input);
    } catch (error) {
      console.error("Error al actualizar un chip de urgencia por ID:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await knex("property_urgency_chip")
        .select("property_urgency_chip.*", "property.name as property_name")
        .leftJoin(
          "property",
          "property_urgency_chip.property_id",
          "property.id"
        )
        .orderBy("property_urgency_chip.id", "desc");
    } catch (error) {
      console.error("Error al obtener todos los chips de urgencia:", error);
      throw error;
    }
  },

  getById: async (chipId) => {
    try {
      return await knex("property_urgency_chip")
        .select("property_urgency_chip.*", "property.name as property_name")
        .leftJoin(
          "property",
          "property_urgency_chip.property_id",
          "property.id"
        )
        .where("property_urgency_chip.id", chipId)
        .first();
    } catch (error) {
      console.error("Error al obtener un chip de urgencia por ID:", error);
      throw error;
    }
  },

  getByPropertyId: async (propertyId) => {
    try {
      return await knex("property_urgency_chip")
        .select("property_urgency_chip.*", "property.name as property_name")
        .leftJoin(
          "property",
          "property_urgency_chip.property_id",
          "property.id"
        )
        .where("property_urgency_chip.property_id", propertyId)
        .first();
    } catch (error) {
      console.error(
        "Error al obtener un chip de urgencia por ID de proyecto:",
        error
      );
      throw error;
    }
  },

  delete: async (chipId) => {
    try {
      return await knex("property_urgency_chip").where("id", chipId).del();
    } catch (error) {
      console.error("Error al eliminar un chip de urgencia por ID:", error);
      throw error;
    }
  },

  toggleActive: async (chipId, isActive) => {
    try {
      return await knex("property_urgency_chip")
        .where("id", chipId)
        .update({ is_active: isActive });
    } catch (error) {
      console.error(
        "Error al actualizar el estado del chip de urgencia:",
        error
      );
      throw error;
    }
  },
};

module.exports = PropertyUrgencyChip;
