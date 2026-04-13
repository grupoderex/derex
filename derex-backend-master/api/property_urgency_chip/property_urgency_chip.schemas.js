const createPropertyUrgencyChipSchema = {
  property_id: {
    isInt: true,
    exists: true,
    toInt: true,
    errorMessage:
      "El ID de la prototipo es obligatorio y debe ser un número entero",
  },
  description_es: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 250 },
      errorMessage:
        "La descripción en español debe tener entre 3 y 250 caracteres",
    },
  },
  description_en: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 250 },
      errorMessage:
        "La descripción en inglés debe tener entre 3 y 250 caracteres",
    },
  },
  notification_text_es: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 250 },
      errorMessage:
        "El texto de notificación en español debe tener entre 3 y 250 caracteres",
    },
  },
  notification_text_en: {
    isString: true,
    trim: true,
    exists: true,
    isLength: {
      options: { min: 3, max: 250 },
      errorMessage:
        "El texto de notificación en inglés debe tener entre 3 y 250 caracteres",
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
  createPropertyUrgencyChipSchema,
  toggleActiveSchema,
};
