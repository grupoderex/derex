import { titlesPropertySection } from 'src/pages/properties/components/TitlesPropertiesCMS';

function isValidMediaUrl (value) {
  if (!value || typeof value !== 'string') return false;

  const normalized = value.trim();
  if (!normalized) return false;

  // Accept absolute URLs, root-relative paths, uploads/* paths and localhost/domain paths.
  try {
    const parsed = new URL(normalized);
    if (['http:', 'https:', 'ftp:'].includes(parsed.protocol)) {
      return true;
    }
  } catch {
    // Ignore invalid URL constructor inputs; handled by regex fallbacks below.
  }

  const rootRelativeRegex = /^\/[^ "']+$/;
  const uploadsRelativeRegex = /^uploads\/[^ "']+$/i;
  const localhostWithoutProtocolRegex = /^(localhost|127\.0\.0\.1)(:\d+)?\/[^ "']+$/i;
  const domainWithoutProtocolRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?::\d+)?(?:\/[^ "']*)?$/;

  return (
    rootRelativeRegex.test(normalized) ||
    uploadsRelativeRegex.test(normalized) ||
    localhostWithoutProtocolRegex.test(normalized) ||
    domainWithoutProtocolRegex.test(normalized)
  );
}

export function validateProjectData (dataProject) {
  try {
    // Validar el campo 'name'
    if (!dataProject.name || dataProject.name.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (!dataProject.url_salesforce || dataProject.url_salesforce.length < 3) {
      return 'Debes ingresar una url relacionada a salesforce';
    }

    if (!dataProject.type_orientation) {
      return 'Debe seleccionar un tipo de orientación';
    }

    if (dataProject.type_orientation === 'vertical' || dataProject.type_orientation === 'mixed') {
      if (!dataProject.vertical_data?.departments) {
        return 'Debe ingresar el número de departamentos';
      }
      if (!dataProject.vertical_data?.levels) {
        return 'Debe ingresar el número de niveles';
      }
    }

    // Validar el campo 'short_name'
    if (!dataProject.short_name || dataProject.short_name.length < 3) {
      return 'El nombre corto debe tener al menos 3 caracteres';
    }

    // Validar el campo 'description'
    if (!dataProject.description || dataProject.description.length < 20) {
      return 'La descripción debe tener al menos 20 caracteres';
    }

    // Validar el campo 'description'
    if (!dataProject.description_eng || dataProject.description_eng.length < 20) {
      return 'La descripción en ingles debe tener al menos 20 caracteres';
    }

    // Validar el campo 'long_description'
    if (!dataProject.long_description || dataProject.long_description.length < 20) {
      return 'La descripción larga debe tener al menos 20 caracteres';
    }

    // Validar el campo 'long_description'
    if (!dataProject.long_description_eng || dataProject.long_description_eng.length < 20) {
      return 'La descripción larga en ingles debe tener al menos 20 caracteres';
    }

    // Validar el campo 'featured'
    if (typeof dataProject.featured !== 'string' || dataProject.featured.length < 10) {
      return 'La caracteristica principal debe ser una texto con al menos 10 caracteres';
    }

    // Validar el campo 'email_contact'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dataProject.email_contact)) {
      return 'Email debe ser un formato válido';
    }

    // Validar el campo 'phone_contact'
    const phoneRegex = /^(\+\d{1,2}\s?)?(\d{2,4}[\s-]?\d{4,})$/;
    if (!phoneRegex.test(dataProject.phone_contact)) {
      return 'El teléfono debe tener un formato válido';
    }

    // Validar el campo 'calle'
    if (!dataProject.calle || dataProject.calle.length < 3) {
      return 'La calle debe tener al menos 3 caracteres';
    }

    // Validar el campo 'colonia'
    if (!dataProject.colonia || dataProject.colonia.length < 3) {
      return 'La colonia debe tener al menos 3 caracteres';
    }

    // Validar el campo 'id_city'
    const cityId = parseInt(dataProject.id_city, 10);
    if (Number.isNaN(cityId) || cityId <= 0) {
      return 'Debe seleccionar la ciudad y su estado correspondiente';
    }

    // Validar el campo 'cp'
    const cpRegex = /^\d{5}$/;
    if (!cpRegex.test(dataProject.cp)) {
      return 'El código postal debe tener 5 dígitos';
    }

    // Validar el campo 'latitud'
    if (
      Number.isNaN(dataProject.latitud) ||
      dataProject.latitud < -90 ||
      dataProject.latitud > 90
    ) {
      return 'La latitud debe ser un número entre -90 y 90';
    }

    // Validar el campo 'longitud'
    if (
      Number.isNaN(dataProject.longitud) ||
      dataProject.longitud < -180 ||
      dataProject.longitud > 180
    ) {
      return 'La longitud debe ser un número entre -180 y 180';
    }

    // Validar el campo 'link_map'
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (dataProject.link_map) {
      if (!urlRegex.test(dataProject.link_map)) {
        return 'El enlace del mapa debe ser una URL válida';
      }
    }

    // Validar el campo 'logo_color'
    if (!isValidMediaUrl(dataProject.logo_color)) {
      return 'Debe subir un logo';
    }

    // Si no se encuentra ningún error, devuelve undefined
    return undefined;
  } catch {
    return 'Error al validar la data del proyecto';
  }
}

/**
 * @param {any} dataProperty
 * @param {"horizontal"|"vertical"} projectOrientation
 */
export function validatePropertyData (dataProperty, projectOrientation, titlesCms) {
  try {
    // Validar el campo 'materport_video'
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (dataProperty.materport_video) {
      if (!urlRegex.test(dataProperty.materport_video)) {
        return 'El video de Matterport debe ser una URL válida';
      }
    }

    // Validar el campo 'bathrooms'
    const bathrooms = parseInt(dataProperty.bathrooms, 10);
    if (Number.isNaN(bathrooms) || bathrooms < 0 || bathrooms >= 100) {
      return 'El número de baños debe ser un entero positivo menor a 100 y mayor a 1';
    }

    // Validar el campo 'cars_garage_capacity'
    const garageCapacity = parseInt(dataProperty.cars_garage_capacity, 10);
    if (Number.isNaN(garageCapacity) || garageCapacity < 0 || garageCapacity >= 100) {
      return 'La capacidad de la cochera debe ser un entero positivo menor a 100';
    }

    // Validar el campo 'cars_garage_capacity'
    const parkingLotCapacity = parseInt(dataProperty.cars_parking_lot_capacity, 10);
    if (Number.isNaN(parkingLotCapacity) || parkingLotCapacity < 0 || parkingLotCapacity >= 100) {
      return 'La capacidad del estacionamiento debe ser un entero positivo menor a 100';
    }

    // Validar el campo 'rooms'
    const rooms = parseInt(dataProperty.rooms, 10);
    if (Number.isNaN(rooms) || rooms < 0 || rooms >= 100) {
      return 'El número de habitaciones debe ser un entero positivo menor a 100 y mayor a 1';
    }

    // Validar el campo 'restrooms'
    const restrooms = parseInt(dataProperty.restrooms, 10);
    if (Number.isNaN(restrooms) || restrooms < 0 || restrooms >= 50) {
      return 'El número de baños adicionales debe ser un entero positivo menor a 50';
    }

    // Validar el campo 'name'
    if (dataProperty.name.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (projectOrientation === 'vertical' && !dataProperty.vertical_floor) {
      return 'Debe ingresar el piso';
    }

    // Validar el campo 'description'
    if (dataProperty.description.trim().length < 20) {
      return 'La descripción debe tener al menos 20 caracteres';
    }

    if (dataProperty.description_eng.trim().length < 20) {
      return 'La descripción debe tener al menos 20 caracteres';
    }

    // Validar el campo 'main_image'
    if (!isValidMediaUrl(dataProperty.main_image)) {
      return 'La imagen principal debe ser una URL válida';
    }

    // Validar el campo 'id_project'
    const projectId = parseInt(dataProperty.id_project, 10);
    if (Number.isNaN(projectId) || projectId <= 0) {
      return 'Debe seleccionar un proyecto';
    }

    // Validar el campo 'floors'
    const floors = parseInt(dataProperty.floors, 10);
    if (Number.isNaN(floors) || floors < 0) {
      return 'El número de pisos debe ser un entero positivo';
    }

    // Validar el campo 'square_meters'
    const squareMeters = parseFloat(dataProperty.square_meters);
    if (Number.isNaN(squareMeters) || squareMeters < 0) {
      return 'Los metros cuadrados deben ser un número positivo';
    }

    if (
      titlesPropertySection.titles.some(
        (title) =>
          !titlesCms.find((t) => t.name === title.key)?.value ||
          !titlesCms.find((t) => t.name === title.key)?.value_en
      )
    ) {
      return 'Debe ingresar todos los títulos';
    }

    // Si no se encuentra ningún error, devuelve undefined
    return undefined;
  } catch {
    return 'Error al validar la data de la propiedad';
  }
}

export function validateNewDevelopmentData (dataDevelopment) {
  try {
    // Validar el campo 'main_image'
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!dataDevelopment.main_image || !urlRegex.test(dataDevelopment.main_image)) {
      return 'Debes subir la imagen principal';
    }

    if (!dataDevelopment.main_image_alt || dataDevelopment.main_image_alt.length > 50) {
      return 'El alt de la imagen principal debe tener como máximo 50 caracteres';
    }

    if (dataDevelopment.secondary_image) {
      const alt = dataDevelopment.secondary_image_alt || '';
      if (alt.length < 3 || alt.length > 50) {
        return 'El alt de la imagen secundaria debe contener entre 3 y 50 caracteres';
      }
    }
    // Validar el campo 'name'
    if (
      !dataDevelopment.name ||
      dataDevelopment.name.length > 50 ||
      dataDevelopment.name.length < 3
    ) {
      return 'El nombre debe tener al menos 3 caracteres y máximo 50';
    }

    if (
      !dataDevelopment.unique_url ||
      (dataDevelopment.unique_url.length > 50 && dataDevelopment.unique_url.length < 3)
    ) {
      return 'La url única debe tener al menos 3 caracteres y máximo 50';
    }

    // Validar el campo 'contact_email'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dataDevelopment.contact_email)) {
      return 'Email debe ser un formato válido';
    }

    // Validar el campo 'contact_phone'
    const phoneRegex = /^(\+\d{1,2}\s?)?(\d{2,4}[\s-]?\d{4,})$/;
    if (!phoneRegex.test(dataDevelopment.contact_phone)) {
      return 'El teléfono debe tener un formato válido';
    }

    if (!dataDevelopment.state_id) {
      return 'Debe seleccionar un estado';
    }

    if (dataDevelopment.contact_phone.length > 10) {
      return 'El teléfono debe tener 10 dígitos';
    }

    if (!dataDevelopment.type) {
      return 'El próximo desarrollo debe tener un tipo de orientación';
    }

    // Si no se encuentra ningún error, devuelve undefined
    return undefined;
  } catch {
    return 'Error al validar la data del proyecto';
  }
}
