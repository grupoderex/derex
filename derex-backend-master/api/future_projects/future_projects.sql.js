const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @type {FutureProjectsSql.FutureProjectsService}
 */
const FutureProjects = {
  checkUniqueUrl: async (uniqueUrl, excludeProjectId = null) => {
    try {
      const query = knex("future_projects").where("unique_url", uniqueUrl);

      if (excludeProjectId) {
        query.whereNot("id", excludeProjectId);
      }

      const existingProject = await query.first();
      return !existingProject;
    } catch (error) {
      console.error("Error al verificar la unicidad de unique_url:", error);
      throw error;
    }
  },

  create: async (input) => {
    try {
      const isUnique = await FutureProjects.checkUniqueUrl(input.unique_url);

      if (!isUnique) {
        throw new Error("La URL única ya está en uso por otro proyecto.");
      }

      const [id] = await knex("future_projects").insert(input);
      return id;
    } catch (error) {
      console.error("Error al crear un proyecto futuro:", error);
      throw error;
    }
  },

  update: async (projectId, input) => {
    try {
      if (input.unique_url) {
        const isUnique = await FutureProjects.checkUniqueUrl(
          input.unique_url,
          projectId
        );

        if (!isUnique) {
          throw new Error("La URL única ya está en uso por otro proyecto.");
        }
      }

      return await knex("future_projects").where("id", projectId).update(input);
    } catch (error) {
      console.error("Error al actualizar un proyecto futuro por ID:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await knex("future_projects")
        .select(
          "future_projects.*",
          "state.id as state_id",
          "state.name as state_name",
          "city.id as city_id",
          "city.name as city_name",
          knex.raw(`IFNULL(
            JSON_ARRAYAGG(
              IF(future_amenity_property.id IS NOT NULL, JSON_OBJECT(
                'id', future_amenity_property.id,
                'id_future_project', future_amenity_property.id_future_project,
                'name_es', future_amenity_property.name_es,
                'name_en', future_amenity_property.name_en
              ), NULL)
            ), JSON_ARRAY()
          ) as amenities`)
        )
        .leftJoin("state", "future_projects.state_id", "state.id")
        .leftJoin("city", "future_projects.city_id", "city.id")
        .leftJoin(
          "future_amenity_property",
          "future_projects.id",
          "future_amenity_property.id_future_project"
        )
        .groupBy("future_projects.id", "state.id", "city.id")
        .orderBy("future_projects.created_at", "desc");
    } catch (error) {
      console.error("Error al obtener todos los proyectos futuros:", error);
      throw error;
    }
  },

  getAllByStateId: async (stateId) => {
    try {
      return await knex("future_projects")
        .select(
          "future_projects.*",
          "state.id as state_id",
          "state.name as state_name",
          "city.id as city_id",
          "city.name as city_name"
        )
        .leftJoin("state", "future_projects.state_id", "state.id")
        .leftJoin("city", "future_projects.city_id", "city.id")
        .where("future_projects.state_id", stateId)
        .orderBy("future_projects.name", "asc");
    } catch (error) {
      console.error(
        "Error al obtener los proyectos futuros por estado:",
        error
      );
      throw error;
    }
  },

  getAllByType: async (type) => {
    try {
      return await knex("future_projects")
        .select(
          "future_projects.*",
          "state.id as state_id",
          "state.name as state_name",
          "city.id as city_id",
          "city.name as city_name"
        )
        .leftJoin("state", "future_projects.state_id", "state.id")
        .leftJoin("city", "future_projects.city_id", "city.id")
        .where("future_projects.type", type)
        .orderBy("future_projects.name", "asc");
    } catch (error) {
      console.error("Error al obtener los proyectos futuros por tipo:", error);
      throw error;
    }
  },

  getById: async (projectId) => {
    try {
      return await knex("future_projects")
        .select(
          "future_projects.*",
          "state.id as state_id",
          "state.name as state_name",
          "city.id as city_id",
          "city.name as city_name"
        )
        .leftJoin("state", "future_projects.state_id", "state.id")
        .leftJoin("city", "future_projects.city_id", "city.id")
        .where("future_projects.id", projectId)
        .first();
    } catch (error) {
      console.error("Error al obtener un proyecto futuro por ID:", error);
      throw error;
    }
  },

  delete: async (projectId) => {
    try {
      return await knex("future_projects").where("id", projectId).del();
    } catch (error) {
      console.error("Error al eliminar un proyecto futuro por ID:", error);
      throw error;
    }
  },

  createAmenity: async (input) => {
    try {
      const [id] = await knex("future_amenity_property").insert(input);
      return id;
    } catch (error) {
      console.error("Error al crear una amenidad para proyecto futuro:", error);
      throw error;
    }
  },

  getAmenitiesByProjectId: async (projectId) => {
    try {
      return await knex("future_amenity_property")
        .where("id_future_project", projectId)
        .orderBy("name_es", "asc");
    } catch (error) {
      console.error(
        "Error al obtener las amenidades de un proyecto futuro:",
        error
      );
      throw error;
    }
  },

  getAmenityById: async (amenityId) => {
    try {
      return await knex("future_amenity_property")
        .where("id", amenityId)
        .first();
    } catch (error) {
      console.error("Error al obtener una amenidad por ID:", error);
      throw error;
    }
  },

  updateAmenity: async (amenityId, input) => {
    try {
      return await knex("future_amenity_property")
        .where("id", amenityId)
        .update(input);
    } catch (error) {
      console.error("Error al actualizar una amenidad por ID:", error);
      throw error;
    }
  },

  deleteAmenity: async (amenityId) => {
    try {
      return await knex("future_amenity_property").where("id", amenityId).del();
    } catch (error) {
      console.error("Error al eliminar una amenidad por ID:", error);
      throw error;
    }
  },
};

module.exports = FutureProjects;
