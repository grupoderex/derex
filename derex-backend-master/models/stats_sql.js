const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const Stats = {
  getTotalHouses: async () => {
    try {
      const result = await knex("property").count("id as totalHouses").first();
      return result.totalHouses || 0;
    } catch (error) {
      console.error("Error al obtener el total de casas:", error);
      throw error;
    }
  },

  getTotalProjects: async () => {
    try {
      const result = await knex("project").count("id as totalProjects").first();
      return result.totalProjects || 0;
    } catch (error) {
      console.error("Error al obtener el total de desarrollos:", error);
      throw error;
    }
  },

  getTotalUsers: async () => {
    try {
      const result = await knex("user").count("id as totalUsers").first();
      return result.totalUsers || 0;
    } catch (error) {
      console.error(
        "Error al obtener el total de usuarios registrados:",
        error
      );
      throw error;
    }
  },

  getTotalLotForms: async () => {
    try {
      const result = await knex("lotes_form")
        .count("id as totalLotForms")
        .first();
      return result.totalLotForms || 0;
    } catch (error) {
      console.error(
        "Error al obtener el total de formularios enviados en Lotes:",
        error
      );
      throw error;
    }
  },

  getTotalReserveForms: async () => {
    try {
      const result = await knex("reservas_form")
        .count("id as totalReserveForms")
        .first();
      return result.totalReserveForms || 0;
    } catch (error) {
      console.error(
        "Error al obtener el total de formularios enviados en Reservas:",
        error
      );
      throw error;
    }
  },

  getPopularHousesWithDetails: async () => {
    try {
      const result = await knex("user_favorites_property")
        .select("id_property")
        .count("* as likes")
        .groupBy("id_property")
        .orderBy("likes", "desc");

      const popularHousesDetails = await Promise.all(
        result.map(async ({ id_property, likes }) => {
          // Obtener detalles de la propiedad
          const propertyDetails = await knex("property")
            .select("id", "name", "main_image", "id_project")
            .where("id", id_property)
            .first();

          if (!propertyDetails) {
            throw new Error(
              `No se encontraron detalles para la propiedad con ID ${id_property}`
            );
          }

          // Obtener detalles del proyecto
          const projectDetails = await knex("project")
            .select("name")
            .where("id", propertyDetails.id_project)
            .first();

          if (!projectDetails) {
            throw new Error(
              `No se encontraron detalles para el proyecto con ID ${propertyDetails.id_project}`
            );
          }

          return {
            id: propertyDetails.id,
            name: propertyDetails.name,
            main_image: propertyDetails.main_image,
            project_name: projectDetails.name,
            likes,
          };
        })
      );

      return popularHousesDetails;
    } catch (error) {
      console.error(
        "Error al obtener la lista de casas populares con detalles:",
        error
      );
      throw error;
    }
  },
};

module.exports = Stats;
