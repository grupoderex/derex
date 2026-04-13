const knexSingleton = require("./../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const LotesForm = {
  create: async (formData) => {
    try {
      const [id] = await knex("lotes_form").insert(formData);
      return { success: true, id };
    } catch (error) {
      console.error(
        "Error al procesar el formulario de Lotes Comerciales:",
        error
      );
      return {
        success: false,
        error: "Error al procesar el formulario de Lotes Comerciales",
      };
    }
  },

  getById: async (loteId) => {
    try {
      return await knex("lotes_form").where("id", loteId).first();
    } catch (error) {
      console.error("Error al obtener el lote por ID:", error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await knex("lotes_form").select("*");
    } catch (error) {
      console.error("Error al obtener todos los lotes:", error);
      throw error;
    }
  },

  update: async (loteId, updatedData) => {
    try {
      await knex("lotes_form").where("id", loteId).update(updatedData);
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar el lote:", error);
      return { success: false, error: "Error al actualizar el lote" };
    }
  },

  delete: async (loteId) => {
    try {
      await knex("lotes_form").where("id", loteId).del();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar el lote:", error);
      return { success: false, error: "Error al eliminar el lote" };
    }
  },
};

module.exports = LotesForm;
