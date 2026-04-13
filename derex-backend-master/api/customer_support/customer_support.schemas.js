const {
  isValidEmail,
  isValidName,
  isValidPhone,
  hasNoForbiddenChars,
} = require("../../utils/custom_validations");

const createCustomerSupport = {
  first_name: {
    exists: true,
    isString: true,
    errorMessage: "First Name should be a string",
    custom: {
      options: isValidName,
      errorMessage: "First Name should only contain letters and spaces",
    },
  },
  last_name: {
    exists: true,
    isString: true,
    errorMessage: "Last Name should be a string",
    custom: {
      options: isValidName,
      errorMessage: "Last Name should only contain letters and spaces",
    },
  },
  email: {
    exists: true,
    errorMessage: "Email should be a valid email",
    custom: {
      options: isValidEmail,
      errorMessage: "Email should only contain letters, numbers, and dots",
    },
  },
  phone: {
    exists: true,
    isString: true,
    errorMessage: "Phone should be a string",
    custom: {
      options: isValidPhone,
      errorMessage: "Phone should only contain numbers and the + symbol",
    },
  },

  acquired_subdivision: {
    exists: true,
    isString: true,
    errorMessage: "Acquired subdivision should be a string",
  },
  street_address: {
    exists: true,
    isString: true,
    errorMessage: "Street Address should be a string",
  },
  street_number: {
    exists: true,
    isString: true,
    errorMessage: "Street Number should be a string",
  },
  block: {
    exists: true,
    isString: true,
    errorMessage: "Block should be a string",
  },
  lot: {
    exists: true,
    isString: true,
    errorMessage: "Lot should be a string",
  },
  subject: {
    exists: true,
    isString: true,
    errorMessage: "Subject should be a string",
  },
  message: {
    exists: true,
    isString: true,
    errorMessage: "Message should be a string",
    custom: {
      options: hasNoForbiddenChars,
      errorMessage: "Message contains forbidden characters",
    },
  },
};

module.exports = {
  createCustomerSupport,
};
