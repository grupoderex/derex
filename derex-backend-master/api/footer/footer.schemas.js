const create = {
  name: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "name is required",
    isLength: {
      options: { max: 50 },
      errorMessage: "name english should be at most 50 chars",
    },
  },
  name_eng: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "name_eng is required",
    isLength: {
      options: { max: 50 },
      errorMessage: "name_eng should be at most 50 chars",
    },
  },
  path: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "path is required",
  },
  is_url: {
    in: ["body"],
    optional: true,
    isBoolean: true,
    errorMessage: "is_url is required",
  },
  active: {
    in: ["body"],
    optional: true,
    isBoolean: true,
    errorMessage: "active is required",
  },
  section: {
    in: ["body"],
    exists: true,
    isString: true,
    errorMessage: "section is required",
  },
};

const update = {
  name: {
    in: ["body"],
    optional: true,
    isString: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "name english should be at most 50 chars",
    },
  },
  name_eng: {
    in: ["body"],
    optional: true,
    isString: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "name_eng should be at most 50 chars",
    },
  },
  path: {
    in: ["body"],
    optional: true,
    isString: true,
    errorMessage: "path is required",
  },
  is_url: {
    in: ["body"],
    optional: true,
    isBoolean: true,
    errorMessage: "is_url is required",
  },
  active: {
    in: ["body"],
    optional: true,
    isBoolean: true,
    errorMessage: "active is required",
  },
  section: {
    in: ["body"],
    optional: true,
    isString: true,
    errorMessage: "section is required",
  },
};

module.exports = {
  create,
  update,
};
