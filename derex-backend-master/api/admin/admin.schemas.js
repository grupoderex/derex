const registerUserSchema = {
  first_name: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "First Name should be at least 3 chars",
    },
  },
  last_name: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Last Name should be at least 3 chars",
    },
  },
  primary_email: {
    isEmail: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Invalid Email",
  },
  password: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
  },
  primary_phone: {
    isString: true,
    trim: true,
    optional: true,
    matches: {
      options: /^[0-9]{9,11}$/,
      errorMessage: "Phone must be between 9 and 11 digits",
    },
  },
};

const registerAdminSchema = {
  name: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "First Name should be at least 3 chars",
    },
  },
  email: {
    isEmail: true,
    trim: true,
    exists: true,
    errorMessage: "Invalid Email",
  },
  password: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
  },
  role: {
    isString: true,
    trim: true,
    isIn: {
      options: [["owner", "sales", "marketing", "IT"]],
      errorMessage: "Role not valid",
    },
    exists: true,
  },
};

/**
 * @typedef {Object} AdminUpdateSchema
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} role - 'owner' | 'sales' | 'marketing' | 'IT'
 */
const updateAdminSchema = {
  name: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "First Name should be at least 3 chars",
    },
  },
  email: {
    isEmail: true,
    trim: true,
    optional: true,
    errorMessage: "Invalid Email",
  },
  password: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
  },
  role: {
    isString: true,
    trim: true,
    isIn: {
      options: [["sales", "marketing", "IT", "owner"]],
      errorMessage: "Role not valid",
    },
    optional: true,
  },
};

/**
 * @typedef {Object} CreateAnimedadSchema
 * @property {string} name
 * @property {string} name_eng
 * @property {string|null} img_url
 * @property {number} id_property
 */
const createAnimedadSchema = {
  name: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Name should be at least 3 chars",
    },
  },
  name_eng: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "English name should be at least 3 chars",
    },
  },
  img_url: {
    isString: true,
    trim: true,
  },
  id_property: {
    isInt: {
      options: { min: 0 },
    },
    exists: true,
  },
};

module.exports = {
  registerUserSchema,
  registerAdminSchema,
  createAnimedadSchema,
  updateAdminSchema,
};
