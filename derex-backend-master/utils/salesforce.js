const { salesforceUrlPrefix, salesforceOrgId } = require("../config");

/**
 * Servicio para enviar datos a Salesforce Web-to-Lead
 */
class SalesforceService {
  /**
   * Construye la URL de Salesforce
   * @returns {string} URL de Salesforce
   */
  static getSalesforceUrl() {
    return `https://${salesforceUrlPrefix}.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8`;
  }

  /**
   * Construye los parámetros base para Salesforce
   * @param {Object} params - Parámetros específicos del formulario
   * @param {string} params.recaptcha - Token de reCAPTCHA
   * @param {string} params.firstName - Nombre
   * @param {string} params.lastName - Apellido
   * @param {string} params.phone - Teléfono
   * @param {string} params.email - Email
   * @param {string} [params.birthDate] - Fecha de nacimiento (opcional)
   * @param {string} [params.development] - Desarrollo (opcional)
   * @param {string} [params.typeOfCredit] - Tipo de crédito (opcional)
   * @param {string} [params.state] - Estado (opcional)
   * @param {string} [params.message] - Mensaje (opcional)
   * @param {string} [params.source] - Fuente del lead (por defecto: "Sitio_Javer")
   * @param {string} [params.medium] - Medio (por defecto: "Medios Digitales")
   * @param {string} [params.campaign] - Campaña (por defecto: "Pagina web Javer")
   * @param {string} [params.retURL] - URL de retorno (por defecto: "https://www.javer.com.mx/gracias")
   * @param {boolean} [params.includeBirthDate] - Si incluir fecha de nacimiento (por defecto: true)
   * @param {boolean} [params.includeTypeOfCredit] - Si incluir tipo de crédito (por defecto: true)
   * @param {boolean} [params.transformDevelopment] - Si transformar desarrollo a mayúsculas (por defecto: false)
   * @returns {URLSearchParams} Parámetros para enviar a Salesforce
   */
  static buildSalesforceParams(params) {
    const {
      recaptcha = "",
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      development,
      typeOfCredit,
      state,
      message,
      source = "Sitio_Javer",
      medium = "Medios Digitales",
      campaign = "Pagina web Javer",
      retURL = "https://www.javer.com.mx/gracias",
    } = params;

    const salesforceParams = new URLSearchParams({
      captcha_settings: JSON.stringify({
        keyname: "CAPTCHAJAVER",
        fallback: "true",
        orgId: salesforceOrgId,
        ts: JSON.stringify(new Date().getTime()),
      }),
      oid: salesforceOrgId,
      retURL,
      "g-recaptcha-response": recaptcha,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      "00N3l00000Q7A57": source,
      "00N3l00000Q7A4n": medium,
      "00N3l00000Q7A5S": campaign,
      acceptPolicy: "on",
    });

    if (birthDate) {
      salesforceParams.append("00N3l00000Q7A50", this.formatDate(birthDate));
    }

    if (development) {
      salesforceParams.append("00N3l00000Q7A54", development.toUpperCase());
    }

    if (typeOfCredit) {
      salesforceParams.append("00N3l00000Q7A5V", typeOfCredit);
    }

    if (state) {
      salesforceParams.append("00N3l00000Q7A5b", state);
    }

    if (message) {
      salesforceParams.append("00N3l00000Q7A4q", message);
    }

    return salesforceParams;
  }

  /**
   * Construye las cabeceras para la petición a Salesforce
   * @param {Object} req - Objeto request de Express
   * @returns {Object} Cabeceras para la petición
   */
  static buildSalesforceHeaders(req) {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": req.get("User-Agent") || "Javer-Backend/1.0",
      Accept:
        req.get("Accept") ||
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language":
        req.get("Accept-Language") || "es-MX,es;q=0.9,en;q=0.8",
      "Accept-Encoding": req.get("Accept-Encoding") || "gzip, deflate, br",
      Referer: req.get("Referer") || "https://www.javer.com.mx",
      Origin: req.get("Origin") || "https://www.javer.com.mx",
    };

    // Si hay una IP del cliente, incluirla
    if (req.ip || req.connection.remoteAddress) {
      headers["X-Forwarded-For"] = req.ip || req.connection.remoteAddress;
    }

    return headers;
  }

  /**
   * Envía los datos a Salesforce
   * @param {Object} params - Parámetros del formulario
   * @param {Object} req - Objeto request de Express
   * @returns {Promise<Object>} Respuesta de Salesforce
   */
  static async submitToSalesforce(params, req) {
    try {
      const salesforceUrl = this.getSalesforceUrl();
      const salesforceParams = this.buildSalesforceParams(params);
      const salesforceHeaders = this.buildSalesforceHeaders(req);

      // Realizar la petición a Salesforce
      const salesforceResponse = await fetch(
        `${salesforceUrl}&${salesforceParams.toString()}`,
        {
          method: "POST",
          headers: salesforceHeaders,
          body: null,
          redirect: "follow",
        }
      );

      // Verificar si la respuesta fue exitosa
      if (!salesforceResponse.ok) {
        throw new Error(
          `Salesforce responded with status: ${salesforceResponse.status}`
        );
      }

      // Log de la respuesta exitosa
      console.log("Form submitted successfully to Salesforce", {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        timestamp: new Date().toISOString(),
        salesforceStatus: salesforceResponse.status,
      });

      return {
        success: true,
        status: salesforceResponse.status,
        response: salesforceResponse,
      };
    } catch (error) {
      console.error("Error submitting form to Salesforce:", {
        error: error.message,
        stack: error.stack,
        email: params.email,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  /**
   * Formatea una fecha a formato YYYY-MM-DD
   * @param {string} dateString - Fecha en formato string
   * @returns {string} Fecha formateada
   */
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }
}

module.exports = SalesforceService;
