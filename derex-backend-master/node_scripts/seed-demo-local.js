const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

async function run() {
  const dbHost = process.env.DB_HOST || "127.0.0.1";
  const dbPort = Number(process.env.DB_PORT || 3306);
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD || "";
  const dbName = process.env.DB_NAME;

  if (!dbUser || !dbName) {
    throw new Error("Faltan DB_USER o DB_NAME en .env");
  }

  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    multipleStatements: true,
  });

  try {
    await connection.beginTransaction();

    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
    await connection.query(`
      TRUNCATE TABLE customer_experience;
      TRUNCATE TABLE frequent_questions;
      TRUNCATE TABLE social;
      TRUNCATE TABLE future_amenity_property;
      TRUNCATE TABLE future_projects;
      TRUNCATE TABLE certifications;
      TRUNCATE TABLE about_us;
      TRUNCATE TABLE meta;
      TRUNCATE TABLE sections_footer;
      TRUNCATE TABLE sections_navbar;
      TRUNCATE TABLE stylings;
      TRUNCATE TABLE property;
      TRUNCATE TABLE project;
      TRUNCATE TABLE city;
      TRUNCATE TABLE state;
    `);
    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

    const [stateResult] = await connection.query(
      `INSERT INTO state (name, active, update_at, banner_url)
       VALUES
       ('Nuevo León', 1, NOW(), 'https://www.javer.com.mx/images/website/home.webp'),
       ('Jalisco', 1, NOW(), 'https://www.javer.com.mx/images/website/home.webp');`
    );

    const [statesRows] = await connection.query(
      "SELECT id, name FROM state WHERE name IN ('Nuevo León','Jalisco')"
    );
    const states = Object.fromEntries(statesRows.map((row) => [row.name, row.id]));

    await connection.query(
      `INSERT INTO city (name, id_state, active, update_at)
       VALUES
       ('Monterrey', ?, 1, NOW()),
       ('Escobedo', ?, 1, NOW()),
       ('Guadalajara', ?, 1, NOW());`,
      [states["Nuevo León"], states["Nuevo León"], states["Jalisco"]]
    );

    const [citiesRows] = await connection.query(
      "SELECT id, name FROM city WHERE name IN ('Monterrey','Escobedo','Guadalajara')"
    );
    const cities = Object.fromEntries(citiesRows.map((row) => [row.name, row.id]));

    await connection.query(
      `INSERT INTO project (
        id_city, type_project, type_orientation, name, short_name, description,
        logo_color, video_url, featured, active, visible, update_at,
        latitud, longitud, link_map, ciudad, colonia, calle, numero_ext, cp,
        outstanding, thumbnail, thumbnail_alt_text
      ) VALUES
      (?, 'residences', 'horizontal', 'Cumbre del Valle', 'Cumbre', 'Desarrollo demo con casas familiares y amenidades.',
       'https://www.javer.com.mx/images/logo-white.png', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '1', 1, 1, NOW(),
       '25.6866', '-100.3161', 'https://maps.app.goo.gl/AUs3Vod9KXcBBLYD7', 'Monterrey', 'Centro', 'Av. Principal', '100', '64000',
       1, 'https://www.javer.com.mx/images/website/home.webp', 'Logo Cumbre'),
      (?, 'residences', 'vertical', 'Villas del Norte', 'Villas', 'Desarrollo demo vertical con cercanía a zonas de trabajo.',
       'https://www.javer.com.mx/images/logo-white.png', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '1', 1, 1, NOW(),
       '25.7500', '-100.2900', 'https://maps.app.goo.gl/AUs3Vod9KXcBBLYD7', 'Escobedo', 'Norte', 'Calle Norte', '22', '66050',
       0, 'https://www.javer.com.mx/images/website/home.webp', 'Logo Villas'),
      (?, 'residences', 'horizontal', 'Bosques del Sur', 'Bosques', 'Proyecto demo para familias jóvenes en expansión.',
       'https://www.javer.com.mx/images/logo-white.png', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '0', 1, 1, NOW(),
       '20.6767', '-103.3475', 'https://maps.app.goo.gl/AUs3Vod9KXcBBLYD7', 'Guadalajara', 'Sur', 'Av. Bosques', '45', '44100',
       1, 'https://www.javer.com.mx/images/website/home.webp', 'Logo Bosques');`,
      [cities["Monterrey"], cities["Escobedo"], cities["Guadalajara"]]
    );

    const [projectsRows] = await connection.query(
      "SELECT id, name FROM project WHERE name IN ('Cumbre del Valle','Villas del Norte','Bosques del Sur')"
    );
    const projects = Object.fromEntries(projectsRows.map((row) => [row.name, row.id]));

    await connection.query(
      `INSERT INTO property (
        id_project, type, name, short_name, description, rooms, bathrooms, floors,
        square_meters, price_base_mxn, active, featured, main_image, main_image_alt_text,
        thumbnail, thumbnail_alt_text, update_at, outstanding
      ) VALUES
      (?, 'casa', 'Modelo Roble', 'Roble', 'Casa demo de 2 recámaras y patio.', 2, 2, 2, 78, 1450000, 1, '1',
       'https://www.javer.com.mx/images/website/home.webp', 'Modelo Roble',
       'https://www.javer.com.mx/images/website/home.webp', 'Thumb Roble', NOW(), 1),
      (?, 'casa', 'Modelo Encino', 'Encino', 'Casa demo con recámara en planta baja.', 3, 2, 2, 92, 1690000, 1, '1',
       'https://www.javer.com.mx/images/website/home.webp', 'Modelo Encino',
       'https://www.javer.com.mx/images/website/home.webp', 'Thumb Encino', NOW(), 0),
      (?, 'departamento', 'Modelo Nube', 'Nube', 'Departamento demo de excelente ubicación.', 2, 1, 1, 64, 1320000, 1, '1',
       'https://www.javer.com.mx/images/website/home.webp', 'Modelo Nube',
       'https://www.javer.com.mx/images/website/home.webp', 'Thumb Nube', NOW(), 1),
      (?, 'casa', 'Modelo Ceiba', 'Ceiba', 'Casa demo de 3 recámaras con roof.', 3, 2, 2, 105, 1990000, 1, '0',
       'https://www.javer.com.mx/images/website/home.webp', 'Modelo Ceiba',
       'https://www.javer.com.mx/images/website/home.webp', 'Thumb Ceiba', NOW(), 1);`,
      [projects["Cumbre del Valle"], projects["Cumbre del Valle"], projects["Villas del Norte"], projects["Bosques del Sur"]]
    );

    await connection.query(
      `INSERT INTO stylings (\`key\`, \`value\`, name, alt_text) VALUES
      ('logo_url', 'https://www.javer.com.mx/images/logo-white.png', 'Logo principal', 'Logo Javer'),
      ('home_hero_image', 'https://www.javer.com.mx/images/website/home.webp', 'Hero Home', 'Imagen principal home'),
      ('home_video_url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Video Home', 'Video principal'),
      ('home_video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Video Fondo Home', 'Video principal home'),
      ('lotes_image', 'https://www.javer.com.mx/images/website/home.webp', 'Imagen Hero Lotes', 'Hero de lotes'),
      ('reservas_image', 'https://www.javer.com.mx/images/website/home.webp', 'Imagen Hero Reservas', 'Hero de reservas'),
      ('blog_image', 'https://www.javer.com.mx/images/website/home.webp', 'Imagen Hero Blog', 'Hero de blog');`
    );

    await connection.query(
      `INSERT INTO sections_navbar (name, path, active, name_eng) VALUES
      ('Nosotros', '/nosotros', 1, 'About Us'),
      ('Lotes comerciales', '/lotes', 1, 'Commercial Lots'),
      ('Contacto', '/contacto', 1, 'Contact'),
      ('Blog JAVER', '/blog', 1, 'JAVER Blog'),
      ('Vinte', 'https://www.vinte.com.mx/', 1, 'Vinte'),
      ('Derex', 'http://www.derex.com.mx/', 1, 'Derex');`
    );

    await connection.query(
      `INSERT INTO sections_footer (name, name_eng, path, active, section, is_url) VALUES
      ('Certificaciones', 'Certifications', '/certificaciones', 1, 'Empresa', 0),
      ('Avisos de privacidad', 'Privacy notices', '/avisos-de-privacidad', 1, 'Empresa', 0),
      ('Blog Javer', 'Javer blog', '/blog', 1, 'Información', 0),
      ('Servicio a clientes', 'Customer service', '/servicio-a-clientes', 1, 'Clientes', 0);`
    );

    await connection.query(
      `INSERT INTO meta (section, name, value, value_en, bold, outline, color) VALUES
      ('home', 'home_main_title', 'Encuentra tu nuevo hogar', 'Find your new home', 1, 0, 0),
      ('home', 'home_subtitle', 'Proyectos disponibles en tu ciudad', 'Projects available in your city', 0, 0, 0),
      ('meet-javer', 'titleUpper', 'Conoce', 'Meet', 1, 0, 0),
      ('meet-javer', 'titleLower', 'JAVER', 'JAVER', 1, 1, 1),
      ('meet-javer', 'description', 'Más de 50 años construyendo patrimonio para las familias mexicanas.', 'Over 50 years building homes for Mexican families.', 0, 0, 0),
      ('meet-javer', 'buttonText', 'Conoce más', 'Learn more', 0, 0, 0),
      ('meet-javer', 'buttonUrl', '/nosotros', '/about', 0, 0, 0),
      ('meet-javer', 'isUrlExternal', 'false', 'false', 0, 0, 0),
      ('meet-javer', 'isImageLeft', 'true', 'true', 0, 0, 0),
      ('meet-javer', 'imageUrl', 'https://www.javer.com.mx/images/website/home.webp', 'https://www.javer.com.mx/images/website/home.webp', 0, 0, 0),
      ('meet-javer', 'altText', 'Imagen corporativa Javer', 'Javer corporate image', 0, 0, 0),
      ('about-us', 'aboutJaver_mainTitle', 'Nosotros', 'About us', 1, 0, 0),
      ('about-us', 'aboutJaver_bannerUrl', 'https://www.javer.com.mx/images/website/home.webp', 'https://www.javer.com.mx/images/website/home.webp', 0, 0, 0);`
    );

    await connection.query(
      `INSERT INTO future_projects (
        main_image, main_image_alt, secondary_image, secondary_image_alt, name,
        state_id, city_id, launch_date, contact_phone, contact_email, type, unique_url
      ) VALUES
      ('https://www.javer.com.mx/images/website/home.webp', 'Proyecto futuro 1',
       'https://www.javer.com.mx/images/website/home.webp', 'Imagen secundaria 1',
       'Parque Central', ?, ?, '2026-12-01', '8111111111', 'futuro@javer.local', 'mixed', 'parque-central'),
      ('https://www.javer.com.mx/images/website/home.webp', 'Proyecto futuro 2',
       'https://www.javer.com.mx/images/website/home.webp', 'Imagen secundaria 2',
       'Residencial Aurora', ?, ?, '2027-03-15', '8112222222', 'aurora@javer.local', 'vertical', 'residencial-aurora');`,
      [states["Nuevo León"], cities["Monterrey"], states["Jalisco"], cities["Guadalajara"]]
    );

    const [futureRows] = await connection.query(
      "SELECT id, name FROM future_projects WHERE unique_url IN ('parque-central', 'residencial-aurora')"
    );
    const futureMap = Object.fromEntries(futureRows.map((row) => [row.name, row.id]));

    await connection.query(
      `INSERT INTO future_amenity_property (id_future_project, name_es, name_en) VALUES
      (?, 'Casa club', 'Club house'),
      (?, 'Zona de juegos', 'Playground'),
      (?, 'Alberca', 'Pool');`,
      [futureMap["Parque Central"], futureMap["Parque Central"], futureMap["Residencial Aurora"]]
    );

    await connection.query(
      `INSERT INTO social (name, icon, link) VALUES
      ('Facebook', 'facebook', 'https://www.facebook.com/Javer'),
      ('Instagram', 'instagram', 'https://www.instagram.com/javer_mx/'),
      ('YouTube', 'youtube', 'https://www.youtube.com/@JAVER_MEXICO');`
    );

    await connection.query(
      `INSERT INTO frequent_questions (question_es, answer_es, question_en, answer_en, url_link, open_in_new_tab) VALUES
      ('¿Cómo puedo apartar una vivienda?', 'Puedes iniciar el proceso desde contacto y un asesor te guiará.', 'How can I reserve a home?', 'You can start from contact and an advisor will guide you.', '/contacto', 0),
      ('¿Qué créditos aceptan?', 'Aceptamos créditos bancarios e Infonavit en diversos desarrollos.', 'What financing options are available?', 'We accept bank loans and Infonavit in multiple projects.', '/credit', 0);
      `
    );

    await connection.query(
      `INSERT INTO customer_experience (project_id, description_es, description_en, url) VALUES
      (?, 'Clientes satisfechos con entregas puntuales y calidad de construcción.', 'Satisfied customers with timely delivery and build quality.', 'https://www.javer.com.mx/nosotros');`,
      [projects["Cumbre del Valle"]]
    );

    await connection.query(
      `INSERT INTO about_us (index_order, image_url, image_alt_text, is_image_left, content_es, content_en) VALUES
      (1, 'https://www.javer.com.mx/images/website/home.webp', 'Historia Javer', 1, 'En Javer construimos comunidades para miles de familias mexicanas.', 'At Javer we build communities for thousands of Mexican families.');`
    );

    await connection.query(
      `INSERT INTO certifications (title_es, title_en, description_es, description_en, date, button_url, button_url_en, new_tab, image_url, image_alt_text, show_date) VALUES
      ('Empresa Socialmente Responsable', 'Socially Responsible Company', 'Reconocimiento por buenas prácticas corporativas.', 'Recognition for strong corporate practices.', '2025-10-10', 'https://www.javer.com.mx/certificaciones', 'https://www.javer.com.mx/certificaciones', 1, 'https://www.javer.com.mx/images/website/home.webp', 'Certificación ESR', 1);`
    );

    await connection.commit();
    console.log("Seed demo local completado.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error("Error en seed-demo-local:", error.message);
  process.exit(1);
});
