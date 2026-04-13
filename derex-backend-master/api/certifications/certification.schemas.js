const create = {
  title_es: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "title_es no puede estar vacío.",
    },
    isLength: {
      options: { max: 50 },
      errorMessage: "title_es english should be at most 50 chars",
    },
  },
  title_en: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "title_en no puede estar vacío.",
    },
    isLength: {
      options: { max: 50 },
      errorMessage: "title_es english should be at most 50 chars",
    },
  },
  description_es: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "description_es no puede estar vacío.",
    },
    isLength: {
      options: { max: 250 },
      errorMessage: "description_es english should be at most 250 chars",
    },
  },
  description_en: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "description_en no puede estar vacío.",
    },
    isLength: {
      options: { max: 250 },
      errorMessage: "description_es english should be at most 250 chars",
    },
  },
  date: {
    in: ["body"],
    exists: true,
    notEmpty: {
      errorMessage: "date no puede estar vacío.",
    },
  },
  button_url: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isURL: {
      errorMessage: "button_url debe ser una URL.",
    },
    notEmpty: {
      errorMessage: "button_url no puede estar vacío.",
    },
    optional: true,
  },
  new_tab: {
    in: ["body"],
    optional: true,
    isBoolean: {
      errorMessage: "new_tab debe ser un booleano.",
    },
    notEmpty: {
      errorMessage: "new_tab no puede estar vacío.",
    },
  },
  image_url: {
    in: ["body"],
    exists: true,
    isURL: {
      errorMessage: "image_url debe ser una URL.",
    },
    notEmpty: {
      errorMessage: "image_url no puede estar vacío.",
    },
    optional: true,
  },
  show_date: {
    in: ["body"],
    optional: true,
    isBoolean: {
      errorMessage: "show_date debe ser un booleano.",
    },
  },
  image_alt_text: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isString: {
      errorMessage: "image_alt_text debe ser un string.",
    },
    notEmpty: {
      errorMessage: "image_alt_text no puede estar vacío.",
    },
  },
};

const update = {
  title_es: {
    in: ["body"],
    optional: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "title_es english should be at most 50 chars",
    },
  },
  title_en: {
    in: ["body"],
    optional: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "title_es english should be at most 50 chars",
    },
  },
  description_es: {
    in: ["body"],
    optional: true,
    isLength: {
      options: { max: 250 },
      errorMessage: "description_es english should be at most 250 chars",
    },
  },
  description_en: {
    in: ["body"],
    optional: true,
    isLength: {
      options: { max: 250 },
      errorMessage: "description_es english should be at most 250 chars",
    },
  },
  date: {
    in: ["body"],
    optional: true,
  },
  button_url: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isURL: {
      errorMessage: "button_url debe ser una URL.",
    },
  },
  button_url_en: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isURL: {
      errorMessage: "button_url_en debe ser una URL.",
    },
  },
  new_tab: {
    in: ["body"],
    optional: true,
    isBoolean: {
      errorMessage: "new_tab debe ser un booleano.",
    },
  },
  image_url: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isURL: {
      errorMessage: "image_url debe ser una URL.",
    },
    notEmpty: {
      errorMessage: "image_url no puede estar vacío.",
    },
    optional: true,
  },
  show_date: {
    in: ["body"],
    optional: true,
    isBoolean: {
      errorMessage: "show_date debe ser un booleano.",
    },
  },
  image_alt_text: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isString: {
      errorMessage: "image_alt_text debe ser un string.",
    },
  },
};

module.exports = {
  create,
  update,
};
