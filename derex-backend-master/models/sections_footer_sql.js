const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const SectionsFooter = {
  getAll: () => knex.select("*").from("sections_footer"),
  updateActive: (id, newActive) =>
    knex("sections_footer").where("id", id).update({ active: newActive }),
};

module.exports = SectionsFooter;
