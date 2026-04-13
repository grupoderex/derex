const getPricesListByIdSchema = {
  id: {
    in: ["params"],
    isInt: {
      errorMessage: "El id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El id es requerido",
    },
  },
};

const getPricesListByPropertyIdSchema = {
  id_property: {
    in: ["params"],
    isInt: {
      errorMessage: "El id_property debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El id_property es requerido",
    },
  },
};

const createPricesListSchema = {
  id_property: {
    in: ["body"],
    isInt: {
      errorMessage: "El id_property debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El id_property es requerido",
    },
  },
  price_base: {
    in: ["body"],
    isFloat: {
      errorMessage: "El price_base debe ser un número decimal",
    },
    toFloat: true,
    optional: { options: { nullable: true } },
  },
  price_m2_ext: {
    in: ["body"],
    isFloat: {
      errorMessage: "El price_m2_ext debe ser un número decimal",
    },
    toFloat: true,
    optional: { options: { nullable: true } },
  },
};

const updatePricesListSchema = {
  id: {
    in: ["params"],
    isInt: {
      errorMessage: "El id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El id es requerido",
    },
  },
  ...createPricesListSchema,
};

const updatePricesListByPropertyIdSchema = {
  id_property: {
    in: ["params"],
    isInt: {
      errorMessage: "El id_property debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El id_property es requerido",
    },
  },
  price_base: {
    in: ["body"],
    isFloat: {
      errorMessage: "El price_base debe ser un número decimal",
    },
    toFloat: true,
    optional: { options: { nullable: true } },
  },
  price_m2_ext: {
    in: ["body"],
    isFloat: {
      errorMessage: "El price_m2_ext debe ser un número decimal",
    },
    toFloat: true,
    optional: { options: { nullable: true } },
  },
};

const deletePricesListSchema = {
  id: {
    in: ["params"],
    isInt: {
      errorMessage: "El id debe ser un número entero",
    },
    toInt: true,
    exists: {
      errorMessage: "El id es requerido",
    },
  },
};

module.exports = {
  getPricesListByIdSchema,
  getPricesListByPropertyIdSchema,
  createPricesListSchema,
  updatePricesListSchema,
  updatePricesListByPropertyIdSchema,
  deletePricesListSchema,
};
