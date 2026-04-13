require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  userEmail: process.env.EMAIL_USER,
  passEmail: process.env.EMAIL_PASS,
  customerSupportEmail: process.env.EMAIL_ATENCION_CLIENTE_USER,
  customerSupportPass: process.env.EMAIL_ATENCION_CLIENTE_PASS,
  futureProjectsEmail: process.env.EMAIL_PROXIMOS_LANZAMIENTOS_USER,
  futureProjectsPass: process.env.EMAIL_PROXIMOS_LANZAMIENTOS_PASS,
  salesforceUrlPrefix: process.env.SALESFORCE_URL_PREFIX,
  salesforceOrgId: process.env.SALESFORCE_ORG_ID,
};
