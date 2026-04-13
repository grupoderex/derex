const express = require("express");
const router = express.Router();
const LotesForm = require("./lotes.sql");
const recaptcha = require("../../utils/recaptcha");
const { sendEmail } = require("../../utils/email");
require("dotenv").config();
const { checkSchema } = require("express-validator");
const { lotesFormSchema } = require("./lotes.schemas");
const { validationMiddleware } = require("../../middlewares");

// Ruta para crear un nuevo lote
router.post(
  "/lotes",
  checkSchema(lotesFormSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        company,
        state,
        square_meters,
        message,
        recaptchaToken,
      } = req.body;

      const recaptchaResponse = await recaptcha.verifyRecaptcha(recaptchaToken);

      // if (!recaptchaResponse.success) {
      //   return res.status(400).json({
      //     success: false,
      //     error: "Fallo en la verificación de Recaptcha",
      //   });
      // }

      await LotesForm.create({
        first_name,
        last_name,
        email,
        phone,
        company,
        state,
        square_meters,
        message,
      });

      // Construye la cadena deseada con los campos traducidos
      const emailText = `Hola, un cliente ha llenado el formulario de lotes comerciales con la siguiente informacion:
        
Nombre: ${first_name} ${last_name}
Email: ${email}
Teléfono: ${phone}
Compañía: ${company}
Estado: ${state}
Metros Cuadrados: ${square_meters}
Mensaje: ${message}

`;

      // Envía el correo electrónico con la cadena construida
      await sendEmail(
        process.env.EMAIL_LOTES,
        "Información de Lotes Comerciales",
        emailText
      );

      return res.json({ success: true });
    } catch (e) {
      console.log("Error al crear solicitud de contacto", e);
      return res.status(500).json({
        error: "Error al procesar el formulario de Lotes Comerciales",
      });
    }
  }
);

// Ruta para obtener todos los lotes
router.get("/lotes", async (req, res) => {
  const lotes = await LotesForm.getAll();
  return res.json(lotes);
});

// Ruta para obtener un lote por ID
router.get("/lotes/:id", async (req, res) => {
  const loteId = req.params.id;
  const lote = await LotesForm.getById(loteId);
  return res.json(lote);
});

// Ruta para actualizar un lote por ID
router.put("/lotes/:id", async (req, res) => {
  const loteId = req.params.id;
  const updatedData = req.body;
  const result = await LotesForm.update(loteId, updatedData);
  return res.json(result);
});

// Ruta para eliminar un lote por ID
router.delete("/lotes/:id", async (req, res) => {
  const loteId = req.params.id;
  const result = await LotesForm.delete(loteId);
  return res.json(result);
});

module.exports = router;
