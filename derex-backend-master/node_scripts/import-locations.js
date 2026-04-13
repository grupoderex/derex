const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const defaultInputPath = path.resolve(
  __dirname,
  "..",
  "..",
  "javer-frontend-main",
  "locations.js"
);

const normalizeText = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const trimmed = String(value).trim();
  if (!trimmed || trimmed.toLowerCase() === "null" || trimmed === "undefined") {
    return fallback;
  }

  return trimmed;
};

const normalizeJsonField = (value, fallback) => {
  if (value === null || value === undefined) {
    return JSON.stringify(fallback);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  const text = String(value).trim();
  if (!text || text.toLowerCase() === "null" || text === "undefined") {
    return JSON.stringify(fallback);
  }

  try {
    const parsed = JSON.parse(text);
    if (parsed === null) {
      return JSON.stringify(fallback);
    }
    return JSON.stringify(parsed);
  } catch {
    return JSON.stringify(fallback);
  }
};

const toTinyInt = (value, fallback = 0) => {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  if (typeof value === "number") {
    return value ? 1 : 0;
  }
  const text = String(value).trim().toLowerCase();
  if (text === "1" || text === "true") {
    return 1;
  }
  if (text === "0" || text === "false") {
    return 0;
  }
  return fallback;
};

const parseLocationsFile = async (inputPath) => {
  const raw = await fs.readFile(inputPath, "utf8");
  const normalized = raw
    .trim()
    .replace(/^module\.exports\s*=\s*/, "")
    .replace(/;\s*$/, "");

  const parsed = JSON.parse(normalized);
  if (!Array.isArray(parsed)) {
    throw new Error("El archivo de ubicaciones no contiene un arreglo JSON.");
  }
  return parsed;
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

  const locations = await parseLocationsFile(inputPath);
  console.log(`Leyendo ubicaciones desde: ${inputPath}`);

  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    multipleStatements: false,
  });

  const stats = {
    statesInserted: 0,
    statesUpdated: 0,
    citiesInserted: 0,
    citiesUpdated: 0,
    projectsInserted: 0,
    projectsUpdated: 0,
  };

  try {
    await connection.beginTransaction();

    for (const stateItem of locations) {
      const stateName = normalizeText(stateItem?.name);
      if (!stateName) {
        continue;
      }

      const [existingStateRows] = await connection.query(
        "SELECT id FROM state WHERE name = ? LIMIT 1",
        [stateName]
      );

      let stateId;
      if (existingStateRows.length) {
        stateId = existingStateRows[0].id;
        await connection.query(
          "UPDATE state SET active = ?, banner_url = ?, update_at = NOW() WHERE id = ?",
          [toTinyInt(stateItem?.active, 1), stateItem?.banner_url || null, stateId]
        );
        stats.statesUpdated += 1;
      } else {
        const [insertStateResult] = await connection.query(
          "INSERT INTO state (name, active, update_at, banner_url) VALUES (?, ?, NOW(), ?)",
          [stateName, toTinyInt(stateItem?.active, 1), stateItem?.banner_url || null]
        );
        stateId = insertStateResult.insertId;
        stats.statesInserted += 1;
      }

      const cities = Array.isArray(stateItem?.ciudades) ? stateItem.ciudades : [];

      for (const cityItem of cities) {
        const cityName = normalizeText(cityItem?.name);
        if (!cityName) {
          continue;
        }

        const [existingCityRows] = await connection.query(
          "SELECT id FROM city WHERE id_state = ? AND name = ? LIMIT 1",
          [stateId, cityName]
        );

        let cityId;
        if (existingCityRows.length) {
          cityId = existingCityRows[0].id;
          await connection.query(
            "UPDATE city SET active = ?, update_at = NOW() WHERE id = ?",
            [toTinyInt(cityItem?.active, 1), cityId]
          );
          stats.citiesUpdated += 1;
        } else {
          const [insertCityResult] = await connection.query(
            "INSERT INTO city (name, id_state, active, update_at) VALUES (?, ?, ?, NOW())",
            [cityName, stateId, toTinyInt(cityItem?.active, 1)]
          );
          cityId = insertCityResult.insertId;
          stats.citiesInserted += 1;
        }

        const projects = Array.isArray(cityItem?.proyectos)
          ? cityItem.proyectos
          : [];

        for (const project of projects) {
          const projectName = normalizeText(project?.name);
          if (!projectName) {
            continue;
          }

          const shortName = normalizeText(project?.short_name, projectName.toUpperCase());
          const description = normalizeText(project?.description, "Sin descripción");
          const featured = normalizeText(project?.featured, description);
          const logoColor = normalizeText(
            project?.logo_color,
            "https://www.javer.com.mx/images/logo-white.png"
          );
          const videoUrl = normalizeText(project?.video_url, "");
          const typeProject = normalizeText(project?.type_project, "residences");
          const validTypeProject = ["residences", "land", "building"].includes(typeProject)
            ? typeProject
            : "residences";
          const typeOrientation = normalizeText(project?.type_orientation, "horizontal");
          const validTypeOrientation = ["horizontal", "vertical", "mixed"].includes(typeOrientation)
            ? typeOrientation
            : "horizontal";

          const payload = [
            cityId,
            normalizeJsonField(project?.vertical_data, null),
            validTypeProject,
            validTypeOrientation,
            projectName,
            shortName,
            description,
            normalizeText(project?.description_eng, description),
            normalizeText(project?.long_description, description),
            normalizeText(project?.long_description_eng, normalizeText(project?.description_eng, description)),
            logoColor,
            normalizeText(project?.logo_color_alt_text, null),
            normalizeText(project?.logo_grey, null),
            videoUrl,
            normalizeText(project?.email_contact, null),
            normalizeText(project?.phone_contact, null),
            featured,
            toTinyInt(project?.active, 1),
            toTinyInt(project?.visible, 1),
            normalizeText(project?.latitud, null),
            normalizeText(project?.longitud, null),
            normalizeText(project?.link_map, null),
            normalizeText(project?.ciudad, cityName),
            normalizeText(project?.colonia, null),
            normalizeText(project?.calle, null),
            normalizeText(project?.numero_ext, null),
            normalizeText(project?.numero_int, null),
            normalizeText(project?.cp, null),
            normalizeJsonField(project?.interest_area, null),
            normalizeJsonField(project?.equipment, null),
            normalizeText(project?.live_the_experience_description, null),
            normalizeText(project?.live_the_experience_description_en, null),
            normalizeText(project?.live_the_experience_url, null),
            normalizeText(project?.wase_link_map, null),
            normalizeJsonField(project?.additional_info, {}),
            toTinyInt(project?.outstanding, 0),
            normalizeText(project?.banner_url, null),
            normalizeJsonField(project?.contact_form, null),
            normalizeText(project?.thumbnail, null),
            normalizeText(project?.thumbnail_alt_text, null),
            project?.is_presale === null || project?.is_presale === undefined
              ? null
              : toTinyInt(project?.is_presale, 0),
            normalizeText(project?.document_url, null),
            normalizeText(project?.url_salesforce, null),
          ];

          const [existingProjectRows] = await connection.query(
            "SELECT id FROM project WHERE id_city = ? AND name = ? LIMIT 1",
            [cityId, projectName]
          );

          if (existingProjectRows.length) {
            await connection.query(
              `UPDATE project SET
                id_city = ?, vertical_data = ?, type_project = ?, type_orientation = ?,
                name = ?, short_name = ?, description = ?, description_eng = ?,
                long_description = ?, long_description_eng = ?, logo_color = ?, logo_color_alt_text = ?,
                logo_grey = ?, video_url = ?, email_contact = ?, phone_contact = ?, featured = ?,
                active = ?, visible = ?, update_at = NOW(), latitud = ?, longitud = ?, link_map = ?,
                ciudad = ?, colonia = ?, calle = ?, numero_ext = ?, numero_int = ?, cp = ?,
                interest_area = ?, equipment = ?, live_the_experience_description = ?,
                live_the_experience_description_en = ?, live_the_experience_url = ?, wase_link_map = ?,
                additional_info = ?, outstanding = ?, banner_url = ?, contact_form = ?,
                thumbnail = ?, thumbnail_alt_text = ?, is_presale = ?, document_url = ?, url_salesforce = ?
               WHERE id = ?`,
              [...payload, existingProjectRows[0].id]
            );
            stats.projectsUpdated += 1;
          } else {
            await connection.query(
              `INSERT INTO project (
                id_city, vertical_data, type_project, type_orientation, name, short_name,
                description, description_eng, long_description, long_description_eng,
                logo_color, logo_color_alt_text, logo_grey, video_url, email_contact,
                phone_contact, featured, active, visible, update_at, latitud, longitud,
                link_map, ciudad, colonia, calle, numero_ext, numero_int, cp, interest_area,
                equipment, live_the_experience_description, live_the_experience_description_en,
                live_the_experience_url, wase_link_map, additional_info, outstanding,
                banner_url, contact_form, thumbnail, thumbnail_alt_text, is_presale,
                document_url, url_salesforce
               ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
               )`,
              payload
            );
            stats.projectsInserted += 1;
          }
        }
      }
    }

    await connection.commit();

    console.log("Importación completada ✅");
    console.table(stats);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error("Error al importar ubicaciones:", error.message);
  process.exit(1);
});
