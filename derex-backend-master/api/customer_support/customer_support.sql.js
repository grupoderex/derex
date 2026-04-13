const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {CustomerSupportSql.CustomerSupportService}
 */
const CustomerSupport = {
  create: async (formData) => {
    return knex("customer_support").insert(formData);
  },
  getById: async (id) => {
    return knex("customer_support").where({ id }).first();
  },
  getAll: async () => {
    return knex("customer_support").select();
  },
};

module.exports = CustomerSupport;
