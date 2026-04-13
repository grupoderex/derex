const create = {
  name: {
    exists: true,
    isString: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "Name should be at most 50 chars",
    },
  },
  value: {
    exists: true,
    isString: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "Value should be at most 50 chars",
    },
  },
  value_en: {
    optional: true,
    isString: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "Value english should be at most 50 chars",
    },
  },
  bold: {
    optional: true,
    isBoolean: true,
    errorMessage: "Bold should be a boolean",
  },
  outline: {
    optional: true,
    isBoolean: true,
    errorMessage: "Outline should be a boolean",
  },
  color: {
    optional: true,
    isBoolean: true,
    errorMessage: "Outline should be a boolean",
  },
};
const upsert = {
  ...create,
  section: {
    exists: true,
    isString: true,
    isLength: {
      options: { max: 50 },
      errorMessage: "Section should be at most 50 chars",
    },
  },
};

const upsertMany = {
  data: {
    in: ["body"],
    isArray: {
      options: { min: 1 },
      errorMessage: "Data debe ser un array con al menos un elemento",
    },
    custom: {
      options: (value) => {
        return value.every((item) => {
          return (
            typeof item.section === "string" &&
            typeof item.name === "string" &&
            typeof item.value === "string" &&
            typeof item.value_en === "string" &&
            typeof item.bold === "boolean" &&
            typeof item.outline === "boolean" &&
            typeof item.color === "boolean"
          );
        });
      },
      errorMessage:
        "Todos los elementos de data deben contener los campos adecuados con los tipos correctos",
    },
  },
  "data.*.section": {
    in: ["body"],
    isString: true,
    errorMessage: "Section debe ser una cadena de texto",
  },
  "data.*.name": {
    in: ["body"],
    isString: true,
    errorMessage: "Name debe ser una cadena de texto",
  },
  "data.*.value": {
    in: ["body"],
    isString: true,
    errorMessage: "Value debe ser una cadena de texto",
  },
  "data.*.value_en": {
    in: ["body"],
    isString: true,
    errorMessage: "Value_en debe ser una cadena de texto",
  },
  "data.*.bold": {
    in: ["body"],
    optional: true,
    isBoolean: true,
    errorMessage: "Bold debe ser un valor booleano",
  },
  "data.*.outline": {
    in: ["body"],
    optional: true,
    isBoolean: true,
    errorMessage: "Outline debe ser un valor booleano",
  },
  "data.*.color": {
    in: ["body"],
    optional: true,
    isBoolean: true,
    errorMessage: "Color debe ser un valor booleano",
  },
};

module.exports = {
  create,
  upsert,
  upsertMany,
};
