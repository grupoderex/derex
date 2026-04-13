const create = {
  name_es: {
    in: ["body"],
    exists: true,
    isString: true,
    notEmpty: true,
    errorMessage: "name_es es requerido.",
  },
  name_en: {
    in: ["body"],
    exists: true,
    isString: true,
    notEmpty: true,
    errorMessage: "name_en es requerido.",
  },
};

const update = {
  name_es: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "name_es es requerido.",
  },
  name_en: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "name_en es requerido.",
  },
  type: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "type es requerido.",
  },
};

module.exports = {
  create,
  update,
};
