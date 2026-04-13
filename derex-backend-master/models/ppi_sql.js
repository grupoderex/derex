const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const PropertyImages = {
  create: async (imageData) => {
    try {
      const payload = {
        ...imageData,
        created_at: knex.fn.now(),
        update_at: knex.fn.now(),
      };
      const [id] = await knex("project_property_images").insert(payload);
      return id;
    } catch (error) {
      console.error("Error al crear la imagen de propiedad:", error);
      throw error;
    }
  },

  getAllByPropertyId: async (propertyId) => {
    try {
      return await knex("project_property_images")
        .where("id_property", propertyId)
        .select("*");
    } catch (error) {
      console.error(
        "Error al obtener las imágenes de propiedad por ID de propiedad:",
        error
      );
      throw error;
    }
  },

  getById: async (imageId) => {
    try {
      return await knex("project_property_images").where("id", imageId).first();
    } catch (error) {
      console.error("Error al obtener la imagen de propiedad por ID:", error);
      throw error;
    }
  },

  update: async (imageId, updatedData) => {
    try {
      await knex("project_property_images")
        .where("id", imageId)
        .update(updatedData);
    } catch (error) {
      console.error("Error al actualizar la imagen de propiedad:", error);
      throw error;
    }
  },

  delete: async (imageId) => {
    try {
      await knex("project_property_images").where("id", imageId).del();
    } catch (error) {
      console.error("Error al eliminar la imagen de propiedad:", error);
      throw error;
    }
  },
};

module.exports = PropertyImages;
