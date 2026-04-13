const Recaptcha = require("google-recaptcha");
require("dotenv").config();
const recaptcha = new Recaptcha({
  secret: process.env.RECAPTCHA_SECRET_KEY,
});

// Función que retorna una promesa para verificar el token de Recaptcha
const verifyRecaptcha = (token) => {
  return new Promise((resolve, reject) => {
    recaptcha.verify({response:token}, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

module.exports = {
  verifyRecaptcha,
};
