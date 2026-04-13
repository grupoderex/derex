/**
 * Permite solo letras, espacios y la letra Ñ/ñ en nombres y apellidos.
 * @param {string} value
 * @returns {boolean}
 */
function isValidName(value) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(value);
}

/**
 * Permite solo números y el símbolo + en campos numéricos.
 * @param {string} value
 * @returns {boolean}
 */
function isValidPhone(value) {
  return /^[\d+]+$/.test(value);
}

/**
 * Valida que el correo contenga un solo @, varios puntos y ningún otro caracter especial.
 * Permite también -, _, y +.
 * @param {string} value
 * @returns {boolean}
 */
function isValidEmail(value) {
  return /^[A-Za-z0-9._+-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,}$/.test(value);
}

/**
 * Valida que el valor NO contenga ninguno de los siguientes caracteres:
 * < > " ' ; -- { } [ ] / \ ` % - + * = &
 * @param {string} value
 * @returns {boolean}
 */
function hasNoForbiddenChars(value) {
  const forbiddenPattern = /[<>"';{}\[\]\/\\`%\-+*=&]|--/;
  return !forbiddenPattern.test(value);
}

module.exports = {
  isValidName,
  isValidPhone,
  isValidEmail,
  hasNoForbiddenChars,
};
