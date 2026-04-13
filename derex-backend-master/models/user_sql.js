const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
const bcrypt = require("bcryptjs");

const User = {
  getAll: async () => {
    try {
      return await knex.select("*").from("user");
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
  },

  getById: async (userId) => {
    try {
      return await knex.select("*").from("user").where("id", userId).first();
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
  },
  create: async (newUser) => {
    try {
      newUser.password = await bcrypt.hash(newUser.password, 10);
      const [userId] = await knex("user").insert(newUser);
      return userId;
    } catch (error) {
      console.error("Error al crear un nuevo usuario:", error.message);
      console.error("Stack trace:", error.stack);

      // Enviar una respuesta más descriptiva a Postman
      return {
        error: `Error al crear un nuevo usuario. Detalles: ${error.message}`,
        stack: error.stack,
      };
    }
  },

  update: async (userId, updatedData) => {
    try {
      if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
      }
      await knex("user").where("id", userId).update(updatedData);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  },

  delete: async (userId) => {
    try {
      await knex("user").where("id", userId).del();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  },

  search: async (filters) => {
    try {
      return await knex("user").select("*").where(filters);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw error;
    }
  },
};

module.exports = User;
