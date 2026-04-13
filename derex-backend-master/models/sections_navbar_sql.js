const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const SectionsNavbar = {
  getAll: () => knex.select("*").from("sections_navbar"),
  updateActive: (id, newActive) =>
    knex("sections_navbar").where("id", id).update({ active: newActive }),
};

module.exports = SectionsNavbar;
