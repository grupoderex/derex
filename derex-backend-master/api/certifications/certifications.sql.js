const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {CertificationSql.CertificationService}
 */
const Certification = {
  create: async (data) => {
    return knex("certifications").insert(data);
  },

  update: async (id, data) => {
    return knex("certifications").where({ id }).update(data);
  },

  getById: async (id) => {
    return knex.select("*").from("certifications").where({ id }).first();
  },

  getAll: async () => {
    return knex("certifications").select("*").orderBy("created_at", "desc");
  },

  delete: async (id) => {
    return knex("certifications").where({ id }).del();
  },
};

module.exports = Certification;
