const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const AvisosPrivacidad = {
  create: async (avisoData) => {
    try {
      const [id] = await knex("avisos_privacidad").insert(avisoData);
      return id;
    } catch (error) {
      console.error("Error al crear el aviso de privacidad:", error);
      throw error;
    }
  },

  update: async (avisoId, updatedData) => {
    try {
      await knex("avisos_privacidad").where("ID", avisoId).update(updatedData);
    } catch (error) {
      console.error("Error al actualizar el aviso de privacidad:", error);
      throw error;
    }
  },

  toggleActive: async (avisoId) => {
    try {
      const [aviso] = await knex("avisos_privacidad")
        .where("ID", avisoId)
        .select("active");
      if (aviso) {
        const updatedActive = !aviso.active;
        await knex("avisos_privacidad")
          .where("ID", avisoId)
          .update({ active: updatedActive });
      } else {
        throw new Error("Aviso de privacidad no encontrado.");
      }
    } catch (error) {
      console.error(
        "Error al activar/desactivar el aviso de privacidad:",
        error
      );
      throw error;
    }
  },

  getAll: async () => {
    try {
      return await knex("avisos_privacidad").select("*");
    } catch (error) {
      console.error("Error al obtener todos los avisos de privacidad:", error);
      throw error;
    }
  },

  getById: async (avisoId) => {
    try {
      return await knex("avisos_privacidad")
        .where("ID", avisoId)
        .select("*")
        .first();
    } catch (error) {
      console.error("Error al obtener aviso de privacidad por ID:", error);
      throw error;
    }
  },
};

module.exports = AvisosPrivacidad;
