const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {CustomerExperienceSql.CustomerExperienceService}
 */
const CustomerExperience = {
  create: async (data) => {
    return knex("customer_experience").insert(data);
  },

  update: async (id, data) => {
    return knex("customer_experience").where({ id }).update(data);
  },

  getById: async (id) => {
    return knex
      .select(
        "customer_experience.description_es",
        "customer_experience.description_en",
        "customer_experience.url",
        "project.id as project_id",
        "project.name as project_name",
        "project.logo_color as project_logo"
      )
      .from("customer_experience")
      .join("project ", "project.id", "=", "customer_experience.project_id")
      .where({ "customer_experience.id": id })
      .first();
  },

  getAll: async () => {
    return knex("customer_experience")
      .select(
        "customer_experience.id",
        "customer_experience.description_es",
        "customer_experience.description_en",
        "customer_experience.url",
        "project.id as project_id",
        "project.name as project_name",
        "project.logo_color as project_logo"
      )
      .join("project ", "project.id", "=", "customer_experience.project_id")
      .orderBy("customer_experience.id", "asc");
  },

  delete: async (id) => {
    return knex("customer_experience").where({ id }).del();
  },
};

module.exports = CustomerExperience;
