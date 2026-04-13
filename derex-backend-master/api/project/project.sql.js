const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
require("dotenv").config();

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const normalizeProjectAssetUrl = (assetUrl) => {
  if (typeof assetUrl !== "string") {
    return assetUrl;
  }

  const trimmed = assetUrl.trim();
  if (!trimmed) {
    return assetUrl;
  }

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

const parseJsonField = (value, fallback = null) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "null" || trimmed === "undefined") {
    return fallback;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return fallback;
  }
};

/**
 * @type {ProjectSql.ProjectService}
 */
const Project = {
  // Project search based on filters
  search: async ({ state, city, property }) => {
    try {
      let query = knex("project")
        .modify((qb) => {
          // If the state filter is provided, build the relationship through the city and state tables
          if (state) {
            qb.join("city", "city.id", "project.id_city")
              .join("state", "state.id", "city.id_state")
              .where("state.id", state);
          }

          // If the city filter is provided, simply apply the filter to the project table
          if (city) {
            qb.where("project.id_city", city);
          }

          // If the property filter is provided, simply apply the filter to the property table
          if (property) {
            qb.join("property", "property.id_project", "project.id").where(
              "property.id",
              property
            );
          }
        })
        .select("*");

      // Log the generated SQL query
      const { sql, bindings } = query.toSQL();
      console.log("SQL Query:", knex.raw(sql, bindings).toString());

      // Execute the query and then map the results
      // Modify the URL in the logo_color field
      const projects = await query;
      return projects.map((project) => ({
        ...project,
        logo_color: normalizeProjectAssetUrl(project.logo_color),
        logo_grey: normalizeProjectAssetUrl(project.logo_grey),
      }));
    } catch (error) {
      console.error("Error during project search:", error);
      throw error;
    }
  },
  // Get all projects
  getAll: async (showInvisible) => {
    try {
      /**
       * @type {Models.Project[]}
       */
      const query = knex
        .select("project.*", "project_promotions.is_active as promotion_active")
        .leftJoin(
          "project_promotions",
          "project.id",
          "project_promotions.project_id"
        )
        .from("project")
        .where({ active: 1 });
      if (showInvisible === false) {
        query.where("visible", 1);
      }
      const projects = await query;

      const modifyImageField = (imageUrl) => normalizeProjectAssetUrl(imageUrl);

      // Modify the URLs in the logo_color and logo_grey fields
      return projects.map(
        ({
          logo_color,
          logo_grey,
          contact_form,
          vertical_data,
          ...project
        }) => ({
          ...project,
          logo_color: modifyImageField(logo_color),
          logo_grey: modifyImageField(logo_grey),
          contact_form: parseJsonField(contact_form, null),
          vertical_data: parseJsonField(vertical_data, null),
          promotion_active: !!project.promotion_active,
        })
      );
    } catch (error) {
      console.error("Error getting all projects:", error);
      throw error;
    }
  },

  // Get a project by ID
  getById: async (projectId, showInvisible) => {
    try {
      const modifyImageField = (imageUrl) => normalizeProjectAssetUrl(imageUrl);

      /**
       * @type {Models.Project}
       */
      const project = await knex
        .select("*")
        .from("project")
        .where("id", projectId)
        .first();

      if (!project) {
        return null; // Proyecto no encontrado
      }

      project.interest_area = parseJsonField(project.interest_area, null);
      project.equipment = parseJsonField(project.equipment, null);
      project.additional_info = parseJsonField(project.additional_info, {});
      project.contact_form = parseJsonField(project.contact_form, null);
      project.vertical_data = parseJsonField(project.vertical_data, null);

      // Si el proyecto existe se agregan los tipos de créditos (nuevo requerimiento) 2024-04-08
      const credit_type_names = await knex
        .select("credit_type.name")
        .from("project_credits")
        .leftJoin("credit_type", "credit_type.id", "project_credits.id_credit")
        .where("project_credits.id_project", projectId)
        .orderBy("credit_type.name", "asc");
      if (credit_type_names.length) {
        project.credit_types = credit_type_names.map((item) => item.name);
      } else {
        project.credit_types = [];
      }

      // Modificar la URL en los campos logo_color y logo_grey utilizando la función modifyImageField
      const modifiedProject = {
        ...project,
        logo_color: modifyImageField(project.logo_color),
        logo_grey: modifyImageField(project.logo_grey),
      };

      const hasPropertyWithEdgeCertification = await knex("property")
        .select("isEdgeCertified")
        .where("id_project", projectId)
        .andWhere("isEdgeCertified", 1)
        .first();

      return {
        ...modifiedProject,
        hasPropertyWithEdgeCertification: hasPropertyWithEdgeCertification
          ? true
          : false,
      };
    } catch (error) {
      console.error("Error al obtener proyecto por ID:", error);
      throw error;
    }
  },

  // Create a new project
  create: async (createInput) => {
    try {
      createInput.outstanding =
        createInput.outstanding === "true" ? true : false;
      createInput.visible = createInput.visible === "true" ? true : false;
      const { cat_credits_id } = createInput;
      delete createInput.cat_credits_id;
      const [projectID] = await knex("project").insert(createInput);

      if (cat_credits_id && cat_credits_id.length) {
        for (const id_credit of cat_credits_id) {
          await knex("project_credits").insert({
            id_project: projectID,
            id_credit,
            created_at: knex.fn.now(),
            update_at: knex.fn.now(),
          });
        }
      }

      return [projectID];
    } catch (error) {
      console.error("project : create", error);
      return undefined;
    }
  },

  // Update an existing project
  update: async (projectId, updateInput) => {
    try {
      updateInput.outstanding =
        updateInput.outstanding === "true" ? true : false;
      const { interest_area, equipment, vertical_data } = updateInput;
      const { cat_credits_id } = updateInput;

      delete updateInput.cat_credits_id;
      delete updateInput.interest_area;
      delete updateInput.equipment;
      delete updateInput.vertical_data;

      await knex("project")
        .update(updateInput)
        .update({ interest_area: JSON.stringify(interest_area) })
        .update({ equipment: JSON.stringify(equipment) })
        .update({ vertical_data: JSON.stringify(vertical_data) })
        .where("id", projectId);

      if (cat_credits_id && cat_credits_id.length) {
        await knex("project_credits").where("id_project", projectId).del();

        for (const id_credit of cat_credits_id) {
          await knex("project_credits").insert({
            id_project: projectId,
            id_credit,
            created_at: knex.fn.now(),
            update_at: knex.fn.now(),
          });
        }
      }
    } catch (error) {
      console.error("project : update", error);
      return undefined;
    }
  },

  // Delete a project by ID
  delete: (projectId) =>
    knex("project").where("id", projectId).update({ active: 0 }),

  // Get projects and properties by filters
  getAllProjectsByFilters: async (filters) => {
    try {
      const { project_id, state_id, city_id, price_min, price_max } = filters;
      const where = {};
      where["p.active"] = 1;
      where["p.visible"] = 1;

      if (project_id) where["p.id"] = project_id;
      if (state_id) where["s.id"] = state_id;
      if (city_id) where["c.id"] = city_id;

      let filterPrice = "";
      if (price_min && !price_max) {
        filterPrice = `HAVING MIN(plp.price_base) >= ${price_min}`;
      } else if (!price_min && price_max) {
        filterPrice = `HAVING MIN(plp.price_base) <= ${price_max}`;
      } else if (price_min && price_max) {
        filterPrice = `HAVING MIN(plp.price_base) BETWEEN ${price_min} AND ${price_max}`;
      }

      const query = knex("project as p")
        .select(
          "s.id as state_id",
          "s.name as state_name",
          "c.id as city_id",
          "c.name as city_name",
          knex.raw(`json_arrayagg(json_object(
              'project_id', p.id,
              'logo_color', p.logo_color,
              'project_name', p.name,
              'project_salesforce', p.url_salesforce,
              'credit_types', credits.info,
              'amenities', amenities.info,
              'amenities_eng', amenities.info_eng,
              'price_base_mxn', prices.info,
              'latitud', p.latitud,
              'longitud', p.longitud,
              'link_map', p.link_map,
              'banner_url', p.banner_url,
              'is_presale', p.is_presale,  
              'update_at', p.update_at,
              'promotion_active', pp.is_active,
              'promotion', CASE 
                WHEN pp.id IS NOT NULL THEN 
                  json_object(
                    'id', pp.id,
                    'title_es', pp.title_es,
                    'title_en', pp.title_en,
                    'description_es', pp.description_es,
                    'description_en', pp.description_en,
                    'promo_image', pp.promo_image,
                    'is_active', pp.is_active
                  )
                ELSE NULL
              END
            )) as projects`)
        )
        .innerJoin("city as c", "c.id", "p.id_city")
        .innerJoin("state as s", "s.id", "c.id_state")
        .leftJoin(
          knex.raw(`(
              select min(plp.price_base) as info, p2.id_project
              from property as p2
              left join prices_list_property as plp on plp.id_property = p2.id
              where p2.active = 1
              group by p2.id_project
              ${filterPrice}
            ) as prices`),
          "prices.id_project",
          "p.id"
        )
        .leftJoin(
          knex.raw(`(
              select json_arrayagg(ct.name) as info, pc.id_project
              from project_credits as pc
              left join credit_type as ct on ct.id = pc.id_credit
              group by pc.id_project
            ) as credits`),
          "credits.id_project",
          "p.id"
        )
        .leftJoin(
          knex.raw(`(
              select json_arrayagg(ap.name) as info, json_arrayagg(ap.name_eng) as info_eng, ap.id_project
              from amenity_property as ap
              group by ap.id_project
            ) as amenities`),
          "amenities.id_project",
          "p.id"
        )
        .leftJoin("project_promotions as pp", function () {
          this.on("pp.project_id", "p.id").andOn("pp.is_active", knex.raw("1"));
        })
        .where(where)
        .groupBy("s.id", "s.name", "c.id", "c.name")
        .orderBy("s.id", "asc")
        .orderBy("c.id", "asc");

      const data = await query;

      for (const item of data) {
        const parsedProjects = parseJsonField(item.projects, []);

        item.projects = parsedProjects.sort((a, b) => {
          const aHasPriority = a.is_presale === 1 || a.promotion_active === 1;
          const bHasPriority = b.is_presale === 1 || b.promotion_active === 1;

          if (aHasPriority && !bHasPriority) return -1;
          if (!aHasPriority && bHasPriority) return 1;
          return 0;
        });
      }

      return [200, data];
    } catch (error) {
      return [409, error];
    }
  },

  // Obtener proyectos para el home
  getAllProjectsForHome: async () => {
    try {
      const data = await knex("project as p")
        .select(
          "s.id as state_id",
          "s.name as state_name",
          "c.id as city_id",
          "c.name as city_name",
          "p.id as project_id",
          "p.logo_color",
          "p.name as project_name",
          knex.raw("credits.info as credit_types"),
          knex.raw("amenities.info as amenities"),
          knex.raw("amenities.info_eng as amenities_eng"),
          knex.raw("amenities.img as amenities_img"),
          knex.raw("coalesce(prices.info, 0.0) as price_base_mxn"),
          knex.raw(
            "(case when e.info > 0 then true else false end) as isEdgeCertified"
          )
        )
        .innerJoin("city as c", "c.id", "p.id_city")
        .innerJoin("state as s", "s.id", "c.id_state")
        .leftJoin(
          knex.raw(`(
            select min(plp.price_base) as info, p2.id_project
            from property as p2
            left join prices_list_property as plp on plp.id_property = p2.id
            where p2.active = 1
            group by p2.id_project
          ) as prices`),
          "prices.id_project",
          "p.id"
        )
        .leftJoin(
          knex.raw(`(
            select json_arrayagg(ct.name) as info, pc.id_project
            from project_credits as pc
            left join credit_type as ct on ct.id = pc.id_credit
            group by pc.id_project
          ) as credits`),
          "credits.id_project",
          "p.id"
        )
        .leftJoin(
          knex.raw(`(
            select json_arrayagg(ap.name) as info, json_arrayagg(ap.name_eng) as info_eng, json_arrayagg(ap.img_url) as img, ap.id_project
            from amenity_property as ap
            group by ap.id_project
          ) as amenities`),
          "amenities.id_project",
          "p.id"
        )
        .innerJoin(
          knex.raw(`(
            select sum(isEdgeCertified) as info, id_project
            from property
            group by id_project
          ) as e`),
          "e.id_project",
          "p.id"
        )
        .where("p.active", 1)
        .andWhere("p.visible", 1)
        .andWhere("p.outstanding", 1);
      data.map((item) => {
        item.credit_types = [...new Set(JSON.parse(item.credit_types))].filter(
          (item) => item
        );
        item.amenities = [...new Set(JSON.parse(item.amenities))].filter(
          (item) => item
        );
        item.amenities_eng = [
          ...new Set(JSON.parse(item.amenities_eng)),
        ].filter((item) => item);
        item.amenities_img = [
          ...new Set(JSON.parse(item.amenities_img)),
        ].filter((item) => item);
      });

      return [200, data];
    } catch (error) {
      return [409, error];
    }
  },

  // Verificar si en la creación/actualización ya existe un destacado
  checkExistsOutstandingByCityID: async (city_id) => {
    try {
      // Obtener datos de proyectos destacados con base en la ciudad
      const data = await knex
        .with("get_state", (qb) => {
          qb.select("s.id as state_id", "s.name as state_name")
            .from("city as c")
            .innerJoin("state as s", "s.id", "c.id_state")
            .where("c.id", city_id);
        })
        .select(
          "g.state_id",
          "g.state_name",
          "p.id as project_id",
          "p.name as project_name"
        )
        .from("get_state as g")
        .innerJoin("city as c", "c.id_state", "g.state_id")
        .innerJoin("project as p", function () {
          this.on("p.id_city", "c.id")
            .andOn("p.active", 1)
            .andOn("p.visible", 1)
            .andOn("p.outstanding", 1);
        });

      return data[0];
    } catch (error) {
      return error;
    }
  },

  // Buscar document_url por nombre de archivo
  getDocumentUrlByFileName: async (fileName) => {
    try {
      // Creamos el patrón para buscar el nombre del archivo en la URL
      const searchPattern = `%${fileName}%`;

      // Buscamos un proyecto que contenga el nombre del archivo en document_url
      const project = await knex("project")
        .select("document_url")
        .where("document_url", "like", searchPattern)
        .andWhere("active", 1)
        .first();

      if (!project || !project.document_url) {
        return null; // No se encontró ningún proyecto con ese nombre de archivo
      }

      return project.document_url;
    } catch (error) {
      console.error("Error al buscar document_url:", error);
      throw error;
    }
  },

  // Get simple project list by state
  getSimpleByState: async (stateId) => {
    try {
      const projects = await knex("project as p")
        .select("p.id as project_id", "p.name")
        .innerJoin("city as c", "c.id", "p.id_city")
        .where("c.id_state", stateId)
        .andWhere("p.active", 1)
        .orderBy("p.name");
      return projects;
    } catch (error) {
      console.error("Error getting simple projects by state:", error);
      throw error;
    }
  },
};

module.exports = Project;
