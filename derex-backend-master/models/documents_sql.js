const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

const Documents = {
  create: async (documentData) => {
    try {
      const [id] = await knex("documents").insert(documentData);
      return id;
    } catch (error) {
      console.error("Error al crear el documento:", error);
      throw error;
    }
  },

  update: async (documentId, updatedData) => {
    try {
      await knex("documents").where("id", documentId).update(updatedData);
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      throw error;
    }
  },

  toggleActive: async (documentId) => {
    try {
      const [document] = await knex("documents")
        .where("id", documentId)
        .select("active");
      if (document) {
        const updatedActive = !document.active;
        await knex("documents")
          .where("id", documentId)
          .update({ active: updatedActive });
      } else {
        throw new Error("Documento no encontrado.");
      }
    } catch (error) {
      console.error("Error al activar/desactivar el documento:", error);
      throw error;
    }
  },

  getByPage: async (page) => {
    try {
      return await knex("documents").where("page", page).select("*");
    } catch (error) {
      console.error("Error al obtener documentos por página:", error);
      throw error;
    }
  },

  getAllByPages: async () => {
    try {
      const decalogo = await Documents.getByPage("decalogo");
      const avisosPrivacidad = await Documents.getByPage("avisos_privacidad");
      const contratosAdhesion = await Documents.getByPage("contratos_adhesion");

      return {
        decalogo,
        avisosPrivacidad,
        contratosAdhesion,
      };
    } catch (error) {
      console.error(
        "Error al obtener todos los documentos por páginas:",
        error
      );
      throw error;
    }
  },

  getBySection: async () => {
    try {
      const sections = await knex("documents")
        .distinct("section")
        .whereNotNull("section")
        .pluck("section");

      return await Promise.all(
        sections.map(async (section) => {
          const documentsInSection = await knex("documents")
            .where("section", section)
            .where("page", "contratos_adhesion") // Añadida la restricción
            .select("*");
          return { section, documents: documentsInSection };
        })
      );
    } catch (error) {
      console.error(
        "Error al obtener documentos agrupados por sección:",
        error
      );
      throw error;
    }
  },
};

module.exports = Documents;
