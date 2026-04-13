const estadosRoutes = require("../api/state/state.routes");
const ciudadesRoutes = require("./ciudadesRoutes");
const propiedadesRoutes = require("../api/property/property.routes");
const proyectosRoutes = require("../api/project/project.routes");
const usuariosRoutes = require("./usuariosRoutes");
const ubicacionesRoutes = require("./ubicacionesRoutes");
const amenidadesRoutes = require("../api/amenity/amenity.routes");
const adminRoutes = require("./../api/admin/admin.routes");
const blogRoutes = require("./blogRoutes");
const mediaRoutes = require("./mediaRoutes");
const lotesRoutes = require("../api/lotes/lotes.routes");
const reservasRoutes = require("../api/reservas/reservas.routes");
const blueprintsRoutes = require("../api/blueprint/blueprint.routes");
const propertyImagesRoutes = require("./propertyImagesRoutes");
const seccionesRoutes = require("./seccionesRoutes");
const documentosRoutes = require("./documentosRoutes");
const PricesListPropertyRoutes = require("../api/prices_list_property/prices_list_property.routes");
const avisosRoutes = require("./avisosRoutes");
const LogActivitiesRoutes = require("./logActivitiesRoutes");
const estilosRoutes = require("./estilosRoutes");
const statsRoutes = require("./statsRoutes");
const pdfRoutes = require("./pdfRoutes");
const customerSupportRoutes = require("../api/customer_support/customer_support.routes.js");
const meta = require("../api/meta/meta.routes");
const homeRoutes = require("../api/meta/home/home.routes");
const meetJaverRoutes = require("../api/meta/meet_javer/meet_javer.routes");
const customerExperienceRoutes = require("../api/customer_experience/customer_experience.routes");
const frequentQuestionsRoutes = require("../api/frequent_questions/frequent_questions.routes");
const homeContactRoutes = require("../api/meta/home-contact/home-contact.routes");
const aboutUsRoutes = require("../api/about_us/about_us.routes");
const certificationRoutes = require("../api/certifications/certifications.routes");
const socialRoutes = require("../api/social/social.routes");
const footerRoutes = require("../api/footer/footer.routes");
const decalogueRoutes = require("../api/decalogue/decalogue.routes");
const sectionDecalogueRoutes = require("../api/section_decalogue/section_decalogue.routes");
const futureProjectsRoutes = require("../api/future_projects/future_projects.routes");
const projectPromotionsRoutes = require("../api/project_promotions/project_promotions.routes");
const propertyUrgencyRoutes = require("../api/property_urgency_chip/property_urgency_chip.routes");
const contactRoutes = require("../api/contact/contact.routes");
const propertyPriceRoutes = require("../api/property_price/property_price.routes");

module.exports = {
  sectionDecalogueRoutes,
  decalogueRoutes,
  estadosRoutes,
  ciudadesRoutes,
  propiedadesRoutes,
  proyectosRoutes,
  usuariosRoutes,
  ubicacionesRoutes,
  amenidadesRoutes,
  adminRoutes,
  blogRoutes,
  mediaRoutes,
  lotesRoutes,
  reservasRoutes,
  blueprintsRoutes,
  propertyImagesRoutes,
  seccionesRoutes,
  documentosRoutes,
  PricesListPropertyRoutes,
  avisosRoutes,
  LogActivitiesRoutes,
  estilosRoutes,
  statsRoutes,
  pdfRoutes,
  customerSupportRoutes,
  homeRoutes,
  meetJaverRoutes,
  meta,
  customerExperienceRoutes,
  frequentQuestionsRoutes,
  homeContactRoutes,
  aboutUsRoutes,
  certificationRoutes,
  socialRoutes,
  footerRoutes,
  futureProjectsRoutes,
  projectPromotionsRoutes,
  propertyUrgencyRoutes,
  contactRoutes,
  propertyPriceRoutes,
};
