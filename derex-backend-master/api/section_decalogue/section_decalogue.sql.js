const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {SectionsFooterSql.SectionsFooterService}
 */
const FooterSql = {
  create: async (data) => {
    return knex("section_decalogue").insert(data);
  },

  update: async (id, data) => {
    return knex("section_decalogue").where({ id }).update(data);
  },

  getById: async (id) => {
    return knex.select("*").from("section_decalogue").where({ id }).first();
  },

  getAll: async (type) => {
    if (!type) {
      return knex("section_decalogue").select(
        "id",
        "name_es",
        "name_en",
        "type"
      );
    }
    return knex("section_decalogue")
      .select("id", "name_es", "name_en", "type")
      .where({ type });
  },

  delete: async (id) => {
    return knex("section_decalogue").where({ id }).del();
  },
};

module.exports = FooterSql;
