const getPropertyPriceByStateSchema = {
  state_id: {
    in: ["query"],
    isInt: {
      errorMessage: "El state_id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El state_id es requerido",
    },
  },
};

const getPricesListByPropertyIdSchema = {
  property_id: {
    in: ["params"],
    isInt: {
      errorMessage: "El property_id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El property_id es requerido",
    },
  },
};

const upsertScheduledPricesSchema = {
  prices: {
    in: ["body"],
    isArray: {
      errorMessage: "prices debe ser un arreglo",
    },
    exists: {
      errorMessage: "prices es requerido",
    },
  },
  "prices.*.prices_list_property_id": {
    in: ["body"],
    isInt: {
      errorMessage: "prices_list_property_id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "prices_list_property_id es requerido",
    },
  },
  "prices.*.new_price_base": {
    in: ["body"],
    isFloat: {
      errorMessage: "new_price_base debe ser un número decimal",
    },
    optional: { options: { nullable: true } },
    toFloat: true,
  },
  "prices.*.new_price_m2_ext": {
    in: ["body"],
    isFloat: {
      errorMessage: "new_price_m2_ext debe ser un número decimal",
    },
    optional: { options: { nullable: true } },
    toFloat: true,
  },
  "prices.*.effective_datetime": {
    in: ["body"],
    isISO8601: {
      errorMessage:
        "effective_datetime debe ser una fecha y hora válida en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)",
    },
    optional: { options: { nullable: true } },
  },
};

const getBannerScheduleSchema = {
  project_id: {
    in: ["query"],
    isInt: {
      errorMessage: "El project_id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El project_id es requerido",
    },
  },
};

const upsertBannerScheduleSchema = {
  project_id: {
    in: ["body"],
    isInt: {
      errorMessage: "El project_id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El project_id es requerido",
    },
  },
  new_banner_url: {
    in: ["body"],
    isString: {
      errorMessage: "new_banner_url debe ser una cadena de texto",
    },
    optional: { options: { nullable: true } },
  },
  effective_datetime: {
    in: ["body"],
    isISO8601: {
      errorMessage:
        "effective_datetime debe ser una fecha y hora válida en formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)",
    },
    optional: { options: { nullable: true } },
  },
};

module.exports = {
  getPropertyPriceByStateSchema,
  upsertScheduledPricesSchema,
  getBannerScheduleSchema,
  upsertBannerScheduleSchema,
  getPricesListByPropertyIdSchema,
};
