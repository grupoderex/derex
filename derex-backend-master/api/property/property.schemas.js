const createPropertySchema = {
  isEdgeCertified: {
    optional: { options: { nullable: true } },
    isIn: {
      options: [[1, 0]],
    },
  },
  features: {
    optional: { options: { nullable: true } },
    custom: {
      options: (value) => {
        if (value !== null) {
          if (
            !value.es ||
            !Array.isArray(value.es) ||
            !value.en ||
            !Array.isArray(value.en)
          ) {
            throw new Error(
              "features debe ser un objeto con es y en como arrays de strings"
            );
          }
          if (value.es.length !== value.en.length) {
            throw new Error(
              "features debe tener la misma cantidad de elementos en es y en"
            );
          }
        }
        return true;
      },
    },
  },
  "additional_info[title]": {
    optional: { options: { nullable: true } },
    isObject: true,
  },
  "additional_info[title][en]": {
    optional: { options: { nullable: true } },
    isString: true,
  },
  "additional_info[title][es]": {
    optional: { options: { nullable: true } },
    isString: true,
  },
  "additional_info[description]": {
    optional: { options: { nullable: true } },
    isObject: true,
  },
  "additional_info[description][en]": {
    optional: { options: { nullable: true } },
    isString: true,
  },
  "additional_info[description][es]": {
    optional: { options: { nullable: true } },
    isString: true,
  },
  "additional_info[image_url]": {
    optional: { options: { nullable: true } },
    isString: true,
    trim: true,
  },
  "additional_info[more_info_url]": {
    optional: { options: { nullable: true } },
    isString: true,
    trim: true,
  },
  thumbnail: {
    optional: { options: { nullable: true } },
    isString: true,
    trim: true,
  },
  vertical_floor: {
    optional: { options: { nullable: true } },
    isInt: true,
  },
};
module.exports = {
  createPropertySchema,
};
