const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

// Modelo para la tabla city
const City = {
  // Obtener todas las ciudades
  getAll: () => knex.select("*").from("city"),

  /**
   * @param {number} cityId
   * @returns {Promise<Models.City[]>}
   */
  getById: (cityId) =>
    knex.select("*").from("city").where("id", cityId).first(),

  // Crear una nueva ciudad
  create: async (newCity) => {
    try {
      const [idNuevaCiudad] = await knex("city").insert({
        ...newCity,
        update_at: knex.fn.now(),
      });
      return idNuevaCiudad;
    } catch (error) {
      console.error("Error en la creación de nueva ciudad:", error);
      throw error;
    }
  },

  // Actualizar una ciudad existente
  update: (cityId, updatedData) =>
    knex("city").where("id", cityId).update(updatedData),

  // Eliminar una ciudad por ID
  delete: (cityId) => knex("city").where("id", cityId).del(),
};

module.exports = City;
