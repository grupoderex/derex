const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
require("dotenv").config();

const UserFavoritesProperty = {
  // Crear un nuevo registro en la tabla user_favorites_property
  create: async ({ userId, propertyId }) => {
    try {
      const [newFavoriteId] = await knex("user_favorites_property").insert({
        id_user: userId, // Asegúrate de que estas coincidan con las columnas de tu tabla
        id_property: propertyId,
      });

      return newFavoriteId;
    } catch (error) {
      console.error("Error al crear un nuevo favorito:", error);
      throw error;
    }
  },

  // Actualizar un registro en la tabla user_favorites_property por ID
  update: async ({ id, userId, propertyId }) => {
    try {
      const updatedRows = await knex("user_favorites_property")
        .where("id", id)
        .update({
          id_user: userId,
          id_property: propertyId,
        });

      return updatedRows > 0;
    } catch (error) {
      console.error("Error al actualizar un favorito por ID:", error);
      throw error;
    }
  },

  // Buscar un registro en la tabla user_favorites_property por ID
  searchById: async (favoriteId) => {
    try {
      return await knex("user_favorites_property")
        .where("id", favoriteId)
        .first();
    } catch (error) {
      console.error("Error al buscar un favorito por ID:", error);
      throw error;
    }
  },

  // Eliminar un registro en la tabla user_favorites_property por ID
  delete: async (favoriteId) => {
    try {
      const deletedRows = await knex("user_favorites_property")
        .where("id", favoriteId)
        .del();

      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar un favorito por ID:", error);
      throw error;
    }
  },

  deletebyUser: async ({ id_user, id_property }) => {
    try {
      const deletedRows = await knex("user_favorites_property")
        .where({
          id_user,
          id_property,
        })
        .del();

      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar un favorito por ID:", error);
      console.error(error.stack);
      throw error;
    }
  },

  getAllByUserId: async (userId) => {
    try {
      const { AWS_CDN_URL, AWS_S3_URL } = process.env;

      const result = await knex("user_favorites_property")
        .select(
          "user_favorites_property.id as user_favorites_id",
          "property.id",
          "property.name",
          "property.delivery_status",
          "property.main_image",
          "city.name as city_name",
          "state.name as state_name",
          "project.id as project_id",
          "project.short_name as project_short_name",
          "project.url_salesforce as project_url_salesforce"
        )
        .join(
          "property",
          "user_favorites_property.id_property",
          "=",
          "property.id"
        )
        .join("project", "property.id_project", "=", "project.id")
        .join("city", "project.id_city", "=", "city.id")
        .join("state", "city.id_state", "=", "state.id")
        .where("user_favorites_property.id_user", userId);

      // Aplicar el handler a cada resultado dentro de la función
      return result.map((row) => {
        const mainImage = row.main_image;

        if (mainImage.startsWith(AWS_CDN_URL)) {
          // La imagen ya está en el formato deseado, no es necesario hacer cambios.
          return { ...row, main_image: mainImage };
        } else if (mainImage.startsWith(AWS_S3_URL)) {
          // Recortar la URL y concatenar AWS_CDN_URL con el resultado
          const index = mainImage.indexOf("/images");
          const newMainImage = `${AWS_CDN_URL}${mainImage.substring(index)}`;
          return { ...row, main_image: newMainImage };
        } else {
          // Concatenar AWS_CDN_URL y la ruta deseada
          const newMainImage = `${AWS_CDN_URL}/images/desarrollos/${mainImage}`;
          return { ...row, main_image: newMainImage };
        }
      });
    } catch (error) {
      console.error(
        "Error al obtener todos los favoritos por ID de usuario:",
        error
      );
      throw error;
    }
  },

  exists: async ({ user_id, property_id }) => {
    try {
      const result = await knex("user_favorites_property")
        .where({
          id_user: user_id,
          id_property: property_id,
        })
        .first();

      return !!result; // Devuelve true si la relación existe, false si no existe
    } catch (error) {
      console.error("Error al verificar la existencia de la relación:", error);
      console.error(error.stack);
      throw error;
    }
  },
};

module.exports = UserFavoritesProperty;
