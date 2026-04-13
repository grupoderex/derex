const create = {
  title_es: {
    in: ["body"],
    exists: true,
    isString: true,
    notEmpty: true,
    errorMessage: "title_es es requerido.",
  },
  title_en: {
    in: ["body"],
    exists: true,
    isString: true,
    notEmpty: true,
    errorMessage: "title_en es requerido.",
  },
  content: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "content es requerido.",
  },
  content_date: {
    in: ["body"],
    optional: true,
    notEmpty: true,
    errorMessage: "content_date es requerido.",
  },
  file: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "file es requerido.",
  },
  section_id: {
    in: ["body"],
    exists: true,
    isInt: true,
    toInt: true,
    notEmpty: true,
    errorMessage: "section_id es requerido.",
  },
};

const update = {
  title_es: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "title_es es requerido.",
  },
  title_en: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "title_en es requerido.",
  },
  content: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "content es requerido.",
  },
  content_date: {
    in: ["body"],
    optional: true,
    isDate: true,
    notEmpty: true,
    errorMessage: "content_date es requerido.",
  },
  file: {
    in: ["body"],
    optional: true,
    isString: true,
    notEmpty: true,
    errorMessage: "file es requerido.",
  },
  section_id: {
    in: ["body"],
    optional: true,
    isInt: true,
    toInt: true,
    notEmpty: true,
    errorMessage: "section_id es requerido.",
  },
};

module.exports = {
  create,
  update,
};
