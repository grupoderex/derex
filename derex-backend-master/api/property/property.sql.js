const knexSingleton = require("../../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
require("dotenv").config();

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

const isAbsoluteHttpUrl = (value) => /^https?:\/\//i.test(value);

const getEnvBaseUrl = (key) => {
  const value = process.env[key];
  if (!value || typeof value !== "string") return "";
  return value.trim().replace(/\/$/, "");
};

const prependCdnIfNeeded = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return rawUrl;

  const cleanedUrl = decodeURIComponent(rawUrl).replace(/\/r$/, "");
  const cdnBase = getEnvBaseUrl("AWS_CDN_URL");

  if (!cleanedUrl) return cleanedUrl;
  if (isAbsoluteHttpUrl(cleanedUrl)) return cleanedUrl;
  if (!cdnBase) return cleanedUrl;
  if (cleanedUrl.startsWith(cdnBase)) return cleanedUrl;

  const normalizedPath = cleanedUrl.startsWith("/")
    ? cleanedUrl
    : `/${cleanedUrl}`;

  return `${cdnBase}${normalizedPath}`;
};

const normalizeMainImageForResponse = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return rawUrl;

  const cleanedUrl = decodeURIComponent(rawUrl).replace(/\/r$/, "");
  const cdnBase = getEnvBaseUrl("AWS_CDN_URL");
  const s3Base = getEnvBaseUrl("AWS_S3_URL");

  if (!cleanedUrl) return cleanedUrl;
  if (isAbsoluteHttpUrl(cleanedUrl)) return cleanedUrl;
  if (cdnBase && cleanedUrl.startsWith(cdnBase)) return cleanedUrl;

  const s3ImagePrefix = s3Base ? `${s3Base}/images/` : "";
  if (cdnBase && s3ImagePrefix && cleanedUrl.startsWith(s3ImagePrefix)) {
    const filename = cleanedUrl.split("/").pop();
    return `${cdnBase}/images/${encodeURIComponent(filename ?? "")}`;
  }

  if (cdnBase) {
    return `${cdnBase}/images/desarrollos/${encodeURIComponent(cleanedUrl)}`;
  }

  return cleanedUrl;
};

/**
 * @type {PropertySql.PropertyService}
 */
const Property = {
  // Búsqueda de propiedades basada en filtros
  search: async ({ project, state, showInactives, type, showInvisible }) => {
    try {
      let query = knex("property");

      if (showInactives === false) {
        query = query.where("property.active", 1);
      }

      if (project) {
        const selectionList = [
          "property.id",
          "property.project_order",
          "property.active",
          "property.banner",
          "property.type",
          "property.name",
          "property.description",
          "property.description_eng",
          "property.rooms",
          "property.bathrooms",
          "property.restrooms",
          "property.delivery_status",
          "property.construction_status",
          "property.cars_garage_capacity",
          "property.cars_parking_lot_capacity",
          "property.floors",
          "property.main_image",
          "property.360_video",
          "property.materport_video",
          "property.vertical_floor",
          "property.thumbnail",
          knex.raw("project.id AS id_project"),
          knex.raw(
            `CONCAT(COALESCE(project.calle, ''),' ',COALESCE(project.numero_int, ''),' ',COALESCE(project.numero_ext, ''),' ',COALESCE(project.colonia, ''),' ',COALESCE(project.ciudad, ''),' ',COALESCE(project.cp, '')) AS full_address`
          ),
          "project.latitud",
          "project.longitud",
          "project.video_url",
          "property.virtual_tour_iframe",
          "property.features",
        ];

        const result = await query
          .join("project", "project.id", "property.id_project")
          .modify((builder) => {
            builder.orderByRaw("property.project_order ASC, property.id ASC");
          })
          .where("project.id", project)
          .modify((builder) => {
            if (type) {
              switch (type) {
                case "vertical":
                  builder.whereNotNull("property.vertical_floor");
                  break;
                case "horizontal":
                  builder.whereNull("property.vertical_floor");
                  break;
              }
            }
          })
          .select(selectionList)
          .catch((error) => {
            console.error("Error en la consulta SQL:", error);
            throw error;
          });

        return await Promise.all(
          result.map(async (property) => {
            if (property.main_image) {
              property.main_image = normalizeMainImageForResponse(
                property.main_image
              );
            }

            // Buscar imágenes adicionales en la tabla project_property_images
            const propertyImages = await knex
              .select("id", "image_url", "image_alt_text", "order")
              .from("project_property_images")
              .where("id_property", property.id);

            const extraImages = propertyImages
              .map((image) => {
                const url = prependCdnIfNeeded(image.image_url);

                return {
                  id: image.id, // Agregar el ID a cada imagen adicional
                  url: url,
                  order: image.order, // Asume que el campo 'order' existe en el objeto 'image'
                  alt_text: image.image_alt_text,
                };
              })
              .sort((a, b) => a.order - b.order); // Ordena basándose en el campo 'order'

            /*  Descomentar si se requiere obtener amenidades
            const amenidades = await knex("amenity_property").where(
              "amenity_property.id_property",
              property.id
            );
            */

            const precios = await knex("prices_list_property").where(
              "prices_list_property.id_property",
              property.id
            );

            // Consulta para obtener blueprints de la tabla project_property_blueprints
            const blueprints = await knex("project_property_blueprints")
              .select("*")
              .where("id_property", property.id);
            //.orderBy("orden", "asc"); // TODO: Descomentar cuando se implemente el orden

            for (const key in blueprints) {
              blueprints[key].characteristics_architectural_plans =
                parseJsonField(
                  blueprints[key].characteristics_architectural_plans,
                  []
                );
              blueprints[key].title = parseJsonField(blueprints[key].title, null);
            }

            // Consulta para obtener información del urgency chip
            const urgencyChip = await knex("property_urgency_chip")
              .select("*")
              .where("property_id", property.id)
              .where("is_active", true)
              .first();

            const has_urgency_chip = !!urgencyChip;

            return {
              ...property,
              extra_images: extraImages,
              // amenidades, // Descomentar si se requiere obtener amenidades
              precios,
              blueprints, // Asignar el array blueprints directamente al resultado
              features: parseJsonField(property.features, {}),
              has_urgency_chip,
              urgency_chip: urgencyChip || null,
            };
          })
        );
      } else if (state) {
        // Crear una lista de selección con alias para evitar conflictos de nombres
        const selectionList = [
          "property.id",
          "property.project_order",
          "property.active",
          "property.banner",
          "property.type",
          "property.name",
          "property.description",
          "property.description_eng",
          "property.rooms",
          "property.bathrooms",
          "property.restrooms",
          "property.delivery_status",
          "property.construction_status",
          "property.cars_garage_capacity",
          "property.cars_parking_lot_capacity",
          "property.floors",
          "property.main_image",
          "property.360_video",
          "property.materport_video",
          knex.raw(
            `CONCAT(COALESCE(project.calle, ''),' ',COALESCE(project.numero_int, ''),' ',COALESCE(project.numero_ext, ''),' ',COALESCE(project.colonia, ''),' ',COALESCE(project.ciudad, ''),' ',COALESCE(project.cp, '')) AS full_address`
          ),
          "project.latitud",
          "project.longitud",
          knex.raw("project.id AS id_project"),
          "state.name as state_name",
          "property.virtual_tour_iframe",
        ];

        // Aplicar la selección en la consulta
        const result = await query
          .join("project", "project.id", "property.id_project")
          .modify((builder) => {
            builder.orderByRaw("property.project_order ASC, property.id ASC");
          })
          .where("project.id", project)
          .modify((builder) => {
            // Add condition for project.visible if showInvisible is false
            if (showInvisible === false) {
              builder.where("project.visible", 1);
            }

            if (type) {
              switch (type) {
                case "vertical":
                  builder.whereNotNull("property.vertical_floor");
                  break;
                case "horizontal":
                  builder.whereNull("property.vertical_floor");
                  break;
              }
            }
          })
          .select(selectionList)
          .catch((error) => {
            console.error("Error en la consulta SQL:", error);
            throw error;
          });

        // Modificar las URLs de las imágenes y obtener amenidades
        return await Promise.all(
          result.map(async (property) => {
            if (property.main_image) {
              property.main_image = normalizeMainImageForResponse(
                property.main_image
              );
            }

            // Buscar imágenes adicionales en la tabla project_property_images
            const propertyImages = await knex
              .select("id", "image_url", "image_alt_text", "order")
              .from("project_property_images")
              .where("id_property", property.id);

            const extraImages = propertyImages
              .map((image) => {
                const url = prependCdnIfNeeded(image.image_url);

                return {
                  id: image.id, // Agregar el ID a cada imagen adicional
                  url: url,
                  order: image.order, // Asume que el campo 'order' existe en el objeto 'image'
                };
              })
              .sort((a, b) => a.order - b.order); // Ordena basándose en el campo 'order'

            const amenidades = await knex("amenity_property").where(
              "amenity_property.id_property",
              property.id
            );

            const precios = await knex("prices_list_property").where(
              "prices_list_property.id_property",
              property.id
            );

            // Consulta para obtener blueprints de la tabla project_property_blueprints
            const blueprints = await knex("project_property_blueprints")
              .select("*")
              .where("id_property", property.id);
            //.orderBy("orden", "asc"); TODO: Descomentar cuando se implemente el orden

            for (const key in blueprints) {
              blueprints[key].characteristics_architectural_plans =
                parseJsonField(
                  blueprints[key].characteristics_architectural_plans,
                  []
                );
              blueprints[key].title = parseJsonField(blueprints[key].title, null);
            }

            // Consulta para obtener información del urgency chip
            const urgencyChip = await knex("property_urgency_chip")
              .select("*")
              .where("property_id", property.id)
              .where("is_active", true)
              .first();

            const has_urgency_chip = !!urgencyChip;

            return {
              ...property,
              extra_images: extraImages,
              amenidades,
              precios,
              state_name: property.state_name,
              blueprints, // Agregar el array blueprints al resultado
              has_urgency_chip,
              urgency_chip: urgencyChip || null,
            };
          })
        );
      }

      // Resto del código
    } catch (error) {
      console.error("Error during property search:", error);
      throw error;
    }
  },

  // Obtener todas las propiedades
  getAll: async (showInactives, showInvisible) => {
    try {
      let query = knex.select("*").from("property");

      if (showInactives === false) {
        query = query.where("property.active", 1);
      } else {
        query = query.where("property.active", 0);
      }

      if (showInvisible === false) {
        query = query.join("project", "project.id", "property.id_project");
        query = query.where("project.visible", 1);
      } else {
        query = query.join("project", "project.id", "property.id_project");
        query = query.where("project.visible", 0);
      }

      const properties = await query;

      // Modificar la URL en los campos main_image y main_image_vertical para cada propiedad
      return await Promise.all(
        properties.map(async (property) => {
          const propertyImages = await knex
            .select("id", "image_url", "image_alt_text", "order") // Asegúrate de seleccionar también el campo 'order'
            .from("project_property_images")
            .where("id_property", property.id);

          const extraImages = propertyImages
            .map((image) => {
              const url = prependCdnIfNeeded(image.image_url);

              return {
                id: image.id,
                url: url,
                order: image.order, // Añadir el campo 'order' para el ordenamiento
              };
            })
            .sort((a, b) => a.order - b.order);

          const monocerosImagePrefix = process.env.AWS_CDN_URL;
          const s3ImagePrefix = process.env.AWS_S3_URL;

          const shouldDecode = (url) => !url.startsWith(monocerosImagePrefix);

          const processImage = (image) => {
            const cleanedUrl = decodeURIComponent(image).replace(/\/r$/, ""); // Elimina /r al final

            // Si la URL no comienza con el prefijo de S3, verificar si no comienza con monocerosImagePrefix y concatenar
            if (
              !cleanedUrl.startsWith(monocerosImagePrefix) &&
              !cleanedUrl.startsWith(s3ImagePrefix)
            ) {
              return `${monocerosImagePrefix}${cleanedUrl}`;
            }

            // Si la URL ya comienza con monocerosImagePrefix, no es necesario realizar cambios
            return cleanedUrl;
          };

          const mainImage = property.main_image;

          const amenidades = await knex("amenity_property").where(
            "amenity_property.id_property",
            property.id
          );

          const precios = await knex("prices_list_property").where(
            "prices_list_property.id_property",
            property.id
          );

          return {
            ...property,
            main_image: mainImage,
            extra_images: extraImages,
            amenidades,
            precios,
          };
        })
      );
    } catch (error) {
      console.error("Error getting all properties:", error);
      throw error;
    }
  },

  // Obtener una propiedad por ID con imágenes adicionales

  getById: async (propertyId) => {
    try {
      /**
       * @type {Models.Property}
       */
      const property = await knex
        .select("*")
        .from("property")
        .where("id", propertyId)
        .first();

      if (!property) {
        return null; // Propiedad no encontrada
      }

      property.features = parseJsonField(property.features, {});
      property.additional_info = parseJsonField(property.additional_info, {});

      const propertyImages = await knex
        .select("id", "image_url", "image_alt_text", "order") // Incluir el campo 'order' en la selección
        .from("project_property_images")
        .where("id_property", propertyId);

      const extraImages = propertyImages
        .map((image) => {
          const url = prependCdnIfNeeded(image.image_url);

          return {
            id: image.id, // Agregar el ID a cada imagen adicional
            url: url,
            order: image.order, // Incluir el campo 'order'
            alt_text: image.image_alt_text,
          };
        })
        .sort((a, b) => a.order - b.order); // Ordenar basado en el campo 'order'

      // Verificar si main_image comienza con la cadena específica
      const monocerosImagePrefix = process.env.AWS_CDN_URL;
      const s3ImagePrefix = process.env.AWS_S3_URL;

      const shouldDecode = (url) => !url.startsWith(monocerosImagePrefix);

      const processImage = (image) => {
        const cleanedUrl = decodeURIComponent(image).replace(/\/r$/, ""); // Elimina /r al final

        // Si la URL no comienza con el prefijo de S3, verificar si no comienza con monocerosImagePrefix y concatenar
        if (
          !cleanedUrl.startsWith(monocerosImagePrefix) &&
          !cleanedUrl.startsWith(s3ImagePrefix)
        ) {
          return `${monocerosImagePrefix}${cleanedUrl}`;
        }

        // Si la URL ya comienza con monocerosImagePrefix, no es necesario realizar cambios
        return cleanedUrl;
      };

      const mainImage = property.main_image;

      // Consulta para obtener amenidades de la tabla amenity_project

      const amenidades = await knex("amenity_property").where(
        "amenity_property.id_property",
        propertyId
      );

      // Consulta para obtener blueprints de la tabla project_property_blueprints
      const blueprints = await knex("project_property_blueprints")
        .select("*")
        .where("id_property", propertyId);
      //.orderBy("orden", "asc"); TODO: Descomentar cuando se implemente el orden

      for (const key in blueprints) {
        blueprints[key].characteristics_architectural_plans =
          parseJsonField(blueprints[key].characteristics_architectural_plans, []);
        blueprints[key].title = parseJsonField(blueprints[key].title, null);
      }

      const precios = await knex("prices_list_property").where(
        "prices_list_property.id_property",
        property.id
      );

      return {
        ...property,
        main_image: mainImage,
        extra_images: extraImages,
        amenidades,
        blueprints,
        precios,
      };
    } catch (error) {
      console.error("Error al obtener propiedad por ID:", error.message);
      throw error;
    }
  },

  // Obtener una propiedad por ID con datos de project
  getByIdWithProject: async (propertyId, showInactives) => {
    try {
      let query = knex
        .select(
          "property.*",
          "project.longitud",
          "project.latitud",
          knex.raw(
            'CONCAT(project.calle, " ", project.numero_ext, " ", project.numero_int, " ", project.colonia, " ", project.ciudad, " ", project.cp) as full_address'
          ),
          "property.main_image",
          "property.main_image_vertical"
        )
        .from("property")
        .join("project", "property.id_project", "project.id")
        .where("property.id", propertyId);

      if (showInactives === false) {
        query = query.where("property.active", 1);
      }

      const propertyWithProject = await query.first();

      if (!propertyWithProject) {
        return null; // Propiedad no encontrada
      }

      // Procesar imágenes adicionales para la propiedad específica
      const propertyImages = await knex
        .select("id", "image_url", "image_alt_text", "order") // Incluir el campo 'order' en la selección
        .from("project_property_images")
        .where("id_property", propertyId);

      const extraImages = propertyImages
        .map((image) => {
          const url = prependCdnIfNeeded(image.image_url);

          return {
            id: image.id, // Agregar el ID a cada imagen adicional
            url: url,
            order: image.order, // Incluir el campo 'order'
            alt_text: image.image_alt_text,
          };
        })
        .sort((a, b) => a.order - b.order); // Ordenar basado en el campo 'order'

      const amenidades = await knex("amenity_property").where(
        "amenity_property.id_property",
        propertyId
      );

      const precios = await knex("prices_list_property").where(
        "prices_list_property.id_property",
        property.id
      );

      return {
        ...propertyWithProject,
        main_image: propertyWithProject.main_image,
        main_image_vertical: propertyWithProject.main_image_vertical,
        extra_images: extraImages,
        amenidades,
        precios,
      };
    } catch (error) {
      console.error("Error getting property by ID with project:", error);
      throw error;
    }
  },

  create: async (newProperty) => {
    try {
      const [id] = await knex("property").insert(newProperty);
      return id;
    } catch (error) {
      console.error("Error al crear la propiedad:", error);
      throw error; // Propaga el error hacia arriba
    }
  },

  update: async (propertyId, updatedData) => {
    return knex("property").where("id", propertyId).update(updatedData);
  },

  // Eliminar una propiedad por ID
  delete: (propertyId) => {
    return knex("property")
      .where("id", propertyId)
      .del()
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.error("Error deleting property:", error);
        throw error;
      });
  },

  // Obtener precio mas bajo por el id del proyecto (precio base)
  getPriceFromByProjectId: async (project_id) => {
    try {
      const precios = await knex("property")
        .select(
          knex.raw(
            "concat('$',format(prices_list_property.price_base,2)) as total"
          )
        )
        .leftJoin(
          "prices_list_property",
          "prices_list_property.id_property",
          "property.id"
        )
        .where("property.id_project", project_id)
        .andWhere("property.active", 1)
        .orderBy("prices_list_property.price_base", "asc")
        .first();
      return [200, precios];
    } catch (error) {
      console.error("Error during property search price:", error);
      throw error;
    }
  },

  // Obtener proyectos para el home
  getAllPropertiesForHome: async () => {
    try {
      const data = await knex("property as p2")
        .select(
          "p2.id as property_id",
          "p2.name as property_name",
          "p.short_name as project_name",
          "p.url_salesforce as project_url_salesforce",
          "p2.bathrooms",
          "p2.restrooms",
          "p2.cars_garage_capacity",
          "p2.cars_parking_lot_capacity",
          "p2.floors",
          "plp.price_base",
          "p2.main_image"
        )
        .leftJoin("prices_list_property as plp", "plp.id_property", "p2.id")
        .leftJoin("project as p", "p.id", "p2.id_project")
        .where("p2.active", 1)
        .andWhere("p2.outstanding", 1)
        .orderByRaw("RAND()")
        .limit(6);
      return [200, data];
    } catch (error) {
      return [409, error];
    }
  },

  // Get simple property list by state
  getSimpleByState: async (stateId) => {
    try {
      const properties = await knex("property as pr")
        .select("pr.id as property_id", "pr.name")
        .innerJoin("project as p", "p.id", "pr.id_project")
        .innerJoin("city as c", "c.id", "p.id_city")
        .where("c.id_state", stateId)
        .andWhere("pr.active", 1)
        .orderBy("pr.name");
      return properties;
    } catch (error) {
      console.error("Error getting simple properties by state:", error);
      throw error;
    }
  },
};

module.exports = Property;
