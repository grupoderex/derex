const knexSingleton = require("../../lib/knex/knex.singleton");
const { upsert } = require("./meta.schema");
const knex = knexSingleton.getKnexSingleton();

const Meta = {
  create: async (data) => {
    return knex("meta").insert({
      name: data.name,
      value: data.value,
      value_en: data.value_en,
      section: data.section,
      outline: data.outline,
      color: data.color,
      bold: data.bold,
    });
  },

  upsert: async (data) => {
    return knex("meta")
      .insert({
        name: data.name,
        value: data.value,
        value_en: data.value_en,
        section: data.section,
        outline: data.outline,
        color: data.color,
        bold: data.bold,
      })
      .onConflict(["name", "section"])
      .merge();
  },

  upsertMany: async (data) => {
    return knex("meta").insert(data).onConflict(["name", "section"]).merge();
  },

  update: async (id, data) => {
    return knex("meta").where({ id }).update({
      name: data.name,
      value: data.value,
      value_en: data.value_en,
      section: data.section,
      outline: data.outline,
      color: data.color,
      bold: data.bold,
    });
  },

  getById: async (id) => {
    return knex("meta").where({ id }).first();
  },

  getByName: async (name) => {
    return knex("meta").where({ name }).first();
  },

  getAll: async () => {
    return knex("meta").select();
  },

  getBySection: async (section) => {
    return knex("meta").where({ section });
  },

  deleteMany: async (ids) => {
    return knex("meta").whereIn("id", ids).del();
  },
};

module.exports = Meta;
