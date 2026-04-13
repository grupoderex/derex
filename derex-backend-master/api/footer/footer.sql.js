const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {SectionsFooterSql.SectionsFooterService}
 */
const FooterSql = {
  create: async (data) => {
    return knex("sections_footer").insert(data);
  },

  update: async (id, data) => {
    return knex("sections_footer").where({ id }).update(data);
  },

  getById: async (id) => {
    return knex.select("*").from("sections_footer").where({ id }).first();
  },

  getAll: async () => {
    return knex("sections_footer").select("*");
  },

  getAllActives: async () => {
    return knex.select("*").from("sections_footer").where({ active: true });
  },

  delete: async (id) => {
    return knex("sections_footer").where({ id }).del();
  },
};

module.exports = FooterSql;
