const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {SocialSql.SocialService}
 */
const Social = {
  create: async (data) => {
    return knex("social").insert(data);
  },

  update: async (id, data) => {
    return knex("social").where({ id }).update(data);
  },

  getById: async (id) => {
    return knex.select("*").from("social").where({ id }).first();
  },

  getAll: async () => {
    return knex("social").select("*").orderBy("created_at", "asc");
  },

  delete: async (id) => {
    return knex("social").where({ id }).del();
  },
};

module.exports = Social;
