const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const defaultInputPath = path.resolve(
  __dirname,
  "..",
  "..",
  "javer-frontend-main",
  "ciudades.js"
);

const sourceStateMap = {
  1: { name: "Nuevo León", active: 1 },
  2: { name: "Aguascalientes", active: 1 },
  3: { name: "Jalisco", active: 1 },
  4: { name: "Estado De México", active: 1 },
  5: { name: "Puebla", active: 1 },
  6: { name: "Querétaro", active: 1 },
  7: { name: "Quintana Roo", active: 1 },
  8: { name: "Tamaulipas", active: 1 },
  9: { name: "Ciudad de México", active: 0 },
  10: { name: "Sin Estado", active: 0 },
};

const normalize = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }
  const text = String(value).trim();
  return text || fallback;
};

const parseArrayFile = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  const normalized = raw
    .trim()
    .replace(/^module\.exports\s*=\s*/, "")
    .replace(/;\s*$/, "");

  const parsed = JSON.parse(normalized);
  if (!Array.isArray(parsed)) {
    throw new Error("El archivo de ciudades no contiene un arreglo JSON.");
  }
  return parsed;
};

const flattenCitiesInput = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const first = items[0] || {};

  if (Array.isArray(first.ciudades)) {
    const flat = [];
    for (const stateItem of items) {
      const sourceStateId = Number(stateItem?.id);
      const nestedCities = Array.isArray(stateItem?.ciudades)
        ? stateItem.ciudades
        : [];

      for (const city of nestedCities) {
        flat.push({
          ...city,
          id_state:
            city?.id_state !== undefined && city?.id_state !== null
              ? city.id_state
              : sourceStateId,
        });
      }
    }
    return flat;
  }

  return items;
};

async function run() {
  const inputArg = process.argv[2];
  const inputPath = inputArg ? path.resolve(inputArg) : defaultInputPath;

  const dbHost = process.env.DB_HOST || "127.0.0.1";
  const dbPort = Number(process.env.DB_PORT || 3306);
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD || "";
  const dbName = process.env.DB_NAME;

  if (!dbUser || !dbName) {
    throw new Error("Faltan DB_USER o DB_NAME en .env");
  }

  const parsedItems = await parseArrayFile(inputPath);
  const cities = flattenCitiesInput(parsedItems);
  console.log(`Leyendo ciudades desde: ${inputPath}`);

  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  });

  const stats = {
    statesInserted: 0,
    statesUpdated: 0,
    citiesInserted: 0,
    citiesUpdated: 0,
    skippedUnknownState: 0,
  };

  try {
    await connection.beginTransaction();

    for (const cityItem of cities) {
      const cityName = normalize(cityItem?.name);
      if (!cityName) {
        continue;
      }

      const sourceState = sourceStateMap[Number(cityItem?.id_state)];
      if (!sourceState) {
        stats.skippedUnknownState += 1;
        continue;
      }

      const [existingStateRows] = await connection.query(
        "SELECT id, active FROM state WHERE name = ? LIMIT 1",
        [sourceState.name]
      );

      let stateId;
      if (existingStateRows.length) {
        stateId = existingStateRows[0].id;
        await connection.query(
          "UPDATE state SET active = ?, update_at = NOW() WHERE id = ?",
          [sourceState.active, stateId]
        );
        stats.statesUpdated += 1;
      } else {
        const [insertStateResult] = await connection.query(
          "INSERT INTO state (name, active, update_at, banner_url) VALUES (?, ?, NOW(), NULL)",
          [sourceState.name, sourceState.active]
        );
        stateId = insertStateResult.insertId;
        stats.statesInserted += 1;
      }

      const [existingCityRows] = await connection.query(
        "SELECT id FROM city WHERE id_state = ? AND name = ? LIMIT 1",
        [stateId, cityName]
      );

      if (existingCityRows.length) {
        await connection.query(
          "UPDATE city SET active = ?, update_at = NOW() WHERE id = ?",
          [Number(cityItem?.active) ? 1 : 0, existingCityRows[0].id]
        );
        stats.citiesUpdated += 1;
      } else {
        await connection.query(
          "INSERT INTO city (name, id_state, active, update_at) VALUES (?, ?, ?, NOW())",
          [cityName, stateId, Number(cityItem?.active) ? 1 : 0]
        );
        stats.citiesInserted += 1;
      }
    }

    await connection.commit();

    const [[{ totalStates }]] = await connection.query(
      "SELECT COUNT(*) totalStates FROM state"
    );
    const [[{ totalCities }]] = await connection.query(
      "SELECT COUNT(*) totalCities FROM city"
    );

    console.log("Importación de ciudades completada ✅");
    console.table({ ...stats, totalStates, totalCities });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error("Error al importar ciudades:", error.message);
  process.exit(1);
});
