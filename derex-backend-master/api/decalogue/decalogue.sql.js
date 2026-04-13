const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {DecalogueSql.DecalogueService}
 */
const DecalogueSql = {
  create: async (data) => {
    return knex("decalogue").insert(data);
  },

  update: async (id, data) => {
    return knex("decalogue").where({ id }).update(data);
  },

  getById: async (id) => {
    return knex.select("*").from("decalogue").where({ id }).first();
  },

  getBySectionId: async (id) => {
    return knex
      .select("id", "title_es", "title_en", "file")
      .from("decalogue")
      .where({ section_id: id });
  },

  getAll: async () => {
    return knex("decalogue").select("*");
  },

  delete: async (id) => {
    return knex("decalogue").where({ id }).del();
  },
};

module.exports = DecalogueSql;
