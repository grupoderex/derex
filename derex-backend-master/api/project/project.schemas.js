const { options } = require("./project.routes");

const createProjectSchema = {
  live_the_experience_description: {
    optional: { options: { nullable: true } },
    isString: true,
  },
  live_the_experience_description_en: {
    optional: { options: { nullable: true } },
    isString: true,
  },
  live_the_experience_url: {
    optional: { options: { nullable: true } },
    isString: true,
    trim: true,
  },
  wase_link_map: {
    isString: true,
    trim: true,
    exists: true,
    isURL: {
      errorMessage: "Wase Link Map should be a valid URL",
    },
  },
  additional_info: {
    optional: { options: { nullable: true } },
    isObject: true,
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
  "contact_form[phone_number]": {
    exists: true,
    isString: true,
  },
  "contact_form[opening_hours]": {
    exists: true,
    isObject: true,
  },
  "contact_form[opening_hours][es]": {
    exists: true,
    isString: true,
  },
  "contact_form[opening_hours][en]": {
    exists: true,
    isString: true,
  },
  type_orientation: {
    exists: true,
    isString: true,
    isIn: {
      options: [["horizontal", "vertical", "mixed", "previous"]],
      errorMessage:
        "Type Orientation not valid",
    },
  },
  vertical_data: {
    optional: { options: { nullable: true } },
    isObject: true,
  },
  "vertical_data[apartments]": {
    optional: { options: { nullable: true } },
    isInt: {
      options: { min: 1 },
      errorMessage: "Apartments should be at least 1",
    },
  },
  "vertical_data[floors]": {
    optional: { options: { nullable: true } },
    isInt: {
      options: { min: 1 },
      errorMessage: "Floors should be at least 1",
    },
  },
  thumbnail: {
    optional: { options: { nullable: true } },
    isString: true,
    trim: true,
  },
  is_presale: {
    optional: { options: { nullable: true } },
    isBoolean: {
      errorMessage: "new_tab debe ser un booleano.",
    },
  },
  document_url: {
    optional: { options: { nullable: true } },
    isString: true,
    trim: true,
  },
  url_salesforce: {
    optional: { options: { nullable: true } },
    isString: true,
    trim: true,

  },
};
module.exports = {
  createProjectSchema,
};
