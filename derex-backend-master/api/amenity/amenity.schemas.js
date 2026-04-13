const createAmenitySchema = {
  name: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Amenity Name should be at least 3 chars",
    },
  },
  name_eng: {
    isString: true,
    trim: true,
    optional: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Amenity Name (English) should be at least 3 chars",
    },
  },
  id_project: {
    isInt: true,
    exists: true,
    toInt: true,
  },
  img_url: {
    isString: true,
    trim: true,
    optional: true,
  },
  order: {
    isInt: true,
    optional: true,
    toInt: true,
  },
};

module.exports = {
  createAmenitySchema,
};
