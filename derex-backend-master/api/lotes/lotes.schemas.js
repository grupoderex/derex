const {
  isValidEmail,
  isValidName,
  isValidPhone,
  hasNoForbiddenChars,
} = require("../../utils/custom_validations");

const lotesFormSchema = {
  first_name: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "El nombre debe tener entre 2 y 50 caracteres",
    },
    custom: {
      options: isValidName,
      errorMessage: "El nombre solo puede contener letras y espacios",
    },
  },
  last_name: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "El apellido debe tener entre 2 y 50 caracteres",
    },
    custom: {
      options: isValidName,
      errorMessage: "El apellido solo puede contener letras y espacios",
    },
  },
  email: {
    isString: true,
    trim: true,
    exists: true,
    isEmail: {
      errorMessage: "Debe proporcionar un email válido",
    },
    custom: {
      options: isValidEmail,
      errorMessage: "El email solo puede contener letras, números y puntos",
    },
  },
  phone: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: "El número telefónico debe tener 10 dígitos",
    },
    custom: {
      options: isValidPhone,
      errorMessage:
        "El número telefónico solo puede contener dígitos y el símbolo +",
    },
  },
  company: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage:
        "El nombre de la empresa debe tener entre 2 y 100 caracteres",
    },
  },
  state: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "El estado debe tener entre 2 y 50 caracteres",
    },
  },
  square_meters: {
    isString: true,
    trim: true,
  },
  message: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 0, max: 500 },
      errorMessage: "El mensaje no debe exceder los 500 caracteres",
    },
    custom: {
      options: hasNoForbiddenChars,
      errorMessage: "Message contains forbidden characters",
    },
  },
  recaptchaToken: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 10 },
      errorMessage: "El token de reCAPTCHA es obligatorio",
    },
  },
};

module.exports = {
  lotesFormSchema,
};
