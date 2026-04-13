const create = {
  description_es: {
    exists: true,
    isString: true,
    errorMessage: " La descripción es requerida.",
    isLength: {
      options: { max: 320 },
      errorMessage: "description_es should be at most 320 chars",
    },
  },
  description_en: {
    exists: true,
    isString: true,
    errorMessage: " La descripción es requerida.",
    isLength: {
      options: { max: 320 },
      errorMessage: "description_en should be at most 320 chars",
    },
  },
  project_id: {
    exists: true,
    isInt: true,
    toInt: true,
    errorMessage: "El project_id es requerido.",
  },
  url: {
    exists: true,
    isString: true,
    isURL: {
      errorMessage: "url should be a valid URL",
    },
  },
};

const update = {
  description_es: {
    optional: true,
    isString: true,
    isLength: {
      options: { max: 320 },
      errorMessage: "description_es should be at most 320 chars",
    },
  },
  description_en: {
    optional: true,
    isString: true,
    isLength: {
      options: { max: 320 },
      errorMessage: "description_en should be at most 320 chars",
    },
  },
  project_id: {
    optional: true,
    isInt: true,
    toInt: true,
    errorMessage: "El project_id es requerido.",
  },
  url: {
    optional: true,
    isString: true,
    isURL: {
      errorMessage: "url should be a valid URL",
    },
  },
};

module.exports = {
  create,
  update,
};
