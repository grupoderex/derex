const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

// Modelo para la blog
const Blog = {
  // Obtener todas las entradas de blog
  getAll: () => knex.select("*").from("blog_posts").orderBy("id", "desc"),

  getAllByActive: () =>
    knex
      .select("*")
      .from("blog_posts")
      .where("post_status", "publish")
      .orderBy("post_date", "desc"),

  // Obtener una entrada de blog por ID
  getById: (blogId) => {
    console.log("Get blog id:", blogId);
    return knex.select("*").from("blog_posts").where("id", blogId).first();
  },

  // Crear una nueva blog
  create: (newBlog) => {
    console.log("Inserting new blog:", newBlog);
    return knex("blog_posts").insert(newBlog);
  },

  // Actualizar una blog existente
  update: (blogId, updatedData) => {
    console.log("Update blogid:", blogId);
    return knex("blog_posts").where("id", blogId).update(updatedData);
  },

  // Eliminar una blog por ID
  delete: (blogId) => {
    console.log("Delete blogid :", blogId);
    return knex("blog_posts").where("id", blogId).del();
  },
};

module.exports = Blog;
