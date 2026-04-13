const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const parseJsonField = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null") return fallback;

  try {
    return JSON.parse(trimmed);
  } catch {
    return fallback;
  }
};

const Blueprints = {
  create: async (blueprintData) => {
    try {
      const [id] = await knex("project_property_blueprints").insert(
        blueprintData,
        "id"
      );
      return id;
    } catch (error) {
      console.error("Error al crear el plano del proyecto:", error);
      throw error;
    }
  },

  getAllByPropertyId: async (propertyId) => {
    try {
      const blueprints = await knex("project_property_blueprints")
        .where("id_property", propertyId)
        .select("*");
      //.orderBy("orden", "asc");  TODO: Descomentar cuando se implemente el orden

      for (const key in blueprints) {
        blueprints[key].characteristics_architectural_plans = parseJsonField(
          blueprints[key].characteristics_architectural_plans,
          []
        );
        blueprints[key].title = parseJsonField(blueprints[key].title, null);
      }

      return blueprints;
    } catch (error) {
      console.error("Error al obtener los planos por ID de propiedad:", error);
      throw error;
    }
  },

  update: async (blueprintId, updatedData) => {
    try {
      const { characteristics_architectural_plans, title } = updatedData;
      delete updatedData.title;
      delete updatedData.characteristics_architectural_plans;

      await knex("project_property_blueprints")
        .where("id", blueprintId)
        .update(updatedData)
        .update({ title: JSON.stringify(title) })
        .update({
          characteristics_architectural_plans: JSON.stringify(
            characteristics_architectural_plans
          ),
        });
    } catch (error) {
      console.error("Error al actualizar el plano del proyecto:", error);
      throw error;
    }
  },

  delete: async (blueprintId) => {
    try {
      await knex("project_property_blueprints").where("id", blueprintId).del();
    } catch (error) {
      console.error("Error al eliminar el plano del proyecto:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await knex("project_property_blueprints").select("*");
      //.orderBy("orden", "asc");  /* TODO: Descomentar cuando se implemente el orden
    } catch (error) {
      console.error("Error al obtener todos los planos del proyecto:", error);
      throw error;
    }
  },

  getById: async (blueprintId) => {
    try {
      return await knex("project_property_blueprints")
        .where("id", blueprintId)
        .first();
    } catch (error) {
      console.error("Error al obtener el plano del proyecto por ID:", error);
      throw error;
    }
  },

  validateOrder: async (propertyId, order, blueprintId) => {
    try {
      const existingBlueprint = await knex("project_property_blueprints")
        .where("id_property", propertyId)
        //.andWhere("orden", order) TODO: Descomentar cuando se implemente el orden
        .first();

      if (existingBlueprint && existingBlueprint.id !== parseInt(blueprintId)) {
        throw new Error("Ya existe un plano con ese orden en esta propiedad.");
      }

      return true;
    } catch (error) {
      console.error("Error al validar el orden del plano:", error);
      throw error;
    }
  },
};

module.exports = Blueprints;
