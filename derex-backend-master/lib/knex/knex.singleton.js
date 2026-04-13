const config = require("../../config");
/**
 * Singleton Knex instance.
 * @type {Knex}
 */
let instance = null;

/**
 * Get the singleton Knex instance.
 * @returns {Knex} The Knex instance.
 */
function getKnexSingleton() {
  if (!instance) {
    instance = require("knex")({
      client: "mysql2",
      connection: {
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        charset: "utf8mb4",
      },
      pool: {
        afterCreate: (connection, done) => {
          connection.query(
            "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            (error) => done(error, connection)
          );
        },
      },
    });
  }
  return instance;
}

module.exports = {
  getKnexSingleton,
};
