const create = {
  index_order: {
    in: ["body"],
    isInt: {
      errorMessage: "index_order debe ser un entero.",
    },
    notEmpty: {
      errorMessage: "index_order no puede estar vacío.",
    },
    exists: true,
  },
  image_url: {
    in: ["body"],
    isURL: {
      errorMessage: "image_url debe ser una URL.",
    },
    notEmpty: {
      errorMessage: "image_url no puede estar vacío.",
    },
    exists: true,
  },
  is_image_left: {
    in: ["body"],
    isBoolean: {
      errorMessage: "is_image_left debe ser un booleano.",
    },
    notEmpty: {
      errorMessage: "is_image_left no puede estar vacío.",
    },
    exists: true,
  },
  content_es: {
    in: ["body"],
    notEmpty: {
      errorMessage: "content_es no puede estar vacío.",
    },
    exists: true,
  },
  content_en: {
    in: ["body"],
    notEmpty: {
      errorMessage: "content_en no puede estar vacío.",
    },
    exists: true,
  },
};

const update = {
  id: {
    in: ["params"],
    isInt: {
      errorMessage: "id debe ser un entero.",
    },
    notEmpty: {
      errorMessage: "id no puede estar vacío.",
    },
  },
  index_order: {
    in: ["body"],
    isInt: {
      errorMessage: "index_order debe ser un entero.",
    },
    notEmpty: {
      errorMessage: "index_order no puede estar vacío.",
    },
    optional: true,
  },
  image_url: {
    in: ["body"],
    isURL: {
      errorMessage: "image_url debe ser una URL.",
    },
    notEmpty: {
      errorMessage: "image_url no puede estar vacío.",
    },
    optional: true,
  },
  is_image_left: {
    in: ["body"],
    isBoolean: {
      errorMessage: "is_image_left debe ser un booleano.",
    },
    notEmpty: {
      errorMessage: "is_image_left no puede estar vacío.",
    },
    optional: true,
  },
  content_es: {
    in: ["body"],
    notEmpty: {
      errorMessage: "content_es no puede estar vacío.",
    },
    optional: true,
  },
  content_en: {
    in: ["body"],
    notEmpty: {
      errorMessage: "content_en no puede estar vacío.",
    },
    optional: true,
  },
};

const upsertMany = {
  data: {
    in: ["body"],
    custom: {
      options: (data) => {
        return (
          Array.isArray(data) &&
          data.length > 0 &&
          data.every((item) => {
            return (
              typeof item.index_order === "number" &&
              typeof item.image_url === "string" &&
              typeof item.is_image_left === "boolean" &&
              typeof item.content_es === "string" &&
              typeof item.content_en === "string"
            );
          })
        );
      },
      errorMessage:
        "Todos los elementos de data deben contener los campos adecuados con los tipos correctos",
    },
  },
};

module.exports = {
  create,
  update,
  upsertMany,
};
