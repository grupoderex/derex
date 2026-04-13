const { exists } = require("../../models/ufp_sql");

const create = {
  question_es: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "question_es is required",
    isLength: {
      errorMessage: "question_es must be max 150 characters",
      options: { max: 150 },
    },
  },
  question_en: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "question_en is required",
    isLength: {
      errorMessage: "question_en must be max 150 characters",
      options: { max: 150 },
    },
  },

  answer_es: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "answer_es is required",
    isLength: {
      errorMessage: "answer_es must be max 500 characters",
      options: { max: 500 },
    },
  },
  answer_en: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "answer_en is required",
    isLength: {
      errorMessage: "answer_en must be  max 500 characters",
      options: { max: 500 },
    },
  },
  url_link: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isString: true,
    isURL: {
      errorMessage: "url should be a valid URL",
    },
  },
  open_in_new_tab: {
    in: ["body"],
    optional: true,
    isBoolean: true,
    toBoolean: true,
  },
};

const update = {
  question_es: {
    in: ["body"],
    optional: true,
    isString: true,
    isLength: {
      errorMessage: "question_es must be at least 1 characters",
      options: { max: 150 },
    },
  },
  question_en: {
    in: ["body"],
    optional: true,
    isString: true,
    isLength: {
      errorMessage: "question_en must be max 150 characters",
      options: { max: 150 },
    },
  },

  answer_es: {
    in: ["body"],
    optional: true,
    isString: true,
    isLength: {
      errorMessage: "answer_es must be max 500 characters",
      options: { max: 500 },
    },
  },
  answer_en: {
    in: ["body"],
    optional: true,
    isString: true,
    isLength: {
      errorMessage: "answer_en must be  be max 500 characters",
      options: { max: 500 },
    },
  },
  url_link: {
    in: ["body"],
    optional: { options: { nullable: true } },
    isString: true,
    isURL: {
      errorMessage: "url should be a valid URL",
    },
  },
  open_in_new_tab: {
    in: ["body"],
    optional: true,
    isBoolean: true,
    toBoolean: true,
  },
};

module.exports = {
  create,
  update,
};
