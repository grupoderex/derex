function castDate(date) {
  return date ? date.toISOString().split("T")[0] : "";
}

module.exports = {
  castDate,
};
