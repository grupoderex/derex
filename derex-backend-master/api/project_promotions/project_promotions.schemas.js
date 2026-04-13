const createProjectPromotionSchema = {
  project_id: {
    isInt: true,
    exists: true,
    toInt: true,
    errorMessage:
      "El ID del proyecto es obligatorio y debe ser un número entero",
  },
  title_es: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: "El título en español debe tener entre 3 y 50 caracteres",
    },
  },
  title_en: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 50 },
      errorMessage: "El título en inglés debe tener entre 3 y 50 caracteres",
    },
  },
  description_es: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 400 },
      errorMessage:
        "La descripción en español debe tener entre 3 y 400 caracteres",
    },
  },
  description_en: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 400 },
      errorMessage:
        "La descripción en inglés debe tener entre 3 y 400 caracteres",
    },
  },
  promo_image: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 1 },
      errorMessage: "La imagen promocional es obligatoria",
    },
  },
  is_active: {
    isBoolean: true,
    optional: true,
    toBoolean: true,
  },
};

const toggleActiveSchema = {
  is_active: {
    isBoolean: true,
    exists: true,
    toBoolean: true,
    errorMessage: "El estado de activación debe ser un valor booleano",
  },
};

module.exports = {
  createProjectPromotionSchema,
  toggleActiveSchema,
};
