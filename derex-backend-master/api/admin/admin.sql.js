const knexSingleton = require("./../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
const { hash } = require("bcryptjs");

/**
 * @type {AdminSql.AdminService}
 */
const Admin = {
  getAll: async () => {
    try {
      return await knex.select("*").from("admin");
    } catch (error) {
      console.error("Error al obtener todos los administradores:", error);
      throw error;
    }
  },

  getById: async (adminId) => {
    try {
      return await knex.select("*").from("admin").where("id", adminId).first();
    } catch (error) {
      console.error("Error al obtener administrador por ID:", error);
      throw error;
    }
  },

  create: async (newAdmin) => {
    try {
      newAdmin.hashed_password = await hash(newAdmin.hashed_password, 10);
      const [adminId] = await knex("admin").insert(newAdmin);
      return adminId;
    } catch (error) {
      console.error("Error al crear un nuevo administrador:", error.message);
      console.error("Stack trace:", error.stack);
      return {
        error: `Error al crear un nuevo administrador. Detalles: ${error.message}`,
        stack: error.stack,
      };
    }
  },

  update: async (adminId, updatedData) => {
    try {
      if (updatedData.hashed_password) {
        updatedData.hashed_password = await hash(
          updatedData.hashed_password,
          10
        );
      }
      await knex("admin").where("id", adminId).update(updatedData);
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      throw error;
    }
  },

  delete: async (adminId) => {
    try {
      await knex("admin").where("id", adminId).del();
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      throw error;
    }
  },

  search: async (filters) => {
    try {
      return await knex("admin").select("*").where(filters);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      throw error;
    }
  },
};

module.exports = Admin;
