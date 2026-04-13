/**
 * @typedef {Object} LoginUserSchema
 * @property {string} email
 * @property {string} password
 */
const loginUserSchema = {
  email: {
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
};

/**
 * @typedef {Object} TokenHeadersSchema
 * @property {string} token
 */
const tokenHeadersSchema = {
  token: {
    isString: true,
    trim: true,
    exists: true,
  },
};

module.exports = { loginUserSchema, tokenHeadersSchema };
