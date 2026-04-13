const {
  isValidEmail,
  isValidName,
  isValidPhone,
  hasNoForbiddenChars,
} = require("../../utils/custom_validations");

const createFutureProjectSchema = {
  main_image: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "La imagen principal es obligatoria",
    },
  },
  main_image_alt: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage:
        "El texto alternativo de la imagen debe tener entre 3 y 50 caracteres",
    },
  },
  secondary_image: {
    isString: true,
    trim: true,
    optional: true,
  },
  secondary_image_alt: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage:
        "El texto alternativo de la imagen debe tener entre 3 y 50 caracteres",
    },
  },
  name: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 150 },
      errorMessage:
        "El nombre del proyecto debe tener entre 3 y 150 caracteres",
    },
  },
  state_id: {
    isInt: true,
    optional: true,
    toInt: true,
  },
  city_id: {
    isInt: true,
    optional: true,
    toInt: true,
  },
  launch_date: {
    optional: true,
  },
  contact_phone: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: "El número telefónico debe tener 10 dígitos",
    },
  },
  contact_email: {
    isString: true,
    trim: true,
    exists: true,
    isEmail: {
      errorMessage: "Debe proporcionar un email válido",
    },
  },
  type: {
    isString: true,
    trim: true,
    exists: true,
    isIn: {
      options: [["vertical", "horizontal", "mixed"]],
      errorMessage: "El tipo debe ser vertical, horizontal o mixed",
    },
  },
  unique_url: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 100 },
      errorMessage: "La URL única debe tener entre 3 y 100 caracteres",
    },
  },
};

const createFutureProjectAmenitySchema = {
  id_future_project: {
    isInt: true,
    exists: true,
    toInt: true,
  },
  name_es: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 3 },
      errorMessage:
        "El nombre de la amenidad en español debe tener al menos 3 caracteres",
    },
  },
  name_en: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 3 },
      errorMessage:
        "El nombre de la amenidad en inglés debe tener al menos 3 caracteres",
    },
  },
};

const validateUniqueUrl = {
  unique_url: {
    isString: true,
    trim: true,
    exists: true,
  },
  project_id: {
    isInt: true,
    optional: true,
    toInt: true,
  },
};

const contactFutureProjectSchema = {
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
  gender: {
    isString: true,
    trim: true,
    exists: true,
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
      options: { min: 10, max: 15 },
      errorMessage: "El número telefónico debe tener entre 10 y 15 dígitos",
    },
    custom: {
      options: isValidPhone,
      errorMessage:
        "El número telefónico solo puede contener dígitos y el símbolo +",
    },
  },
  message: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 5, max: 500 },
      errorMessage: "El mensaje debe tener entre 5 y 500 caracteres",
    },
    custom: {
      options: hasNoForbiddenChars,
      errorMessage: "Message contains forbidden characters",
    },
  },
  recaptcha: {
    isString: true,
    trim: true,
    exists: true,
  },
};

module.exports = {
  createFutureProjectSchema,
  createFutureProjectAmenitySchema,
  validateUniqueUrl,
  contactFutureProjectSchema,
};
