const createStateSchema = {
  name: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "State Name should be at least 3 chars",
    },
  },
};

const updateStateSchema = {
  name: {
    exists: true,
    isString: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "State Name should be at least 3 chars",
    },
  },
  active: {
    exists: true,
    isInt: true,
    isIn: {
      options: [[0, 1]],
      errorMessage: "Active should be 0 or 1",
    },
    toInt: true,
  },
};

module.exports = {
  createStateSchema,
  updateStateSchema,
};
