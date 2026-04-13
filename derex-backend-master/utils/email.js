const nodemailer = require("nodemailer");

const EmailSender = {
  lots: "lots",
  customerSupport: "customerSupport",
  futureProjects: "futureProjects",
};

const EmailProvider = {
  microsoft: "microsoft",
  gmail: "gmail",
};

const transportPresets = {
  [EmailProvider.microsoft]: {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
  },
  [EmailProvider.gmail]: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  },
};

const senderCredentialEnv = {
  [EmailSender.lots]: {
    legacyUserKey: "EMAIL_USER",
    legacyPassKey: "EMAIL_PASS",
  },
  [EmailSender.customerSupport]: {
    legacyUserKey: "EMAIL_ATENCION_CLIENTE_USER",
    legacyPassKey: "EMAIL_ATENCION_CLIENTE_PASS",
  },
  [EmailSender.futureProjects]: {
    legacyUserKey: "EMAIL_PROXIMOS_LANZAMIENTOS_USER",
    legacyPassKey: "EMAIL_PROXIMOS_LANZAMIENTOS_PASS",
  },
};

const readEnv = (key) => {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : "";
};

const getEmailProvider = () => {
  const provider = readEnv("EMAIL_PROVIDER").toLowerCase();
  return provider === EmailProvider.gmail
    ? EmailProvider.gmail
    : EmailProvider.microsoft;
};

const getProviderCredentials = (provider) => {
  if (provider === EmailProvider.gmail) {
    return {
      user: readEnv("EMAIL_GMAIL_USER"),
      pass: readEnv("EMAIL_GMAIL_PASS"),
    };
  }

  return {
    user: readEnv("EMAIL_MICROSOFT_USER"),
    pass: readEnv("EMAIL_MICROSOFT_PASS"),
  };
};

const getSenderCredentials = (sender) => {
  const provider = getEmailProvider();
  const senderKeys = senderCredentialEnv[sender] || senderCredentialEnv[EmailSender.lots];
  const providerCredentials = getProviderCredentials(provider);
  const senderLegacyCredentials = {
    user: readEnv(senderKeys.legacyUserKey),
    pass: readEnv(senderKeys.legacyPassKey),
  };
  const globalLegacyCredentials = {
    user: readEnv("EMAIL_USER"),
    pass: readEnv("EMAIL_PASS"),
  };

  return {
    user:
      providerCredentials.user || senderLegacyCredentials.user || globalLegacyCredentials.user,
    pass:
      providerCredentials.pass || senderLegacyCredentials.pass || globalLegacyCredentials.pass,
  };
};

const getTransportConfig = (sender = EmailSender.lots) => {
  const provider = getEmailProvider();
  const credentials = getSenderCredentials(sender);

  if (!credentials.user || !credentials.pass) {
    throw new Error(
      `Email SMTP no configurado para el proveedor ${provider}. Revisa las variables de entorno.`
    );
  }

  if (provider === EmailProvider.gmail && !credentials.user.includes("@")) {
    throw new Error(
      "EMAIL_GMAIL_USER debe ser un correo completo, por ejemplo usuario@dominio.com."
    );
  }

  return {
    ...transportPresets[provider],
    auth: credentials,
  };
};

const assertEmailConfig = (sender = EmailSender.lots) => {
  getTransportConfig(sender);
};

const sendEmail = async (
  recipient,
  subject,
  text,
  cc,
  bcc,
  isText = true,
  sender = EmailSender.lots
) => {
  const config = getTransportConfig(sender);
  const from = config.auth.user;
  const transporter = nodemailer.createTransport(config);

  const mailOptions = {
    from,
    to: recipient,
    subject: subject,
    [isText ? "text" : "html"]: text,
    cc,
    bcc,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail,
  EmailSender,
  assertEmailConfig,
  getEmailProvider,
};
