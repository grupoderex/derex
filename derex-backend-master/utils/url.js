function generateUrlSlug(title) {
  if (!title || title === null || title === undefined) {
    return null;
  }

  return title
    .normalize("NFD") // Descompone los caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
    .toLowerCase() // Convierte a minúsculas
    .replace(/[^a-z0-9\s-]/g, "") // Elimina caracteres especiales excepto espacios y guiones
    .trim() // Elimina espacios al inicio y final
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/-+/g, "-"); // Reemplaza múltiples guiones por uno solo
}

module.exports = {
  generateUrlSlug,
};