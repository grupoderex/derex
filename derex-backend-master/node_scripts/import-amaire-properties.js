const mysql = require('mysql2/promise');

const localProjectId = 4;

const properties = [
  {
    id: 259,
    name: 'Modelo A',
    description:
      'Departamento diseñado para quienes valoran la calma, el confort y la calidad de vida. Espacios amplios diseñados para brindarte mejor bienestar, más que un hogar es una inversión en tranquilidad: un refugio donde la comodidad y el diseño se unen para ofrecer un estilo de vida sereno, ideal para descansar, desconectarse y vivir con plenitud todos los días.',
    description_eng:
      "This apartment is designed for those who value tranquility, comfort, and quality of life. Spacious layouts designed to provide you with greater well-being.\nMore than a home, it's an investment in peace of mind: a haven where comfort and design come together to offer a serene lifestyle, ideal for resting, disconnecting, and living life to the fullest every day.",
    rooms: 1,
    bathrooms: 1,
    restrooms: 0,
    cars_garage_capacity: 1,
    cars_parking_lot_capacity: 0,
    floors: 0,
    main_image: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/images/media_1720028394606.png',
    thumbnail: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/images/media_1730330597911.png',
    vertical_floor: 1,
    project_order: 0,
    active: 1,
    banner: '',
    virtual_tour_iframe:
      '<iframe width="100%" height="485" src="https://www.youtube.com/embed/GtGxcG6nc24?si=ymtq5OqKcwENvLHn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>',
    extra_images: [
      { id: 2684, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/cocina-2-departamento-A-amaire-javer_1770680897002.webp', order: 0, alt_text: 'Cocina del departamento modelo A en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2685, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/escritorio-departamento-A-amaire-javer_1770680930451.webp', order: 0, alt_text: 'Escritorio del departamento modelo A en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2686, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/escritorio-2-departamento-A-amaire-javer_1770680951689.webp', order: 0, alt_text: 'Escritorio del departamento modelo A en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2688, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/recamara-3-departamento-A-amaire-javer_1770681002894.webp', order: 0, alt_text: 'Recámara secundaria del departamento modelo A en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2682, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/sala-departamento-A-amaire-javer_1770680820476.webp', order: 1, alt_text: 'Sala del departamento modelo A en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2683, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/cocina-departamento-A-amaire-javer_1770680862691.webp', order: 2, alt_text: 'Comedor del departamento modelo A en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2687, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/recamara-2-departamento-A-amaire-javer_1770680982954.webp', order: 6, alt_text: 'Recámara del departamento modelo A en el fraccionamiento Amaire de la inmobiliaria Javer' }
    ],
    prices: [{ id: 2799, name: 'Modelo A', price_base: 2958000, price_m2_ext: 0 }],
    blueprints: [
      {
        id: 907,
        image_url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/images/media_1730218970275.png',
        image_alt_text: 'Planta del departamento prototipo modelo A en el fraccionamiento Amaire de la inmobiliaria Javer',
        title: { es: 'Planta modelo A ', en: 'Model A plant' }
      }
    ]
  },
  {
    id: 299,
    name: 'Modelo B',
    description:
      'Este modelo de departamento ha sido cuidadosamente diseñado para ofrecer un equilibrio perfecto entre la comodidad, funcionalidad y estilo. Sus espacios son amplios y bien distribuidos los cuales invitan a disfrutar de un ambiente armonioso, ideal tanto para el descanso como para la vida diaria. Cuenta con un baño completo y un medio baño adicional, brindando practicidad y confort en cada detalle.',
    description_eng:
      'This apartment model has been carefully designed to offer a perfect balance between comfort, functionality, and style. Its spacious and well-distributed layout invites you to enjoy a harmonious environment, ideal for both relaxation and daily life. It features a full bathroom and an additional half-bath, providing practicality and comfort in every detail.',
    rooms: 2,
    bathrooms: 1,
    restrooms: 1,
    cars_garage_capacity: 0,
    cars_parking_lot_capacity: 2,
    floors: 0,
    main_image: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754682324859.png',
    thumbnail: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754682980949.png',
    vertical_floor: 4,
    project_order: 0,
    active: 1,
    banner: '',
    virtual_tour_iframe:
      '<iframe width="100%" height="540" src="https://www.youtube.com/embed/SFVLrXFNE9M?si=K7hg1CQowiSejNzZ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>',
    extra_images: [
      { id: 2689, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/sala-departamento-modelo-B-amaire-javer_1770681837543.webp', order: 0, alt_text: 'Sala del departamento modelo B en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2691, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/recamara-principal-departamento-modelo-B-amaire-javer_1770681902613.webp', order: 0, alt_text: 'Recámara principal del departamento modelo B en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2690, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/sala-tv-departamento-modelo-B-amaire-javer_1770681872032.webp', order: 2, alt_text: 'Sala de TV del departamento modelo B en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2692, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-jpeg/recamara-departamento-modelo-B-amaire-javer_1770681935473.jpg', order: 4, alt_text: 'Recámara del departamento modelo B en el fraccionamiento Amaire de la inmobiliaria Javer' }
    ],
    prices: [{ id: 2800, name: 'Modelo B', price_base: 4181000, price_m2_ext: 0 }],
    blueprints: [
      {
        id: 1157,
        image_url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754682716829.png',
        image_alt_text: 'Planta arquitectónica del departamento modelo B en el fraccionamiento Amaire de la inmobiliaria Javer',
        title: { es: 'Planta modelo B', en: 'Model B plant' }
      }
    ]
  },
  {
    id: 300,
    name: 'Modelo C',
    description:
      'Este departamento ofrece un espacio de diseño que invita al descanso y a la armonía en tu hogar. Cuenta con 2 recámaras, pero la principal integra baño completo y vestidor, creando un ambiente de mayor privacidad y funcionalidad. De manera adicional dispone de un baño completo para las visitas.  Sus hermosas vistas se convierten en el complemento perfecto para seguir disfrutando de cada rincón, de tu nuevo departamento, llenándolo de luz, tranquilidad y una sensación constante de bienestar.',
    description_eng:
      'This apartment offers a designer space that invites relaxation and harmony in your home. It features two bedrooms, but the master suite includes a full bathroom and walk-in closet, creating an atmosphere of greater privacy and functionality. There is also a full bathroom for guests. Its beautiful views are the perfect complement to continue enjoying every corner of your new apartment, filling it with light, tranquility, and a constant sense of well-being.',
    rooms: 2,
    bathrooms: 2,
    restrooms: 0,
    cars_garage_capacity: 2,
    cars_parking_lot_capacity: 0,
    floors: 0,
    main_image: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754689715966.png',
    thumbnail: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754689732789.png',
    vertical_floor: 3,
    project_order: 0,
    active: 1,
    banner: '',
    virtual_tour_iframe:
      '<iframe width="100%" height="540" src="https://my.matterport.com/show/?m=vNWcDP4QqFZ" frameborder="0" loading="lazy" allowfullscreen allow="autoplay; fullscreen; web-share; xr-spatial-tracking;"></iframe>',
    extra_images: [
      { id: 2694, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/comedor-sala-amaire-Departamento-C-javer_1770682466270.webp', order: 0, alt_text: 'Sala y comedor del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2696, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/comedor-cocina-amaire-Departamento-C-javer_1770682541780.webp', order: 0, alt_text: 'Comedor y cocina del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2697, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/recamara-principal-cama-king-size-amaire-Departamento-C-javer_1770682582512.webp', order: 0, alt_text: 'Recámara principal con cama king size del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2698, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/recamara-principal-amaire-Departamento-C-javer_1770682611713.webp', order: 0, alt_text: 'Recámara principal del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2699, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/recamara-amaire-Departamento-C-javer_1770682646445.webp', order: 0, alt_text: 'Recámara del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2693, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/sala-comedor-amaire-Departamento-C-javer_1770682418688.webp', order: 1, alt_text: 'Sala comedor del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2695, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/cocina-comedor-cocina-comedor-amaire-Departamento-C-javer_1770682511792.webp', order: 3, alt_text: 'Cocina y comedor del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2700, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-webp/recamara-doble-amaire-Departamento-C-javer_1770682665472.webp', order: 8, alt_text: 'Recámara doble del departamento modelo C en el fraccionamiento Amaire de la inmobiliaria Javer' }
    ],
    prices: [{ id: 2697, name: 'Modelo C', price_base: 4806000, price_m2_ext: 0 }],
    blueprints: [
      {
        id: 1158,
        image_url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754690120250.png',
        image_alt_text: 'Planta del departamento prototipo modelo C en el fraccionamiento Amaire de la inmobiliaria Javer',
        title: { es: 'Planta modelo C', en: 'Model C plant' }
      }
    ]
  },
  {
    id: 301,
    name: 'Modelo D',
    description:
      'Amplio departamento de 3 recámaras, donde la principal cuenta con baño y vestidor, y las secundarias comparten un baño completo, además de tener medio baño para las visitas. Su gran valor esta en la hermosa terraza con vistas al cerro o a la ciudad, un espacio ideal para las reuniones y momentos inolvidables con amigos. Una inversión segura y confiable que combina confort, armonía y calidad de vida.',
    description_eng:
      'Spacious 3-bedroom apartment, where the master suite features a bathroom and walk-in closet, while the secondary bedrooms share a full bathroom, plus a powder room for guests. Its greatest asset is the beautiful terrace with views of the hills or the city, an ideal space for gatherings and unforgettable moments with friends. A safe and reliable investment that combines comfort, harmony, and quality of life.',
    rooms: 3,
    bathrooms: 2,
    restrooms: 1,
    cars_garage_capacity: 2,
    cars_parking_lot_capacity: 0,
    floors: 0,
    main_image: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754690398072.png',
    thumbnail: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-png/1754690413176.png',
    vertical_floor: 4,
    project_order: 0,
    active: 1,
    banner: '',
    virtual_tour_iframe:
      '<iframe width="100%" height="540" src="https://www.youtube.com/embed/EjfB06vc6BA?si=YwCFWfXmS6XIF_Ic" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>',
    extra_images: [
      { id: 2701, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-jpeg/Sala-tv-departamento-modelo-D-amaire-javer_1770683169856.jpg', order: 0, alt_text: 'Sala de TV del departamento modelo D en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2702, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-jpeg/comedor-departamento-modelo-D-amaire-javer_1770683227246.jpg', order: 0, alt_text: 'Comedor del departamento modelo D en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2703, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-jpeg/Sala-comedor-departamento-modelo-D-amaire-javer_1770683272201.jpg', order: 3, alt_text: 'Sala y comedor del departamento modelo D en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2704, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-jpeg/sala-terraza-departamento-modelo-D-amaire-javer_1770683320044.jpg', order: 4, alt_text: 'Sala del departamento modelo D en el fraccionamiento Amaire de la inmobiliaria Javer' },
      { id: 2705, url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-jpeg/terraza-departamento-modelo-D-amaire-javer_1770683363271.jpg', order: 5, alt_text: 'Terraza del departamento modelo D en el fraccionamiento Amaire de la inmobiliaria Javer' }
    ],
    prices: [{ id: 2698, name: 'Modelo D', price_base: 5686000, price_m2_ext: 0 }],
    blueprints: [
      {
        id: 1159,
        image_url: 'https://javer-api-dev-page.s3.us-east-2.amazonaws.com/javer-api-dev/image-jpeg/1754690888624.jpg',
        image_alt_text: 'Terraza del departamento modelo D en el fraccionamiento Amaire de la inmobiliaria Javer',
        title: { es: 'Planta modelo D', en: 'Model D plant' }
      }
    ]
  }
];

async function run() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '@Tecmilenio2025',
    database: 'javer_db'
  });

  try {
    await conn.beginTransaction();

    for (const item of properties) {
      await conn.execute(
        `INSERT INTO property (
          id, id_project, type, vertical_floor, name, description, description_eng,
          rooms, bathrooms, restrooms, cars_garage_capacity, cars_parking_lot_capacity,
          floors, active, main_image, project_order, banner, virtual_tour_iframe,
          features, outstanding, thumbnail
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          id_project = VALUES(id_project),
          type = VALUES(type),
          vertical_floor = VALUES(vertical_floor),
          name = VALUES(name),
          description = VALUES(description),
          description_eng = VALUES(description_eng),
          rooms = VALUES(rooms),
          bathrooms = VALUES(bathrooms),
          restrooms = VALUES(restrooms),
          cars_garage_capacity = VALUES(cars_garage_capacity),
          cars_parking_lot_capacity = VALUES(cars_parking_lot_capacity),
          floors = VALUES(floors),
          active = VALUES(active),
          main_image = VALUES(main_image),
          project_order = VALUES(project_order),
          banner = VALUES(banner),
          virtual_tour_iframe = VALUES(virtual_tour_iframe),
          features = VALUES(features),
          outstanding = VALUES(outstanding),
          thumbnail = VALUES(thumbnail)`,
        [
          item.id,
          localProjectId,
          null,
          item.vertical_floor,
          item.name,
          item.description,
          item.description_eng,
          item.rooms,
          item.bathrooms,
          item.restrooms,
          item.cars_garage_capacity,
          item.cars_parking_lot_capacity,
          item.floors,
          item.active,
          item.main_image,
          item.project_order,
          item.banner,
          item.virtual_tour_iframe,
          JSON.stringify({}),
          0,
          item.thumbnail
        ]
      );

      await conn.execute('DELETE FROM prices_list_property WHERE id_property = ?', [item.id]);
      for (const price of item.prices) {
        await conn.execute(
          `INSERT INTO prices_list_property (id, id_property, name, price_base, price_m2_ext)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             id_property = VALUES(id_property),
             name = VALUES(name),
             price_base = VALUES(price_base),
             price_m2_ext = VALUES(price_m2_ext)`,
          [price.id, item.id, price.name, price.price_base, price.price_m2_ext]
        );
      }

      await conn.execute('DELETE FROM project_property_images WHERE id_property = ?', [item.id]);
      for (const img of item.extra_images) {
        await conn.execute(
          `INSERT INTO project_property_images (id, id_property, image_url, image_alt_text, \`order\`, created_at, update_at)
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE
             id_property = VALUES(id_property),
             image_url = VALUES(image_url),
             image_alt_text = VALUES(image_alt_text),
             \`order\` = VALUES(\`order\`),
             update_at = NOW()`,
          [img.id, item.id, img.url, img.alt_text, img.order || 0]
        );
      }

      await conn.execute('DELETE FROM project_property_blueprints WHERE id_property = ?', [item.id]);
      for (const bp of item.blueprints) {
        await conn.execute(
          `INSERT INTO project_property_blueprints (id, id_property, orden, image_url, image_alt_text, characteristics_architectural_plans, title)
           VALUES (?, ?, 0, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             id_property = VALUES(id_property),
             orden = VALUES(orden),
             image_url = VALUES(image_url),
             image_alt_text = VALUES(image_alt_text),
             characteristics_architectural_plans = VALUES(characteristics_architectural_plans),
             title = VALUES(title)`,
          [bp.id, item.id, bp.image_url, bp.image_alt_text, '[]', JSON.stringify(bp.title)]
        );
      }
    }

    await conn.commit();

    const [counts] = await conn.query(
      `SELECT
        (SELECT COUNT(*) FROM property WHERE id IN (259,299,300,301)) AS properties_count,
        (SELECT COUNT(*) FROM project_property_images WHERE id_property IN (259,299,300,301)) AS images_count,
        (SELECT COUNT(*) FROM project_property_blueprints WHERE id_property IN (259,299,300,301)) AS blueprints_count,
        (SELECT COUNT(*) FROM prices_list_property WHERE id_property IN (259,299,300,301)) AS prices_count`
    );

    console.log(counts[0]);
  } catch (error) {
    await conn.rollback();
    console.error(error);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

run();
