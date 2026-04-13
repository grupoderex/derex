const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const LogActivities = {
  // Crear un registro de actividad
  create: async (newActivity) => {
    try {
      const [activityId] = await knex("log_activities").insert(
        newActivity,
        "id"
      );
      return activityId;
    } catch (error) {
      console.error("Error al crear un registro de actividad:", error);
      throw error;
    }
  },

  // Obtener todas las actividades (Desc)
  getAll: async () => {
    try {
      return await knex("log_activities").select("*").orderBy("id", "desc");
    } catch (error) {
      console.error("Error al obtener todas las actividades:", error);
      throw error;
    }
  },

  // Obtener actividades por id_admin (Desc)
  getByAdminId: async (adminId) => {
    try {
      return await knex("log_activities")
        .where("id_admin", adminId)
        .select("*")
        .orderBy("id", "desc");
    } catch (error) {
      console.error("Error al obtener actividades por id_admin:", error);
      throw error;
    }
  },

  // Obtener una actividad por ID
  getById: async (activityId) => {
    try {
      return await knex("log_activities")
        .where("id", activityId)
        .select("*")
        .first();
    } catch (error) {
      console.error("Error al obtener una actividad por ID:", error);
      throw error;
    }
  },

  // Actualizar una actividad
  update: async (activityId, updatedData) => {
    try {
      await knex("log_activities").where("id", activityId).update(updatedData);
    } catch (error) {
      console.error("Error al actualizar una actividad:", error);
      throw error;
    }
  },

  // Eliminar una actividad
  delete: async (activityId) => {
    try {
      await knex("log_activities").where("id", activityId).del();
    } catch (error) {
      console.error("Error al eliminar una actividad por ID:", error);
      throw error;
    }
  },
};

module.exports = LogActivities;
