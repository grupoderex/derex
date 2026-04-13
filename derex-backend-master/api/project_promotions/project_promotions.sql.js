const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @type {ProjectPromotionsSql.ProjectPromotionsService}
 */
const ProjectPromotions = {
  create: async (input) => {
    try {
      // Verificar si ya existe una promoción para este proyecto
      const existingPromotion = await knex("project_promotions")
        .where("project_id", input.project_id)
        .first();

      if (existingPromotion) {
        throw new Error("Este proyecto ya tiene una promoción asociada.");
      }

      const [id] = await knex("project_promotions").insert(input);
      return id;
    } catch (error) {
      console.error("Error al crear una promoción:", error);
      throw error;
    }
  },

  update: async (promotionId, input) => {
    try {
      // Si se está actualizando project_id, verificar que sea único
      if (input.project_id) {
        const existingPromotion = await knex("project_promotions")
          .where("project_id", input.project_id)
          .whereNot("id", promotionId)
          .first();

        if (existingPromotion) {
          throw new Error("Este proyecto ya tiene una promoción asociada.");
        }
      }

      return await knex("project_promotions")
        .where("id", promotionId)
        .update(input);
    } catch (error) {
      console.error("Error al actualizar una promoción por ID:", error);
      throw error;
    }
  },

  getById: async (promotionId) => {
    try {
      return await knex("project_promotions")
        .select("project_promotions.*", "project.name as project_name")
        .leftJoin("project", "project_promotions.project_id", "project.id")
        .where("project_promotions.id", promotionId)
        .first();
    } catch (error) {
      console.error("Error al obtener una promoción por ID:", error);
      throw error;
    }
  },

  getByProjectId: async (projectId) => {
    try {
      return await knex("project_promotions")
        .select("project_promotions.*", "project.name as project_name")
        .leftJoin("project", "project_promotions.project_id", "project.id")
        .where("project_promotions.project_id", projectId)
        .first();
    } catch (error) {
      console.error(
        "Error al obtener una promoción por ID de proyecto:",
        error
      );
      throw error;
    }
  },

  delete: async (promotionId) => {
    try {
      return await knex("project_promotions").where("id", promotionId).del();
    } catch (error) {
      console.error("Error al eliminar una promoción por ID:", error);
      throw error;
    }
  },

  toggleActive: async (promotionId, isActive) => {
    try {
      return await knex("project_promotions")
        .where("id", promotionId)
        .update({ is_active: isActive });
    } catch (error) {
      console.error("Error al actualizar el estado de la promoción:", error);
      throw error;
    }
  },
};

module.exports = ProjectPromotions;
