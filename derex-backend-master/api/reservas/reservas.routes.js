const express = require("express");
const router = express.Router();
const ReservasForm = require("./reservas.sql");
const { sendEmail } = require("../../utils/email");
const recaptcha = require("../../utils/recaptcha");
require("dotenv").config();
const { checkSchema, param } = require("express-validator");
const { reservasFormSchema } = require("./reservas.schema");

// Ruta para crear una nueva reserva
router.post("/reservas", checkSchema(reservasFormSchema), async (req, res) => {
  try {
    const {
      Nombre,
      Apellido,
      Correo,
      Telefono,
      InfoTerreno,
      Estado,
      MetrosCuadrados,
      CodigoPostal,
      Hectareas,
      PrecioPorMetroCuadrado,
      Descripcion,
      recaptchaToken,
    } = req.body;

    await ReservasForm.create({
      Nombre,
      Apellido,
      Correo,
      Telefono,
      InfoTerreno,
      Estado,
      MetrosCuadrados,
      CodigoPostal,
      Hectareas,
      PrecioPorMetroCuadrado,
      Descripcion,
    });

    // Construye la cadena deseada con los campos traducidos
    const emailText = `Hola, un cliente ha llenado el formulario de reserva territorial con la siguiente informacion:
        
Nombre: ${Nombre} ${Apellido}
Teléfono: ${Telefono}
Email: ${Correo}
Informacion de Terreno: ${InfoTerreno},
Estado: ${Estado},
Metros Cuadrados: ${MetrosCuadrados},
Codigo Postal: ${CodigoPostal},
Hectareas: ${Hectareas},
Precio por Metro Cuadrado: ${PrecioPorMetroCuadrado},
Descripcion: ${Descripcion}

`;

    // Envía el correo electrónico con la cadena construida
    await sendEmail(
      process.env.EMAIL_RESERVAS,
      "Información de Reservas Territoriales",
      emailText
    );

    return res.json({ success: true });
  } catch (e) {
    console.log("Error al crear reserva", e);
    return res.status(500).json({
      error: "Error al procesar el formulario de Reservas Territoriales",
    });
  }
});

// Ruta para obtener todas las reservas
router.get("/reservas", async (req, res) => {
  const reservas = await ReservasForm.getAll();
  return res.json(reservas);
});

// Ruta para obtener una reserva por ID
router.get("/reservas/:id", async (req, res) => {
  const reservaId = req.params.id;
  const reserva = await ReservasForm.getById(reservaId);
  return res.json(reserva);
});

// Ruta para actualizar una reserva por ID
router.put("/reservas/:id", async (req, res) => {
  const reservaId = req.params.id;
  const updatedData = req.body;
  const result = await ReservasForm.update(reservaId, updatedData);
  return res.json(result);
});

// Ruta para eliminar una reserva por ID
router.delete("/reservas/:id", async (req, res) => {
  const reservaId = req.params.id;
  const result = await ReservasForm.delete(reservaId);
  return res.json(result);
});

module.exports = router;
