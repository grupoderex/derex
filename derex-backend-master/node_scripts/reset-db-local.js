const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

function validateDatabaseName(name) {
  if (!name || !/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error(
      "DB_NAME inválido. Usa solo letras, números y guion bajo."
    );
  }
}

function getMigrationFiles(migrationsRoot) {
  const migrationFiles = [];

  function walk(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name === "migration.sql") {
        migrationFiles.push(fullPath);
      }
    }
  }

  walk(migrationsRoot);
  return migrationFiles.sort((a, b) => a.localeCompare(b));
}

async function run() {
  const dbHost = process.env.DB_HOST || "127.0.0.1";
  const dbPort = Number(process.env.DB_PORT || 3306);
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD || "";
  const dbName = process.env.DB_NAME;

  if (!dbUser) {
    throw new Error("DB_USER no está definido en .env");
  }

  validateDatabaseName(dbName);

  const migrationsRoot = path.resolve(__dirname, "..", "database", "migrations");
  const migrationFiles = getMigrationFiles(migrationsRoot);

  if (migrationFiles.length === 0) {
    throw new Error("No se encontraron archivos migration.sql");
  }

  const adminConnection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    multipleStatements: true,
  });

  try {
    console.log(`Recreando base de datos: ${dbName}`);
    await adminConnection.query(`DROP DATABASE IF EXISTS \`${dbName}\`;`);
    await adminConnection.query(
      `CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
  } finally {
    await adminConnection.end();
  }

  const dbConnection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    multipleStatements: true,
  });

  try {
    await dbConnection.query("SET SESSION sql_mode='NO_ENGINE_SUBSTITUTION';");

    for (const migrationFile of migrationFiles) {
      const relative = path.relative(path.resolve(__dirname, ".."), migrationFile);
      console.log(`Aplicando: ${relative}`);
      const sql = fs.readFileSync(migrationFile, "utf8");
      await dbConnection.query(sql);
    }

    console.log("Reset local completado correctamente.");
  } finally {
    await dbConnection.end();
  }
}

run().catch((error) => {
  console.error("Falló reset-db-local:", error.message);
  process.exit(1);
});
