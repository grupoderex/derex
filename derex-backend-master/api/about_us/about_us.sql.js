const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

/**
 * @typedef {AboutUsSql.AboutUsService}
 */
const AboutUs = {
  create: async (data) => {
    return knex("about_us").insert(data);
  },

  update: async (id, data) => {
    return knex("about_us").where({ id }).update(data);
  },

  upsertMany: async (data) => {
    return knex("about_us").insert(data).onConflict(["index_order"]).merge();
  },

  getById: async (id) => {
    return knex
      .select(
        "id",
        "index_order",
        "image_url",
        "image_alt_text",
        "is_image_left",
        "content_es",
        "content_en"
      )
      .from("about_us")
      .where({ id })
      .first();
  },

  getAll: async () => {
    return knex("about_us")
      .select(
        "id",
        "index_order",
        "image_url",
        "image_alt_text",
        "is_image_left",
        "content_es",
        "content_en"
      )
      .orderBy("index_order", "asc");
  },

  delete: async (id) => {
    return knex("about_us").where({ id }).del();
  },
};

module.exports = AboutUs;
