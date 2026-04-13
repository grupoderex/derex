const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
require("dotenv").config();

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const normalizeProjectLogoUrl = (value) => {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return value;

  if (ABSOLUTE_URL_REGEX.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed}`;
  }

  const cdnUrl = process.env.AWS_CDN_URL?.trim();
  if (!cdnUrl) {
    return trimmed;
  }

  return `${cdnUrl}/images/desarrollos/${encodeURIComponent(trimmed)}`;
};

const LocationHierarchy = {
  // Obtener todos los estados con ciudades y proyectos (nuevo end)
  getAll: async () => {
    try {
      const estados = await knex("state").whereNot("id", 10).andWhere("active", 1).select("*");

      // Ordenar los estados según el requisito especificado
      estados.sort((a, b) => {
        if (a.id === 1) {
          return -1; // Nuevo León siempre primero
        } else if (b.id === 1) {
          return 1; // Otros estados después de Nuevo León
        }
        return a.name.localeCompare(b.name); // Ordenar alfabéticamente
      });

      // Filtrar estados que tienen ciudades con proyectos
      const estadosConCiudadesYProyectos = await Promise.all(
        estados.map(async (estado) => {
          const ciudades = await knex("city")
            .where("id_state", estado.id)
            .andWhere("active", 1)
            .select("*");

          if (ciudades.length > 0) {
            const ciudadesConProyectos = await Promise.all(
              ciudades.map(async (ciudad) => {
                // const proyectos = await knex("project")
                //   .where("id_city", ciudad.id)
                //   .andWhere("visible", 1)
                //   .select("*");

                const proyectos = await knex("project")
                  .select(
                    "project.*",
                    "project_promotions.is_active as promotion_active"
                  )
                  .leftJoin(
                    "project_promotions",
                    "project.id",
                    "project_promotions.project_id"
                  )
                  .where("id_city", ciudad.id)
                  .andWhere("visible", 1)
                  .andWhere("project.active", 1);

                const proyectosConLogoURL = proyectos.map((proyecto) => {
                  proyecto.logo_color = normalizeProjectLogoUrl(proyecto.logo_color);
                  return proyecto;
                });

                // Solo incluir la ciudad si tiene proyectos asociados
                if (proyectosConLogoURL.length > 0) {
                  return {
                    ...ciudad,
                    proyectos: proyectosConLogoURL,
                  };
                } else {
                  return null; // No incluir la ciudad si no tiene proyectos
                }
              })
            );

            // Filtrar ciudades nulas (que no se incluirán en el resultado final)
            const ciudadesFiltradas = ciudadesConProyectos.filter(
              (ciudad) => ciudad !== null
            );

            // Incluir estado solo si hay ciudades con proyectos
            if (ciudadesFiltradas.length > 0) {
              return {
                ...estado,
                ciudades: ciudadesFiltradas,
              };
            } else {
              return null; // No incluir el estado si no hay ciudades con proyectos
            }
          } else {
            return null; // No incluir el estado si no hay ciudades
          }
        })
      );

      // Filtrar estados nulos (que no se incluirán en el resultado final)
      const estadosConProyectos = estadosConCiudadesYProyectos.filter(
        (estado) => estado !== null
      );

      // Modificar el campo logo_color al construir la URL (añadir CDN)
      return estadosConProyectos.map((estado) => {
        if (estado.proyectos) {
          estado.proyectos = estado.proyectos
            .map((proyecto) => {
              proyecto.logo_color = normalizeProjectLogoUrl(proyecto.logo_color);
              proyecto.promotion_active = !!proyecto.promotion_active;
              return proyecto;
            })
            .sort((a, b) => {
              const aHasPriority =
                a.is_presale === 1 || a.promotion_active === true;
              const bHasPriority =
                b.is_presale === 1 || b.promotion_active === true;

              if (aHasPriority && !bHasPriority) return -1;
              if (!aHasPriority && bHasPriority) return 1;
              return 0;
            });
        }
        return estado;
      });
    } catch (error) {
      console.error("Error al obtener jerarquía de ubicaciones:", error);
      throw error;
    }
  },
  getHierarchyFormatted: async () => {
    const query = `
      SELECT s.id          AS state_id,
            s.name        AS state_name,
            s.active      AS state_active,
            s.created_at  AS state_created_at,
            s.update_at   AS state_update_at,
            s.banner_url  AS state_banner_url,
            c.id          AS city_id,
            c.name        AS city_name,
            c.active      AS city_active,
            c.created_at  AS city_created_at,
            c.update_at   AS city_update_at,
            p.id          AS project_id,
            p.name        AS project_name,
            p.short_name AS project_short_name,
            p.url_salesforce AS project_url_salesforce,
            p.created_at  AS project_created_at,
            p.update_at   AS project_update_at,
            pr.id         AS property_id,
            pr.name       AS property_name,
            pr.created_at AS property_created_at,
            pr.update_at  AS property_update_at
      FROM javer_db.state AS s
              INNER JOIN javer_db.city AS c ON s.id = c.id_state
              INNER JOIN javer_db.project AS p ON c.id = p.id_city
              INNER JOIN javer_db.property AS pr ON p.id = pr.id_project
      WHERE s.active = 1
        AND s.id != 10 
        AND c.active = 1
        AND p.active = 1
        AND pr.active = 1
      ORDER BY IF(s.id = 1, 0, 1),
              s.name, c.name, p.name;
    `;

    // 1. Ejecutar la consulta Raw
    const result = await knex.raw(query);

    // Obtener las filas del resultado (diferentes motores de DB devuelven diferentes estructuras)
    const rows = result.rows || result[0] || result;

    // 2. Procesar el resultado plano para anidarlo
    const statesMap = new Map();

    for (const row of rows) {
      // --- Nivel Estado ---
      if (!statesMap.has(row.state_id)) {
        statesMap.set(row.state_id, {
          id: row.state_id,
          name: row.state_name,
          active: row.state_active,
          created_at: row.state_created_at,
          update_at: row.state_update_at,
          banner_url: row.state_banner_url,
          ciudades: [],
          // Usamos un mapa temporal para encontrar ciudades rápidamente
          _citiesMap: new Map(),
        });
      }
      const currentState = statesMap.get(row.state_id);

      // --- Nivel Ciudad ---
      if (!currentState._citiesMap.has(row.city_id)) {
        const newCity = {
          id: row.city_id,
          name: row.city_name,
          active: row.city_active,
          created_at: row.city_created_at,
          update_at: row.city_update_at,
          desarrollos: [],
          // Mapa temporal para proyectos
          _projectsMap: new Map(),
        };
        currentState._citiesMap.set(row.city_id, newCity);
        currentState.ciudades.push(newCity);
      }
      const currentCity = currentState._citiesMap.get(row.city_id);

      // --- Nivel Proyecto ---
      if (!currentCity._projectsMap.has(row.project_id)) {
        const newProject = {
          id: row.project_id,
          name: row.project_name,
          short_name: row.project_short_name,
          created_at: row.project_created_at,
          update_at: row.project_update_at,
          prototipos: [],
        };
        currentCity._projectsMap.set(row.project_id, newProject);
        currentCity.desarrollos.push(newProject);
      }
      const currentProject = currentCity._projectsMap.get(row.project_id);

      // --- Nivel Propiedad (Desarrollo) ---
      currentProject.prototipos.push({
        id: row.property_id,
        name: row.property_name,
        created_at: row.property_created_at,
        update_at: row.property_update_at,
      });
    }

    // 3. Limpiar los mapas temporales del resultado final
    const finalHierarchy = Array.from(statesMap.values());
    finalHierarchy.forEach((state) => {
      state.ciudades.forEach((city) => {
        delete city._projectsMap;
      });
      delete state._citiesMap;
    });

    // 4. Devolver en el formato deseado
    return { data: finalHierarchy };
  },
};

module.exports = LocationHierarchy;
