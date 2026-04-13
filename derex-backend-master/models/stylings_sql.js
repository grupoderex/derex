const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const Stylings = {
  // Obtener todos los stylings
  getAll: () => knex.select("*").from("stylings"),

  // Obtener un styling por key
  getByKey: (key) =>
    knex.select("*").from("stylings").where("key", key).first(),

  // Crear un nuevo styling
  create: async (nuevoStyling) => {
    try {
      const [idNuevoStyling] = await knex("stylings").insert(
        nuevoStyling,
        "id"
      );
      return idNuevoStyling;
    } catch (error) {
      console.error("Error en la creación de nuevo styling:", error);
      throw error;
    }
  },

  // Actualizar el value de acuerdo al key
  updateBykey: (key, datosActualizados) =>
    knex("stylings").where("key", key).update(datosActualizados),
};

module.exports = Stylings;
