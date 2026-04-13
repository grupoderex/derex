const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {FrequentQuestionsSql.FrequentQuestionsService}
 */
const FrequentQuestions = {
  create: async (data) => {
    return knex("frequent_questions").insert(data);
  },

  update: async (id, data) => {
    return knex("frequent_questions").where({ id }).update(data);
  },

  getById: async (id) => {
    return knex.select("*").from("frequent_questions").where({ id }).first();
  },

  getAll: async () => {
    return knex("frequent_questions").select("*").orderBy("id", "asc");
  },

  delete: async (id) => {
    return knex("frequent_questions").where({ id }).del();
  },
};

module.exports = FrequentQuestions;
