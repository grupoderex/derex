const knexSingleton = require("./../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const ReservasForm = {
  create: async (formData) => {
    try {
      const [id] = await knex("reservas_form").insert(formData);
      return { success: true, id };
    } catch (error) {
      console.error(
        "Error al procesar el formulario de Reservas Territoriales:",
        error
      );
      return {
        success: false,
        error: "Error al procesar el formulario de Reservas Territoriales",
      };
    }
  },

  getById: async (reservaId) => {
    try {
      return await knex("reservas_form").where("id", reservaId).first();
    } catch (error) {
      console.error("Error al obtener la reserva por ID:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await knex("reservas_form").select("*");
    } catch (error) {
      console.error("Error al obtener todas las reservas:", error);
      throw error;
    }
  },

  update: async (reservaId, updatedData) => {
    try {
      await knex("reservas_form").where("id", reservaId).update(updatedData);
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar la reserva:", error);
      return { success: false, error: "Error al actualizar la reserva" };
    }
  },

  delete: async (reservaId) => {
    try {
      await knex("reservas_form").where("id", reservaId).del();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      return { success: false, error: "Error al eliminar la reserva" };
    }
  },
};

module.exports = ReservasForm;
