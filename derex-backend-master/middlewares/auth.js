const { verifyJwt } = require("../utils");

async function getUserSession (req, res, next) {
  const { token } = req.headers;
  if (!token || token === "undefined" || token === "null" || !String(token).trim()) {
    return res.status(401).json({ error: "Sesion invalida o expirada" });
  }
  try {
    req.session = verifyJwt(token);
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: "Sesion invalida o expirada" });
  }
}

async function getAdminSession (req, res, next) {
  const { token } = req.headers;
  if (!token || token === "undefined" || token === "null" || !String(token).trim()) {
    return res.status(401).json({ error: "Sesion invalida o expirada" });
  }
  try {
    req.session = verifyJwt(token);
    if (!req.session.isAdmin) {
      return res.status(403).json({ error: "El usuario no es Administrador" });
    }
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: "Sesion invalida o expirada" });
  }
}

module.exports = { getUserSession, getAdminSession };
