const create = {
  name: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "name no puede estar vacío.",
    },
    isLength: {
      options: { max: 30 },
      errorMessage: "name should be at most 30 chars",
    },
  },
  link: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "link no puede estar vacío.",
    },
    isURL: {
      errorMessage: "link debe ser una URL.",
    },
  },
  icon: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "icon no puede estar vacío.",
    },
    isURL: {
      errorMessage: "icon debe ser una URL.",
    },
  },
};

const update = {
  name: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "name no puede estar vacío.",
    },
    isLength: {
      options: { max: 30 },
      errorMessage: "name should be at most 30 chars",
    },
  },
  link: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "link no puede estar vacío.",
    },
    isURL: {
      errorMessage: "link debe ser una URL.",
    },
  },
  icon: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "icon no puede estar vacío.",
    },
    isURL: {
      errorMessage: "icon debe ser una URL.",
    },
  },
};

module.exports = {
  create,
  update,
};
