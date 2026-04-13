const {
  isValidEmail,
  isValidName,
  isValidPhone,
  hasNoForbiddenChars,
} = require("../../utils/custom_validations");

const homeFormSchema = {
  firstName: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "First name should be between 2 and 50 characters",
    },
    errorMessage: "First name is required",
    custom: {
      options: (value) => isValidName(value),
      errorMessage: "First name is not valid",
    },
  },
  lastName: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Last name should be between 2 and 50 characters",
    },
    errorMessage: "Last name is required",
    custom: {
      options: (value) => isValidName(value),
      errorMessage: "Last name is not valid",
    },
  },
  email: {
    isEmail: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Please provide a valid email address",
    custom: {
      options: isValidEmail,
      errorMessage: "Email is not valid",
    },
  },
  phone: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: "Phone number should be between 10 and 15 characters",
    },
    errorMessage: "Phone number is required",
    custom: {
      options: isValidPhone,
      errorMessage: "Phone number is not valid",
    },
  },
  state: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "State should be between 2 and 50 characters",
    },
    errorMessage: "State is required",
  },
  message: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 10, max: 1000 },
      errorMessage: "Message should be between 10 and 1000 characters",
    },
    custom: {
      options: hasNoForbiddenChars,
      errorMessage: "Message contains forbidden characters",
    },
    errorMessage: "Message is required",
  },
  recaptcha: {
    isString: true,
    trim: true,
    optional: { options: { nullable: true } },
    errorMessage: "Invalid recaptcha token",
  },
};

const projectFormSchema = {
  firstName: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "First name should be between 2 and 50 characters",
    },
    errorMessage: "First name is required",
    custom: {
      options: (value) => isValidName(value),
      errorMessage: "First name is not valid",
    },
  },
  lastName: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Last name should be between 2 and 50 characters",
    },
    errorMessage: "Last name is required",
    custom: {
      options: (value) => isValidName(value),
      errorMessage: "Last name is not valid",
    },
  },
  email: {
    isEmail: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Please provide a valid email address",
    custom: {
      options: isValidEmail,
      errorMessage: "Email is not valid",
    },
  },
  birthDate: {
    isString: true,
    trim: true,
    isDate: {
      errorMessage: "Please provide a valid date",
    },
  },
  phone: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: "Phone number should be between 10 and 15 characters",
    },
    errorMessage: "Phone number is required",
    custom: {
      options: isValidPhone,
      errorMessage: "Phone number is not valid",
    },
  },
  development: {
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Development type is required",
  },
  typeOfCredit: {
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Type of credit is required",
  },
  message: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 10, max: 1000 },
      errorMessage: "Message should be between 10 and 1000 characters",
    },
    errorMessage: "Message is required",
  },
  recaptcha: {
    isString: true,
    trim: true,
    optional: { options: { nullable: true } },
    errorMessage: "Invalid recaptcha token",
  },
};

const contactFormSchema = {
  firstName: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "First name should be between 2 and 50 characters",
    },
    errorMessage: "First name is required",
    custom: {
      options: (value) => isValidName(value),
      errorMessage: "First name is not valid",
    },
  },
  lastName: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "Last name should be between 2 and 50 characters",
    },
    errorMessage: "Last name is required",
    custom: {
      options: (value) => isValidName(value),
      errorMessage: "Last name is not valid",
    },
  },
  email: {
    isEmail: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Please provide a valid email address",
    custom: {
      options: isValidEmail,
      errorMessage: "Email is not valid",
    },
  },
  birthDate: {
    isString: true,
    trim: true,
    isDate: {
      errorMessage: "Please provide a valid date",
    },
  },
  phone: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: "Phone number should be between 10 and 15 characters",
    },
    errorMessage: "Phone number is required",
    custom: {
      options: isValidPhone,
      errorMessage: "Phone number is not valid",
    },
  },
  development: {
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Development type is required",
  },
  typeOfCredit: {
    isString: true,
    trim: true,
    notEmpty: true,
    errorMessage: "Type of credit is required",
  },
  message: {
    isString: true,
    trim: true,
    notEmpty: true,
    isLength: {
      options: { min: 10, max: 1000 },
      errorMessage: "Message should be between 10 and 1000 characters",
    },
    errorMessage: "Message is required",
  },
  recaptcha: {
    isString: true,
    trim: true,
    optional: { options: { nullable: true } },
    errorMessage: "Invalid recaptcha token",
  },
};

module.exports = {
  homeFormSchema,
  projectFormSchema,
  contactFormSchema,
};
