const { validationResult } = require("express-validator");

function validationMiddleware(req, res, next) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({
      error: "Error en la validacion de campos",
      stack: validationErrors.mapped(),
    });
  }
  next();
}

module.exports = validationMiddleware;
