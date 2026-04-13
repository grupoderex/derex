const {
  isValidEmail,
  isValidName,
  isValidPhone,
  hasNoForbiddenChars,
} = require("../../utils/custom_validations");

const reservasFormSchema = {
  Nombre: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "El nombre debe tener entre 2 y 50 caracteres",
    },
    custom: {
      options: isValidName,
      errorMessage:
        "El nombre solo puede contener letras, espacios y la letra Ñ",
    },
  },
  Apellido: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "El apellido debe tener entre 2 y 50 caracteres",
    },
    custom: {
      options: isValidName,
      errorMessage:
        "El apellido solo puede contener letras, espacios y la letra Ñ",
    },
  },
  Correo: {
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
  Telefono: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: "El número telefónico debe tener entre 10 y 15 dígitos",
    },
    custom: {
      options: isValidPhone,
      errorMessage:
        "El número telefónico solo puede contener dígitos y el símbolo +",
    },
  },
  InfoTerreno: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 0, max: 200 },
      errorMessage:
        "La información del terreno no debe exceder los 200 caracteres",
    },
  },
  Estado: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: "El estado debe tener entre 2 y 50 caracteres",
    },
  },
  MetrosCuadrados: {
    isString: true,
    trim: true,
    exists: true,
  },
  CodigoPostal: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 5, max: 10 },
      errorMessage: "El código postal debe tener entre 5 y 10 caracteres",
    },
  },
  Hectareas: {
    isString: true,
    trim: true,
    optional: true,
  },
  PrecioPorMetroCuadrado: {
    isString: true,
    trim: true,
    optional: true,
  },
  Descripcion: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 0, max: 500 },
      errorMessage: "La descripción no debe exceder los 500 caracteres",
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
  reservasFormSchema,
};
