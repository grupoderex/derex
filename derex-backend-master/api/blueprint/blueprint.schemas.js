const createBlueprintSchema = {
  id_property: {
    isInt: true,
    exists: true,
    toInt: true,
    errorMessage:
      "El ID de la propiedad es obligatorio y debe ser un número entero",
  },
  image_url: {
    isString: true,
    trim: true,
    exists: true,
    isURL: {
      options: {
        require_tld: false,
      },
    },
    errorMessage:
      "La URL de la imagen es obligatoria y debe ser una URL válida",
  },
  image_alt_text: {
    isString: true,
    trim: true,
    exists: true,
    errorMessage: "El texto alternativo de la imagen es obligatorio",
  },
  characteristics_architectural_plans: {
    isArray: true,
    optional: true,
    errorMessage:
      "Las características de los planos arquitectónicos deben ser un array",
  },
  title: {
    isObject: true,
    optional: true,
    errorMessage: "El título debe ser un objeto",
  },
  /* TODO: Descomentar cuando se implemente el orden
  orden: {
    isInt: true,
    exists: true,
    toInt: true,
    errorMessage: "El orden es obligatorio y debe ser un número entero",
  },
  */
};

const updateBlueprintSchema = {
  image_url: {
    isString: true,
    trim: true,
    optional: true,
    isURL: {
      options: {
        require_tld: false,
      },
    },
    errorMessage: "La URL de la imagen debe ser una URL válida",
  },
  image_alt_text: {
    isString: true,
    trim: true,
    optional: true,
    errorMessage: "El texto alternativo de la imagen es obligatorio",
  },
  characteristics_architectural_plans: {
    isArray: true,
    optional: true,
    errorMessage:
      "Las características de los planos arquitectónicos deben ser un array",
  },
  title: {
    isObject: true,
    optional: true,
    errorMessage: "El título debe ser un objeto",
  },
  /* TODO: Descomentar cuando se implemente el orden
  orden: {
    isInt: true,
    exists: true,
    toInt: true,
    errorMessage: "El orden es obligatorio y debe ser un número entero",
  },
  */
};

module.exports = {
  createBlueprintSchema,
  updateBlueprintSchema,
};
