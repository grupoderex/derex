import axios from 'axios';
import { QueryClient } from 'react-query';

const configuredApiUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const defaultLocalApiUrl = 'http://localhost:3000';
const isDev = import.meta.env.DEV;
const isLocalApiUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configuredApiUrl);

const apiUrl = isDev
  ? configuredApiUrl || defaultLocalApiUrl
  : configuredApiUrl;

if (isDev && configuredApiUrl && !isLocalApiUrl) {
  console.warn(
    `[Admin] VITE_API_BASE_URL apunta a un host remoto (${configuredApiUrl}). ` +
    'Para evitar cambios en preprod/prod, usa http://localhost:3000 en desarrollo.'
  );
}

export const queryClient = new QueryClient();

export const apiService = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/admin/login') || requestUrl.includes('/admin/refresh');

    if ((status === 401 || status === 403) && !isAuthEndpoint && typeof window !== 'undefined') {
      window.localStorage.removeItem('admin_session_token');
      window.localStorage.removeItem('token');

      if (!window.location.pathname.includes('/login')) {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

export const api_login = async ({ email, password }) => {
  const { data } = await apiService.post('/admin/login', {
    email,
    password,
  });
  return data;
};

export const api_refreshToken = async (token) => {
  const { data } = await apiService.post(
    '/admin/refresh',
    {},
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_logout = async (token) => {
  const { data } = await apiService.post(
    '/usuarios/logout',
    {},
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_getAllCities = async () => {
  const { data } = await apiService.get('/ciudades');
  return data;
};

export const api_updatedCity = async (id, name, id_state, token) => {
  const { data } = await apiService.put(
    `/ciudades/${id}`,
    { name, id_state },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_createCity = async (name, id_state, token) => {
  const { data } = await apiService.post(
    `/ciudades/`,
    { name, id_state },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_getAnalitycs = async (token) => {
  const { data } = await apiService.get(`/stats`, { headers: { token } });
  return data;
};

export const api_getAllStyles = async () => {
  const { data } = await apiService.get(`/estilos`);
  return data;
};

export const api_updateStyle = async (key, newData, token) => {
  const { data } = await apiService.put(`/estilos/${key}`, newData, { headers: { token } });
  return data;
};

export const api_getAllDocuments = async () => {
  const { data } = await apiService.get(`/documentos/allByPages/`);
  return data;
};

export const api_updateDocument = async (id, newData, token) => {
  const { data } = await apiService.put(`/documentos/${id}`, newData, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_getAllProjects = async () => {
  const { data } = await apiService.get('/proyectos?show_invisible=true');
  return data;
};

export const api_getProjectById = async (id) => {
  const { data } = await apiService.get(`/proyectos/id/${id}?show_invisible=true`);
  return data;
};

export const api_deleteProjectById = async (id, token) => {
  const { data } = await apiService.delete(`/proyectos/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_createProject = async (data, token) => {
  const { data: result } = await apiService.post(`/proyectos`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_updateProject = async (id, data, token) => {
  const { data: result } = await apiService.put(`/proyectos/id/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_getAllProperties = async () => {
  const { data } = await apiService.get('/propiedades');
  return data;
};

export const api_getPropertiesByProjectId = async (id) => {
  const { data } = await apiService.get(
    `/propiedades/properties_search?project=${id}&get_inactives=true`
  );
  return data;
};

export const api_getProjectsByState = async (id, token) => {
  const { data } = await apiService.get(`/property-price/properties-list?state_id=${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_getScheduledProjectsById = async (id, token) => {
  const { data } = await apiService.get(`/property-price/prices-list/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_editPropertiesPrices = async (token, body) => {
  const { data } = await apiService.post(`/property-price/schedule`, body, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_getBlueprintsByPropertyId = async (id) => {
  const { data } = await apiService.get(`planos/property/${id}`);
  return data;
};

export const api_createNewDevelopment = async (data, token) => {
  const { data: result } = await apiService.post(`/future-projects/create`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_updateNewDevelopment = async (id, data, token) => {
  const { data: result } = await apiService.patch(`/future-projects/update/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_getAllNewDevelopments = async () => {
  const {
    data: { projects },
  } = await apiService.get('/future-projects/get-all');

  return projects;
};

export const api_getNewDevelopmentById = async (id) => {
  const { data } = await apiService.get(`/future-projects/get/${id}`);

  return data;
};

export const api_validateUniqueUrl = async (data, token) => {
  const { data: result } = await apiService.post(`/future-projects/validate-unique-url`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_getBannerScheduled = async (id, token) => {
  const { data: result } = await apiService.get(
    `/property-price/banner-schedule?project_id=${id}`,
    {
      headers: {
        token,
      },
    }
  );
  return result;
};

export const api_postNewBannerScheduled = async (body, token) => {
  const { data: result } = await apiService.post(`/property-price/banner-schedule`, body, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_deleteNewDevelopment = async (id, token) => {
  const { data: result } = await apiService.delete(`/future-projects/delete/${id}`, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @typedef {{es: T, en: T}} Translation
 * @template T
 */
/**
 * @typedef {Object} Blueprint
 * @property {string} id_property
 * @property {string} image_url
 * @property {Array<Translation<string>>} characteristics_architectural_plans
 * @property {Translation<string>} title
 */
/**
 * @function
 * @param {Blueprint} blueprint
 * @param {string} token
 * @returns {Promise<Blueprint>}
 */
export const api_createBlueprint = async (
  { id_property, image_url, characteristics_architectural_plans, title, image_alt_text, orden },
  token
) => {
  const { data } = await apiService.post(
    `/planos`,
    { id_property, image_url, characteristics_architectural_plans, title, image_alt_text, orden },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_editBlueprint = async (
  id,
  { id_property, image_url, characteristics_architectural_plans, title, image_alt_text, orden },
  token
) => {
  const { data } = await apiService.put(
    `/planos/${id}`,
    { id_property, image_url, characteristics_architectural_plans, title, image_alt_text, orden },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_deleteBlueprint = async (id, token) => {
  const { data } = await apiService.delete(`/planos/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_getAmenitiesByPropertyId = async (id) => {
  const { data } = await apiService.get(`/amenidades/get_all/${id}`);
  return data;
};

export const api_createAminedad = async ({ id_property, name, img_url, name_eng }, token) => {
  const { data } = await apiService.post(
    `/amenidades/create`,
    {
      id_property,
      name,
      name_eng,
      img_url,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_deleteAminedad = async (id, token) => {
  const { data } = await apiService.delete(`/amenidades/delete/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_createImageProperty = async ({ id_property, image_url }, token) => {
  const { data } = await apiService.post(
    `/imagenes-propiedades`,
    { id_property, image_url },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_deleteImageProperty = async (id, token) => {
  const { data } = await apiService.delete(`/imagenes-propiedades/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_updateImageProperty = async (id, newData, token) => {
  const { data } = await apiService.put(`/imagenes-propiedades/${id}`, newData, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_deleteProperty = async (id, token) => {
  const { data } = await apiService.delete(`/propiedades/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_saveProperty = async (id, data, token) => {
  const { data: result } = await apiService.put(`/propiedades/id/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_createProperty = async (data, token) => {
  const { data: result } = await apiService.post('/propiedades/', data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_getPropertyForID = async (id) => {
  const { data } = await apiService.get(`/propiedades/id/${id}`);
  return data;
};

export const api_createPriceProperty = async (
  { id_property, name, price_base, price_m2_ext },
  token
) => {
  const { data } = await apiService.post(
    `/precios/create`,
    {
      id_property,
      price_base,
      price_m2_ext,
      name,
    },
    {
      headers: { token },
    }
  );
  return data;
};
export const api_deletePriceProperty = async (id, token) => {
  const { data } = await apiService.delete(`/precios/delete/${id}`, { headers: { token } });
  return data;
};

export const api_getAllSections = async () => {
  const { data } = await apiService.get('/secciones/all');
  return data;
};

export const api_setNavbarSection = async (id, active, token) => {
  const { data } = await apiService.put(
    `/secciones/navbar/${id}`,
    { active },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_setFooterSection = async (id, active, token) => {
  const { data } = await apiService.put(
    `/secciones/footer/${id}`,
    { active },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_getAllAdminLogs = async (token) => {
  const { data } = await apiService.get('/admin-logs/get_all', {
    headers: {
      token,
    },
  });
  return data;
};

export const api_getAllAdmins = async (token) => {
  const { data } = await apiService.get('/admin/get_all_admins', {
    headers: {
      token,
    },
  });
  return data;
};

export const api_resgiterNewAdmin = async (adminData, token) => {
  const { data } = await apiService.post('/admin/register', adminData, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_updateAdmin = async (id, adminData, token) => {
  const { data } = await apiService.post(`/admin/update_admin/${id}`, adminData, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_manageBanAdmin = async (id, token) => {
  const { data } = await apiService.delete(`/admin/ban/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_setMediaForID = async (id, file, token) => {
  const formData = new FormData();
  formData.append('imgid', id);
  formData.append('file', file);

  const { data } = await apiService.post('/pdf/set_file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token,
    },
  });

  return data;
};

export const api_setMediaVideoForID = async (id, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiService.post('/media/set_video_development', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token,
    },
  });

  return data;
};

export const api_setPdfForID = async (id, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiService.post('/pdf/set_file', formData, {
    headers: {
      // 'Content-Type': 'multipart/form-data',
      token,
    },
  });

  return data;
};

export const api_getAllPosts = async () => {
  try {
    const response = await apiService.get('/blog');
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const api_createPost = async (post, token) => {
  try {
    const response = await apiService.post('/blog', post, {
      headers: {
        token,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { success: false, status: error.response.status, message: error.response.data };
    }
    if (error.request) {
      return { success: false, message: 'No response received from server' };
    }
    return { success: false, message: error.message };
  }
};

export const api_updatePost = async (id, post, token) => {
  try {
    const response = await apiService.put(`/blog/id/${id}`, post, {
      headers: {
        token,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { success: false, status: error.response.status, message: error.response.data };
    }
    if (error.request) {
      return { success: false, message: 'No response received from server' };
    }
    return { success: false, message: error.message };
  }
};

export const api_deletePost = async (id, token) => {
  try {
    const response = await apiService.delete(`/blog/id/${id}`, { headers: { token } });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      return { success: false, status: error.response.status, message: error.response.data };
    }
    if (error.request) {
      return { success: false, message: 'No response received from server' };
    }
    return { success: false, message: error.message };
  }
};

/**
 * @typedef {Object} Metadata
 * @property {number} id
 * @property {string} section
 * @property {string} name
 * @property {string} value
 * @property {string} value_en
 * @property {boolean} bold
 * @property {boolean} outline
 * @property {string} color
 */
/**
 * @typedef {Object} GetTitlesResponse
 * @property {string} status
 * @property {Array<Metadata>} data
 */
/**
 * @function
 * @returns {Promise<GetTitlesResponse>}
 */
export const api_getAllTitles = async () => {
  const { data } = await apiService.get('/home/');
  return data;
};

/**
 * @function
 * @param {string} section
 * @returns {Promise<GetTitlesResponse>}
 */
export const api_getTitlesBySection = async (section) => {
  const { data } = await apiService.get(`/meta/${section}`);
  return data;
};

/**
 * @function
 * @param {Array<Omit<Metadata, "id">>} titles
 * @param {string} token
 * @returns {Promise<GetTitlesResponse>}
 */
export const api_upsertTitles = async (titles, token) => {
  const { data } = await apiService.post(
    '/meta/create-or-update-many',
    {
      data: titles,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

/**
 * @typedef {Object} ParsedKnowJaver
 * @property {number[]} metadataIds
 * @property {string} id
 * @property {string} index
 * @property {string} imageUrl
 * @property {string} isImageLeft
 * @property {string} buttonUrl
 * @property {string} isUrlExternal
 * @property {Metadata} titleUpper
 * @property {Metadata} titleLower
 * @property {Metadata} description
 * @property {Metadata} buttonText
 */
/**
 * @typedef {Object} GetKnowJaverResponse
 * @property {string} status
 * @property {Array<Metadata>} data
 */
/**
 * @function
 * @returns {Promise<ParsedKnowJaver>}
 */
export const api_getKnowJaver = async () => {
  const response = await apiService.get('/meet-javer/');

  const richMetadataFields = new Set(['titleUpper', 'titleLower', 'description', 'buttonText']);

  /**
   * @type {GetKnowJaverResponse}
   */
  const { data } = response.data;

  /**
   * @type {ParsedKnowJaver}
   */
  const res = data.reduce(
    (acc, meta) => {
      if (acc[meta.name] !== undefined) {
        if (richMetadataFields.has(meta.name)) {
          acc[meta.name] = meta;
        } else {
          acc[meta.name] = meta.value;
        }
      }

      return acc;
    },
    {
      imageUrl: '',
      isImageLeft: 'false',
      buttonUrl: '',
      isUrlExternal: 'false',
      altText: '',
      titleUpper: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
      titleLower: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
      description: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
      buttonText: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
    }
  );

  return res;
};

/**
 * @function
 * @param {ParsedKnowJaver[]} knowJaver
 * @param {string} token
 */
export const api_upsertKnowJaver = async (knowJaver, token) => {
  const metadatas = Object.entries(knowJaver)
    .filter(([key]) => key !== 'metadataIds')
    .map(([key, value]) =>
      typeof value !== 'object'
        ? {
          section: 'meet-javer',
          name: key,
          value: value?.toString(),
        }
        : {
          ...value,
          section: 'meet-javer',
          name: key,
        }
    );

  const { data } = await apiService.post(
    '/meta/create-or-update-many',
    {
      data: metadatas,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

/**
 * @function
 * @param {number[]} ids
 * @param {string} token
 */
export const api_deleteManyMeta = async (ids, token) => {
  const { data } = await apiService.delete('/meta/delete-many', {
    data: {
      ids,
    },
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} FrequentQuestion
 * @property {number} id
 * @property {string} question_es
 * @property {string} question_en
 * @property {string} answer_es
 * @property {string} answer_en
 * @property {string | undefined} url_link
 * @property {boolean | undefined} open_in_new_tab
 */
/**
 * @typedef {Object} FrequentQuestionResponse
 * @property {string} status
 * @property {Array<FrequentQuestion>} data
 */
/**
 * @function
 * @param {string} token
 * @returns {Promise<FrequentQuestionResponse>}
 */
export const api_getFAQs = async (token) => {
  const { data } = await apiService.get('/frequent-questions', {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {FrequentQuestion} faq
 * @param {string} token
 */
export const api_createFAQ = async (faq, token) => {
  const { data } = await apiService.post(
    '/frequent-questions',
    {
      ...faq,
      url_link: faq.url_link ? faq.url_link : undefined,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteFAQ = async (id, token) => {
  const { data } = await apiService.delete(`/frequent-questions/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {FrequentQuestion} faq
 * @param {string} token
 */
export const api_updateFAQ = async (id, faq, token) => {
  const { data } = await apiService.patch(
    `/frequent-questions/id/${id}`,
    {
      ...faq,
      id: undefined,
      url_link: faq.url_link ? faq.url_link : null,
      created_at: undefined,
      updated_at: undefined,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<FrequentQuestion>}
 */
export const api_getFAQById = async (id, token) => {
  const { data } = await apiService.get(`/frequent-questions/id/${id}`, {
    headers: {
      token,
    },
  });
  return data?.data;
};

/**
 * @typedef {Object} CreateClientExperienceInput
 * @property {string} description_es
 * @property {string} description_en
 * @property {string} url
 * @property {number} project_id
 */

/**
 * @function
 * @param {CreateClientExperienceInput} data
 * @param {string} token
 */
export const api_createClientExperience = async (data, token) => {
  const { data: result } = await apiService.post('/customer-experience/', data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @typedef {Object} ClientExperience
 * @property {number} id
 * @property {string} description_es
 * @property {string} description_en
 * @property {string} url
 * @property {string} project_name
 * @property {string} project_logo
 */

/**
 * @typedef {Object} ClientExperienceListResponse
 * @property {string} status
 * @property {Array<ClientExperience>} data
 */

/**
 * @function
 * @param {string} token
 * @returns {Promise<ClientExperienceListResponse>}
 */
export const api_getAllClientExperiences = async (token) => {
  const { data } = await apiService.get('/customer-experience/', {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteClientExperience = async (id, token) => {
  const { data } = await apiService.delete(`/customer-experience/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {CreateClientExperienceInput} data
 * @param {string} token
 */
export const api_updateClientExperience = async (id, data, token) => {
  const { data: result } = await apiService.patch(
    `/customer-experience/id/${id}`,
    {
      description_es: data.description_es,
      description_en: data.description_en,
      url: data.url,
      project_id: data.project_id,
    },
    {
      headers: {
        token,
      },
    }
  );
  return result;
};

/**
 * @typedef {Object} ClientExperienceResponse
 * @property {string} status
 * @property {ClientExperience} data
 */

/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<ClientExperienceResponse>}
 */
export const api_getClientExperienceById = async (id, token) => {
  const { data } = await apiService.get(`/customer-experience/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} AboutSection
 * @property {number} id
 * @property {number} index_order
 * @property {string} image_url
 * @property {boolean} is_image_left
 * @property {string} content_es
 * @property {string} content_en
 */

/**
 * @typedef {Object} AboutSectionListResponse
 * @property {string} status
 * @property {Array<AboutSection>} data
 */
/**
 * @function
 * @param {string} token
 * @returns {Promise<AboutSectionListResponse>}
 */
export const api_getAllAboutSections = async (token) => {
  const { data } = await apiService.get('/about-us/', {
    headers: {
      token,
    },
  });

  return data?.data;
};

/**
 * @function
 * @param {Array<AboutSection>} sections
 * @param {string} token
 */
export const api_upsertAboutSections = async (sections, token) => {
  const { data } = await apiService.post(
    '/about-us/create-or-update-many',
    {
      data: sections,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteAboutSection = async (id, token) => {
  const { data } = await apiService.delete(`/about-us/id/${id}`, {
    headers: {
      token,
    },
  });

  return data;
};

/**
 * @typedef {Object} CreditType
 * @property {number} id
 * @property {string} name
 */
/**
 * @typedef {Object} CreditTypeListResponse
 * @property {Array<CreditType>} data
 */
/**
 * @typedef {Object} CreditTypePaginatedResponse
 * @property {CreditTypeListResponse} data
 */
/**
 * @function
 * @param {string} token
 * @returns {Promise<CreditTypePaginatedResponse>}
 */
export const api_getAllCreditTypes = async (token) => {
  const { data } = await apiService.get('/cat-credit-type/get-by-filters?limit=1000', {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} CreateCreditTypeInput
 * @property {string} name
 */
/**
 * @function
 * @param {CreateCreditTypeInput} data
 * @param {string} token
 */
export const api_createCreditType = async (data, token) => {
  const { data: result } = await apiService.post('/cat-credit-type/create', data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteCreditType = async (id, token) => {
  const { data } = await apiService.delete(`/cat-credit-type/delete-by-id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} UpdateCreditTypeInput
 * @property {string} name
 */
/**
 * @function
 * @param {number} id
 * @param {UpdateCreditTypeInput} data
 * @param {string} token
 */
export const api_updateCreditType = async (id, data, token) => {
  const { data: result } = await apiService.patch(`/cat-credit-type/update-by-id/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @typedef {Object} CreditTypeResponse
 * @property {CreditType} data
 */
/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<CreditTypeResponse>}
 */
export const api_getCreditTypeById = async (id, token) => {
  const { data } = await apiService.get(`/cat-credit-type/get-by-id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} SocialNetwork
 * @property {number} id
 * @property {string} name
 * @property {string} url
 * @property {string} icon
 */
/**
 * @typedef {Object} SocialNetworkListResponse
 * @property {Array<SocialNetwork>} data
 * @property {string} status
 */
/**
 * @function
 * @returns {Promise<SocialNetworkListResponse>}
 */
export const api_getAllSNS = async (token) => {
  const { data } = await apiService.get('/social', {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} CreateSNSInput
 * @property {string} name
 * @property {string} url
 * @property {string} icon
 */
/**
 * @function
 * @param {CreateSNSInput} data
 * @param {string} token
 */
export const api_createSNS = async (data, token) => {
  const { data: result } = await apiService.post('/social', data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteSNS = async (id, token) => {
  const { data } = await apiService.delete(`/social/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} UpdateSNSInput
 * @property {string} name
 * @property {string} url
 * @property {string} icon
 */
/**
 * @function
 * @param {number} id
 * @param {UpdateSNSInput} data
 * @param {string} token
 */
export const api_updateSNS = async (id, data, token) => {
  const { data: result } = await apiService.patch(
    `/social/id/${id}`,
    {
      ...data,
      id: undefined,
      created_at: undefined,
      updated_at: undefined,
    },
    {
      headers: {
        token,
      },
    }
  );
  return result;
};

/**
 * @typedef {Object} SNSResponse
 * @property {SocialNetwork} data
 */
/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<SNSResponse>}
 */
export const api_getSNSById = async (id, token) => {
  const { data } = await apiService.get(`/social/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} CertificationAndAward
 * @property {number} id
 * @property {string} title_es
 * @property {string} title_en
 * @property {string} description_es
 * @property {string} description_en
 * @property {string} date
 * @property {string|null} button_url
 * @property {string|null} button_url_en
 * @property {boolean} new_tab
 * @property {boolean} show_date
 */
/**
 * @typedef {Object} CertificationAndAwardListResponse
 * @property {Array<CertificationAndAward>} data
 * @property {string} status
 */
/**
 * @function
 * @param {string} token
 * @returns {Promise<CertificationAndAwardListResponse>}
 */
export const api_getAllCertificationsAndAwards = async (token) => {
  const { data } = await apiService.get('/certifications', {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {CertificationAndAward} data
 * @param {string} token
 */
export const api_createCertificationAndAward = async (data, token) => {
  const { data: result } = await apiService.post(
    '/certifications',
    {
      ...data,
      id: undefined,
      button_url: data.button_url ? data.button_url : null,
      button_url_en: data.button_url_en ? data.button_url_en : null,
      created_at: undefined,
      updated_at: undefined,
    },
    {
      headers: {
        token,
      },
    }
  );
  return result;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteCertificationAndAward = async (id, token) => {
  const { data } = await apiService.delete(`/certifications/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {CertificationAndAward} data
 * @param {string} token
 */
export const api_updateCertificationAndAward = async (id, data, token) => {
  const { data: result } = await apiService.patch(
    `/certifications/id/${id}`,
    {
      ...data,
      id: undefined,
      button_url: data.button_url ? data.button_url : undefined,
      button_url_en: data.button_url_en ? data.button_url_en : null,
      created_at: undefined,
      updated_at: undefined,
    },
    {
      headers: {
        token,
      },
    }
  );
  return result;
};

/**
 * @typedef {Object} CertificationAndAwardResponse
 * @property {CertificationAndAward} data
 */
/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<CertificationAndAwardResponse>}
 */
export const api_getCertificationAndAwardById = async (id, token) => {
  const { data } = await apiService.get(`/certifications/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} FooterElement
 * @property {number} id
 * @property {string} name
 * @property {string} name_eng
 * @property {string} path
 * @property {string} section
 * @property {boolean} is_url
 */
/**
 * @typedef {Object} FooterElementListResponse
 * @property {Array<FooterElement>} data
 * @property {string} status
 */
/**
 * @function
 * @param {string} token
 * @returns {Promise<FooterElementListResponse>}
 */
export const api_getAllFooterElements = async (token) => {
  const { data } = await apiService.get('/footer', {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {FooterElement} data
 * @param {string} token
 */
export const api_createFooterElement = async (data, token) => {
  const { data: result } = await apiService.post(
    '/footer',
    {
      ...data,
      active: true,
    },
    {
      headers: {
        token,
      },
    }
  );
  return result;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteFooterElement = async (id, token) => {
  const { data } = await apiService.delete(`/footer/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {FooterElement} data
 * @param {string} token
 */
export const api_updateFooterElement = async (id, data, token) => {
  const { data: result } = await apiService.patch(`/footer/id/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @typedef {Object} FooterElementResponse
 * @property {FooterElement} data
 */
/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<FooterElementResponse>}
 */
export const api_getFooterElementById = async (id, token) => {
  const { data } = await apiService.get(`/footer/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} DecalogueSectionItem
 * @property {number} id
 * @property {string} title_es
 * @property {string} title_en
 * @property {string} file
 */
/**
 * @typedef {Object} DecalogueSection
 * @property {number} id
 * @property {string} name_es
 * @property {string} name_en
 * @property {"decalogue" | "notice"} type
 * @property {Array<DecalogueSectionItem>} decalogue
 */
/**
 * @typedef {Object} DecalogueSectionListResponse
 * @property {Array<DecalogueSection>} data
 * @property {string} status
 */
/**
 * @function
 * @param {"decalogue" | "notice"} type
 * @param {string} token
 * @returns {Promise<DecalogueSectionListResponse>}
 */
export const api_getAllDecalogueSections = async (type, token) => {
  const { data } = await apiService.get(`/section-decalogue/type/${type}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {DecalogueSection} data
 * @param {string} token
 */
export const api_createDecalogueSection = async (data, token) => {
  const { data: result } = await apiService.post('/section-decalogue', data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteDecalogueSection = async (id, token) => {
  const { data } = await apiService.delete(`/section-decalogue/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {DecalogueSection} data
 * @param {string} token
 */
export const api_updateDecalogueSection = async (id, data, token) => {
  const { data: result } = await apiService.patch(`/section-decalogue/id/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @typedef {Object} DecalogueSectionResponse
 * @property {DecalogueSection} data
 */
/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<DecalogueSectionResponse>}
 */
export const api_getDecalogueSectionById = async (id, token) => {
  const { data } = await apiService.get(`/section-decalogue/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @typedef {Object} Decalogue
 * @property {number} id
 * @property {string} title_es
 * @property {string} title_en
 * @property {string} file
 * @property {number} section_id
 */
/**
 * @typedef {Object} DecalogueListResponse
 * @property {Array<Decalogue>} data
 * @property {string} status
 */
/**
 * @function
 * @param {string} token
 * @returns {Promise<DecalogueListResponse>}
 */
export const api_getAllDecalogues = async (token) => {
  const { data } = await apiService.get('/decalogue', {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {Decalogue} data
 * @param {string} token
 */
export const api_createDecalogue = async (data, token) => {
  const { data: result } = await apiService.post('/decalogue', data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @function
 * @param {number} id
 * @param {string} token
 */
export const api_deleteDecalogue = async (id, token) => {
  const { data } = await apiService.delete(`/decalogue/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

/**
 * @function
 * @param {number} id
 * @param {Decalogue} data
 * @param {string} token
 */
export const api_updateDecalogue = async (id, data, token) => {
  const { data: result } = await apiService.patch(`/decalogue/id/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

/**
 * @typedef {Object} DecalogueResponse
 * @property {Decalogue} data
 */
/**
 * @function
 * @param {number} id
 * @param {string} token
 * @returns {Promise<DecalogueResponse>}
 */
export const api_getDecalogueById = async (id, token) => {
  const { data } = await apiService.get(`/decalogue/id/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

// Promociones

/**
 * Obtiene las promociones de un proyecto
 * @param {number} idProject
 * @param {string} token
 */
export const api_getPromotionsByProjectId = async (idProject, token) => {
  const { data } = await apiService.get(`/project-promotions/get-by-project/${idProject}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_createPromotionsByProjectId = async (body, token) => {
  const { data } = await apiService.post(`/project-promotions/create`, body, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_updatePromotionsByProjectId = async (id, body, token) => {
  const { data } = await apiService.patch(`/project-promotions/update/${id}`, body, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_togglePromotionsByProject = async (id, body, token) => {
  const { data } = await apiService.patch(`/project-promotions/toggle/${id}`, body, {
    headers: {
      token,
    },
  });
  return data;
};

// chip de urgencia

export const api_getUrgencyChipByProperty = async (id, token) => {
  const { data } = await apiService.get(`/property-urgency-chip/get-by-property/${id}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_createUrgencyChip = async (body, token) => {
  const { data } = await apiService.post(`/property-urgency-chip/create`, body, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_updateUrgencyChip = async (id, body, token) => {
  const { data } = await apiService.patch(`/property-urgency-chip/update/${id}`, body, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_toggleUrgencyChip = async (id, body, token) => {
  const { data } = await apiService.patch(`/property-urgency-chip/toggle/${id}`, body, {
    headers: {
      token,
    },
  });
  return data;
};
