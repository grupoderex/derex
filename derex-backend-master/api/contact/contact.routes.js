const express = require("express");

const router = express.Router();
const { checkSchema } = require("express-validator");
const { validationMiddleware } = require("../../middlewares");
const recaptcha = require("../../utils/recaptcha");
const { sendEmail, assertEmailConfig } = require("../../utils/email");
const {
  homeFormSchema,
  contactFormSchema,
  projectFormSchema,
} = require("./contact.schemas");

const DEREX_CONTACT_EMAIL = "reno7882@gmail.com";
const DEREX_CONTACT_CC = ["rct@javer.com.mx"];

function ensureEmailConfig () {
  assertEmailConfig();
}

function isRecaptchaBypassEnabled () {
  return String(process.env.RECAPTCHA_BYPASS || "").toLowerCase() === "true";
}

async function validateRecaptcha (token) {
  if (!token) {
    return true;
  }

  if (isRecaptchaBypassEnabled()) {
    return true;
  }

  const recaptchaResponse = await recaptcha.verifyRecaptcha(token);

  if (!recaptchaResponse?.success) {
    const errorCodes = Array.isArray(recaptchaResponse?.["error-codes"])
      ? recaptchaResponse["error-codes"].join(",")
      : "unknown";
    throw new Error(`Recaptcha verification failed: ${errorCodes}`);
  }

  return true;
}

function formatContactEmailText (title, fields) {
  const content = fields
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `Hola, se ha recibido una nueva solicitud desde ${title}.\n\n${content}\n`;
}

async function sendContactEmail (subject, bodyText) {
  const result = await sendEmail(
    DEREX_CONTACT_EMAIL,
    subject,
    bodyText,
    DEREX_CONTACT_CC
  );

  const accepted = result?.accepted ?? [];
  const rejected = result?.rejected ?? [];

  console.info("Contact email delivery report", {
    messageId: result?.messageId,
    accepted,
    rejected,
    response: result?.response,
  });

  const rejectedSet = new Set(rejected.map((email) => String(email).toLowerCase()));
  const ccFallbackRecipients = DEREX_CONTACT_CC.filter(
    (email) => !accepted.includes(email) || rejectedSet.has(email.toLowerCase())
  );

  if (ccFallbackRecipients.length > 0) {
    await sendEmail(ccFallbackRecipients, `[Copia] ${subject}`, bodyText);
    console.warn("CC fallback applied for contact email", {
      recipients: ccFallbackRecipients,
    });
  }

  return result;
}

/**
 * POST /contact/submit
 */
router.post(
  "/submit",
  checkSchema(contactFormSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const values = req.body;
      ensureEmailConfig();
      await validateRecaptcha(values.recaptcha);

      await sendContactEmail(
        "Formulario de contacto",
        formatContactEmailText("Contacto", [
          ["Nombre", `${values.firstName} ${values.lastName}`.trim()],
          ["Email", values.email],
          ["Teléfono", values.phone],
          ["Fecha de nacimiento", values.birthDate],
          ["Desarrollo", values.development],
          ["Tipo de crédito", values.typeOfCredit],
          ["Mensaje", values.message],
        ])
      );

      res.status(200).json({
        success: true,
        message: "Contact form submitted successfully",
      });
    } catch (error) {
      if (
        String(error?.message || "").includes("Failed to verify") ||
        String(error?.message || "").includes("Recaptcha verification failed")
      ) {
        return res.status(400).json({
          success: false,
          message: "Fallo en la verificacion de Recaptcha",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }

      console.error("Error sending contact form email:", {
        error: error.message,
        stack: error.stack,
        email: req.body?.email,
        timestamp: new Date().toISOString(),
      });

      // Responder con error pero sin exponer detalles internos
      res.status(500).json({
        success: false,
        message:
          "There was an error processing your request. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

/**
 * POST /contact/home/submit
 */
router.post(
  "/home/submit",
  checkSchema(homeFormSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const values = req.body;
      ensureEmailConfig();
      await validateRecaptcha(values.recaptcha);

      await sendContactEmail(
        "Formulario Home",
        formatContactEmailText("Home", [
          ["Nombre", `${values.firstName} ${values.lastName}`.trim()],
          ["Email", values.email],
          ["Teléfono", values.phone],
          ["Estado de interés", values.state],
          ["Mensaje", values.message],
        ])
      );

      res.status(200).json({
        success: true,
        message: "Home form submitted successfully",
      });
    } catch (error) {
      if (
        String(error?.message || "").includes("Failed to verify") ||
        String(error?.message || "").includes("Recaptcha verification failed")
      ) {
        return res.status(400).json({
          success: false,
          message: "Fallo en la verificacion de Recaptcha",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }

      console.error("Error sending home form email:", {
        error: error.message,
        stack: error.stack,
        email: req.body?.email,
        timestamp: new Date().toISOString(),
      });

      // Responder con error pero sin exponer detalles internos
      res.status(500).json({
        success: false,
        message:
          "There was an error processing your request. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

/**
 * POST /contact/project/submit
 */
router.post(
  "/project/submit",
  checkSchema(projectFormSchema, ["body"]),
  validationMiddleware,
  async (req, res) => {
    try {
      const values = req.body;
      ensureEmailConfig();
      await validateRecaptcha(values.recaptcha);

      await sendContactEmail(
        "Formulario Desarrollo/Propiedad",
        formatContactEmailText("Desarrollo o Propiedad", [
          ["Nombre", `${values.firstName} ${values.lastName}`.trim()],
          ["Email", values.email],
          ["Teléfono", values.phone],
          ["Fecha de nacimiento", values.birthDate],
          ["Desarrollo", values.development],
          ["Tipo de crédito", values.typeOfCredit],
          ["Mensaje", values.message],
        ])
      );

      res.status(200).json({
        success: true,
        message: "Desarrollo form submitted successfully",
      });
    } catch (error) {
      if (
        String(error?.message || "").includes("Failed to verify") ||
        String(error?.message || "").includes("Recaptcha verification failed")
      ) {
        return res.status(400).json({
          success: false,
          message: "Fallo en la verificacion de Recaptcha",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }

      console.error("Error sending project form email:", {
        error: error.message,
        stack: error.stack,
        email: req.body?.email,
        timestamp: new Date().toISOString(),
      });

      // Responder con error pero sin exponer detalles internos
      res.status(500).json({
        success: false,
        message:
          "There was an error processing your request. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

module.exports = router;
