const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const { sendEmail, EmailSender } = require("../../utils/email");
const {
  customer_support_mjml_template,
} = require("../../lib/mjml/mjml_templates");
const mjml2html = require("mjml");
const { createCustomerSupport } = require("./customer_support.schemas");
const { validationMiddleware, getAdminSession } = require("../../middlewares");

/**
 * @type {CustomerSupportSql.CustomerSupportService}
 */
const CustomerSupport = require("./customer_support.sql");

router.post(
  "/",
  checkSchema(createCustomerSupport),
  validationMiddleware,
  async (req, res) => {
    try {
      /**
       * @type {CustomerSupportSchema.CreateCustomerSupportSchema}
       */
      const body = req.body;
      //const customerSupport = await CustomerSupport.create(body);

      const templateVars = [
        {
          name: "{{nombre}}",
          value: body.first_name,
        },
        {
          name: "{{apellido}}",
          value: body.last_name,
        },
        {
          name: "{{correo}}",
          value: body.email,
        },
        {
          name: "{{telefono}}",
          value: body.phone,
        },
        {
          name: "{{fraccionamiento}}",
          value: body.acquired_subdivision,
        },
        {
          name: "{{calle_numero}}",
          value: `${body.street_address}`,
        },
        {
          name: "{{manzana}}",
          value: body.block,
        },
        {
          name: "{{lote}}",
          value: body.lot,
        },
        {
          name: "{{asunto}}",
          value: body.subject,
        },
        {
          name: "{{mensaje}}",
          value: body.message,
        },
      ];

      let mjml = customer_support_mjml_template;

      templateVars.forEach(
        ({ name, value }) =>
          (mjml = mjml.replace(new RegExp(name, "g"), value)),
      );

      const html = mjml2html(mjml).html;

      const cc = [
        process.env.EMAIL_ATENCION_CLIENTE_CC_1,
        process.env.EMAIL_ATENCION_CLIENTE_CC_2,
        process.env.EMAIL_ATENCION_CLIENTE_CC_3,
        process.env.EMAIL_ATENCION_CLIENTE_CC_4,
        process.env.EMAIL_ATENCION_CLIENTE_CC_5,
      ].filter(Boolean);
      const bcc = [
        process.env.EMAIL_ATENCION_CLIENTE_CCO_1,
        process.env.EMAIL_ATENCION_CLIENTE_CCO_2,
      ].filter(Boolean);

      if (process.env.EMAIL_ATENCION_CLIENTE) {
        await sendEmail(
          process.env.EMAIL_ATENCION_CLIENTE,
          "Soporte al Cliente - Javer",
          html,
          cc,
          bcc,
          false,
          EmailSender.customerSupport,
        );
      }

      return res.json({
        data: {},
        message: "Customer support creado.",
      });
    } catch (error) {
      console.error("Error al crear customer support:", error);
      return res
        .status(500)
        .json({ error: "Error al crear customer support." });
    }
  },
);

router.get("/", getAdminSession, async (req, res) => {
  try {
    const customerSupport = await CustomerSupport.getAll();
    return res.json({
      data: customerSupport,
      message: "Customer support obtenidos.",
    });
  } catch (error) {
    console.error("Error al obtener customer support:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener customer support." });
  }
});

router.get("/id/:id", getAdminSession, async (req, res) => {
  const customerSupportId = parseInt(req.params.id);
  try {
    const customerSupport = await CustomerSupport.getById(customerSupportId);
    return res.json({
      data: customerSupport,
    });
  } catch (error) {
    console.error("Error al obtener customer support:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener customer support por ID." });
  }
});

module.exports = router;
