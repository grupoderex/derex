// Importa las dependencias necesarias
const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config");

const {
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
  decalogueRoutes,
  sectionDecalogueRoutes,
  futureProjectsRoutes,
  projectPromotionsRoutes,
  propertyUrgencyRoutes,
  contactRoutes,
  propertyPriceRoutes,
} = require("./routes");
const CatalogCreditTypeRoutes = require("./api/cat_credit_types/CatalogCreditType.routes");

const knexSingleton = require("./lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();

// Import cron jobs
const { initializeCronJobs } = require("./lib/cron");

const app = express();

// Config cors
app.use(cors({ origin: "*" }));

// Checker de la conexión a la base de datos
knex
  .raw("SELECT 1")
  .then(() => console.log("Conexión a la base de datos exitosa"))
  .catch((error) =>
    console.error("Error en la conexión a la base de datos:", error)
  );

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Agregar limitacion 100 peticiones por minuto

// Rutas\
app.use("/section-decalogue", sectionDecalogueRoutes);
app.use("/decalogue", decalogueRoutes);
app.use("/footer", footerRoutes);
app.use("/social", socialRoutes);
app.use("/certifications", certificationRoutes);
app.use("/about-us", aboutUsRoutes);
app.use("/home-contact", homeContactRoutes);
app.use("/frequent-questions", frequentQuestionsRoutes);
app.use("/customer-experience", customerExperienceRoutes);
app.use("/meta", meta);
app.use("/meet-javer", meetJaverRoutes);
app.use("/home", homeRoutes);
app.use("/estados", estadosRoutes);
app.use("/ciudades", ciudadesRoutes);
app.use("/propiedades", propiedadesRoutes);
app.use("/proyectos", proyectosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/location", ubicacionesRoutes);
app.use("/amenidades", amenidadesRoutes);
app.use("/admin", adminRoutes);
app.use("/blog", blogRoutes);
app.use("/media", mediaRoutes);
app.use("/lotes-form", lotesRoutes);
app.use("/reservas-form", reservasRoutes);
app.use("/planos", blueprintsRoutes);
app.use("/imagenes-propiedades", propertyImagesRoutes);
app.use("/secciones", seccionesRoutes);
app.use("/documentos", documentosRoutes);
app.use("/precios", PricesListPropertyRoutes);
app.use("/avisos", avisosRoutes);
app.use("/admin-logs", LogActivitiesRoutes);
app.use("/estilos", estilosRoutes);
app.use("/stats", statsRoutes);
app.use("/pdf", pdfRoutes);
app.use("/cat-credit-type", CatalogCreditTypeRoutes);
app.use("/customer-support", customerSupportRoutes);
app.use("/future-projects", futureProjectsRoutes);
app.use("/project-promotions", projectPromotionsRoutes);
app.use("/property-urgency-chip", propertyUrgencyRoutes);
app.use("/contact", contactRoutes);
app.use("/property-price", propertyPriceRoutes);

// Manejo de errores en la serialización y deserialización de Passport
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
});

// Iniciar el servidor
app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);

  // Initialize cron jobs
  initializeCronJobs();
});
