import { type AboutSectionListResponse } from "@/models/about_javer";
import { type AmenitiesResponse } from "@/models/amenities_response";
import { type AuthorizationResponse } from "@/models/authorization";
import { type Blog } from "@/models/blog";
import { type BlogCategoryResponse } from "@/models/blog_category";
import { type BlogTopicsResponse } from "@/models/blog_topic";
import { type CertificationsAndAwardsResponse } from "@/models/certifications";
import {
    type ClientExperienceListResponse,
    type ClientExperienceResponse,
} from "@/models/client_experience";
import { type ContratosDeAdhesionResponse } from "@/models/contratos_de_adhesion";
import { type CustomerServiceReportFormData } from "@/models/customer_service_report_form_data";
import { type DecalogueResponse } from "@/models/decalogue";
import { type DecaloguesResponse } from "@/models/decalogues";
import {
    type FrequentQuestion,
    type FrequentQuestionResponse,
} from "@/models/frequent-question";
import {
    ResponseFormatted,
    type LocationHierarchy,
} from "@/models/location_hierarchy";
import { type LotesFormData } from "@/models/lotes_form_data";
import {
    type AvailableSections,
    type GetTitlesResponse,
    type MetadataTitle,
    type ParsedKnowJaver,
} from "@/models/metadata";
import { type ModelsForHome } from "@/models/models_for_home";
import { type BlogItem, type BlogsResponse } from "@/models/new_blog";
import { type NextLaunch } from "@/models/nextLauches.inteface";
import { type Project } from "@/models/project";
import { type ProjectByFiltersResult } from "@/models/project_by_filters_result";
import { type Property } from "@/models/property";
import { type PropertySearch } from "@/models/property_search";
import { type SectionResponse } from "@/models/section";
import { type SNSResponse } from "@/models/sns";
import { type State } from "@/models/state";
import { type StateCityFilters } from "@/models/state_city_filters";
import { type TerritorialReservationsFormData } from "@/models/territorial_reservations_form_data";
import { type UserAllFavoritesResponse } from "@/models/user_all_favorites";
import { WebsiteMediaObject, type WebsiteMedia } from "@/models/website_media";
import { ApiError } from "@/types/api_error";
import qs from "qs";
import { BACKEND_URL, BLOG_URL } from "../constants";

const isDevelopment = process.env.NODE_ENV !== "production";

export async function postLotesForm(formData: LotesFormData) {
  return await fetch(`${BACKEND_URL}/lotes-form/lotes`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function postCustomerServiceReport(
  formData: CustomerServiceReportFormData
) {
  return await fetch(`${BACKEND_URL}/customer-support/`, {
    method: "POST",
    body: JSON.stringify({
      ...formData,
      street_number: "0",
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function postTerritorialReservationsForm(
  formData: TerritorialReservationsFormData
) {
  return await fetch(`${BACKEND_URL}/reservas-form/reservas`, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function getActiveSections(): Promise<SectionResponse> {
  try {
  return await fetch(`${BACKEND_URL}/secciones/all`, {
    next: { revalidate: 3600 }, // ISR: Cache 1 hora - Secciones navbar/footer cambian raramente
  }).then<SectionResponse>(async (res) => {
    if (res.ok) return await res.json();
    if (isDevelopment) return { navbar: [], footer: [] } as SectionResponse;
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      if (isDevelopment) return { navbar: [], footer: [] } as SectionResponse;
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return { navbar: [], footer: [] };
    throw new ApiError("No fue posible obtener las secciones", 503);
  }
}

export async function getDocuments() {
  try {
  return await fetch(`${BACKEND_URL}/documentos/allByPages`, {
    next: { revalidate: 3600 }, // ISR: Cache 1 hora - Documentos cambian raramente
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener los documentos", 503);
  }
}

export async function getContratosAdhesion() {
  try {
  return await fetch(`${BACKEND_URL}/documentos/contratos_adhesion`, {
    next: { revalidate: 3600 }, // ISR: Cache 1 hora - Contratos de adhesión cambian raramente
  }).then<ContratosDeAdhesionResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as ContratosDeAdhesionResponse;
    throw new ApiError("No fue posible obtener los contratos", 503);
  }
}

export async function getWebsiteMedia() {
  try {
  return await fetch(`${BACKEND_URL}/estilos`, {
    next: { revalidate: 3600 }, // ISR: Cache 1 hora - Media del sitio (videos, imágenes) cambia raramente
  })
    .then<WebsiteMedia[]>(async (res) => {
      if (res.ok) return await res.json();
      if (isDevelopment) return [];
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        if (isDevelopment) return [];
        throw new ApiError("Error desconocido", res.status);
      }
    })
    .then((data) => {
      return data.reduce((acc, item) => {
        switch (item.key) {
          case "lotes_image":
            acc.lotes_alt = item.alt_text;
            break;
          case "reservas_image":
            acc.reservas_alt = item.alt_text;
            break;
          default:
            acc[item.key as keyof WebsiteMediaObject] = item.value;
            break;
        }

        return acc;
      }, {} as WebsiteMediaObject);
    });
  } catch {
    if (isDevelopment) return {} as WebsiteMediaObject;
    throw new ApiError("No fue posible obtener los estilos del sitio", 503);
  }
}

export async function getMedia() {
  try {
    const response = await fetch(`${BACKEND_URL}/estilos`, {
      next: { revalidate: 3600 }, // ISR: Cache 1 hora - Media del sitio cambia raramente
    });
    return await response.json();
  } catch {
    throw new Error("Error desconocido");
  }
}

export async function getFullDataDesarrollos() {
  try {
  return await fetch(`${BACKEND_URL}/location/location_hierarchy/formatted`, {
    next: { revalidate: 600 }, // ISR: Cache 10 minutos - Desarrollos se actualizan periódicamente
  }).then<ResponseFormatted>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return { data: [] } as unknown as ResponseFormatted;
    throw new ApiError("No fue posible obtener la jerarquía de ubicaciones", 503);
  }
}

export async function getInitialDataDesarrollos(): Promise<LocationHierarchy[]> {
  try {
    return await fetch(`${BACKEND_URL}/location/location_hierarchy`, {
      next: { revalidate: 200 }, // ISR: Cache 200 segundos - Jerarquía de ubicaciones se actualiza periódicamente
    }).then<LocationHierarchy[]>(async (res) => {
      if (res.ok) return await res.json();
      if (isDevelopment) return [];
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        if (isDevelopment) return [];
        throw new ApiError("Error desconocido", res.status);
      }
    });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener la jerarquía de ubicaciones", 503);
  }
}

export async function loginUserAPI(email: string, password: string) {
  return await fetch(`${BACKEND_URL}/usuarios/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then<AuthorizationResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function registerUserAPI(
  firstName: string,
  lastName: string,
  password: string,
  primaryEmail: string,
  primaryPhone?: string
) {
  return await fetch(`${BACKEND_URL}/usuarios/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      password,
      primary_email: primaryEmail,
      primary_phone: primaryPhone,
    }),
  }).then<AuthorizationResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function refreshTokenAPI(token: string) {
  return await fetch(`${BACKEND_URL}/usuarios/refresh`, {
    method: "POST",
    headers: {
      token,
    },
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function logoutUserAPI(token: string) {
  return await fetch(`${BACKEND_URL}/usuarios/logout`, {
    method: "POST",
    headers: {
      token,
    },
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function getAllFavoritesUser(token: string) {
  return await fetch(`${BACKEND_URL}/usuarios/get_all_favorites`, {
    method: "POST",
    headers: {
      token,
    },
  }).then<UserAllFavoritesResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function setFavoritesUserAPI(token: string, propertyId: number) {
  return await fetch(`${BACKEND_URL}/usuarios/manage_favorites`, {
    method: "POST",
    headers: {
      token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ property_id: propertyId }),
  }).then<UserAllFavoritesResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function getProjectByID(id: number, showHidden: boolean = false) {
  try {
  return await fetch(
    `${BACKEND_URL}/proyectos/id/${id}?show_invisible=${showHidden}`
  ).then<Project>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return null as unknown as Project;
    throw new ApiError("No fue posible obtener el proyecto", 503);
  }
}

export async function getFileByName(name: string) {
  try {
  return await fetch(`${BACKEND_URL}/proyectos/get-document-url/${name}`).then<{
    document_url: string;
  }>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return { document_url: "" };
    throw new ApiError("No fue posible obtener el documento", 503);
  }
}

export async function getProjects(showHidden: boolean = false): Promise<Project[]> {
  try {
  return await fetch(`${BACKEND_URL}/proyectos?show_invisible=${showHidden}`, {
    next: { revalidate: 600 }, // ISR: Cache 10 minutos - Lista de proyectos se actualiza periódicamente
  }).then<Project[]>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener los proyectos", 503);
  }
}

export async function getEstados(): Promise<State[]> {
  try {
  return await fetch(`${BACKEND_URL}/estados`).then<State[]>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener los estados", 503);
  }
}

export async function getBlogByID(id: number) {
  try {
  return await fetch(`${BACKEND_URL}/blog/id/${id}`).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return null;
    throw new ApiError("No fue posible obtener el blog", 503);
  }
}

export async function getPropertiesSearch({
  stateId,
  projectId,
  type,
  showHidden = false,
}: {
  stateId?: number;
  projectId: number;
  type?: "horizontal" | "vertical";
  showHidden?: boolean;
}) {
  try {
  return await fetch(
    `${BACKEND_URL}/propiedades/properties_search?${
      stateId ? "state=" + stateId : "project=" + projectId
    }${type ? `&type=${type}` : ""}&show_invisible=${showHidden}`
  )
    .then<PropertySearch[]>(async (res) => {
      if (res.ok) return await res.json();
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        throw new ApiError("Error desconocido", res.status);
      }
    })
    .then((data) => {
      return data.map((item) => {
        const addressParts = item.full_address?.split(" ");
        const splitIndex = Math.floor(addressParts?.length / 2);
        return {
          ...item,
          video_url: item?.video_url ?? "",
          materport_url: item?.materport_video,
          address0: addressParts?.slice(0, splitIndex).join(" "),
          address1: addressParts?.slice(splitIndex).join(" "),
          delivery_status: item.delivery_status
            ? "Entrega inmediata"
            : "En Construccion",
          construction_status: item.construction_status
            ? "Lista para Habitar"
            : "En obra blanca",
        };
      });
    });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener las propiedades", 503);
  }
}

export async function getPropertyById(id: number, showHidden: boolean = false) {
  try {
  return await fetch(
    `${BACKEND_URL}/propiedades/id/${id}?show_invisible=${showHidden}`
  ).then<Property>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return null as unknown as Property;
    throw new ApiError("No fue posible obtener la propiedad", 503);
  }
}

export async function getBlogArticles() {
  try {
  return await fetch(`${BACKEND_URL}/blog/active-blogs`)
    .then<Blog[]>(async (res) => {
      if (res.ok) return await res.json();
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        throw new ApiError("Error desconocido", res.status);
      }
    })
    .then((data) => {
      return data.map((post) => {
        return {
          id: post.id,
          section: post.post_section,
          title: post.post_title,
          description: post.description,
          image: post.post_image1,
          date: post.post_date,
          author: post.post_author,
          content: post.post_content,
          url: post.permalink,
        };
      });
    });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener los artículos", 503);
  }
}

export async function getAmenitiesByProjectId(
  projectId: number,
  type: "text" | "image"
) {
  try {
  return await fetch(
    `${BACKEND_URL}/amenidades/get_all/${projectId}?type=${type ?? ""}`
  ).then<AmenitiesResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as AmenitiesResponse;
    throw new ApiError("No fue posible obtener las amenidades", 503);
  }
}

export async function getAllProjectsByFilters(filters?: {
  project_id?: number;
  state_id?: number;
  city_id?: number;
  price_min?: number;
  price_max?: number;
}) {
  try {
  return await fetch(
    `${BACKEND_URL}/proyectos/get-all-projects-by-filters?${
      filters
        ? new URLSearchParams(
            Object.entries(filters)
              .filter(([, value]) => value !== undefined)
              .map(([key, value]) => [key, value.toString()])
          ).toString()
        : ""
    }`
  ).then<ProjectByFiltersResult[]>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener los proyectos filtrados", 503);
  }
}

export async function getAllStateCitiesFilters(filters?: {
  state_id?: number;
  city_id?: number;
}) {
  try {
  return await fetch(
    `${BACKEND_URL}/estados/get-all-states-cities-filters?${
      filters
        ? new URLSearchParams(
            Object.entries(filters).map(([key, value]) => [
              key,
              value.toString(),
            ])
          ).toString()
        : ""
    }`
  ).then<StateCityFilters[]>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener los filtros de estados/ciudades", 503);
  }
}

export async function getAllPropertiesHome(): Promise<ModelsForHome[]> {
  try {
  return await fetch(
    `${BACKEND_URL}/propiedades/get-all-properties-for-home`
  ).then<ModelsForHome[]>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return [];
    throw new ApiError("No fue posible obtener las propiedades", 503);
  }
}

export async function getAllTitles() {
  try {
  return await fetch(`${BACKEND_URL}/meta`).then<GetTitlesResponse>(
    async (res) => {
      if (res.ok) return await res.json();
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        throw new ApiError("Error desconocido", res.status);
      }
    }
  );
  } catch {
    if (isDevelopment) return { data: [] } as unknown as GetTitlesResponse;
    throw new ApiError("No fue posible obtener los títulos", 503);
  }
}

export async function getTitlesBySection(section: AvailableSections) {
  let response: GetTitlesResponse;

  try {
    response = await fetch(`${BACKEND_URL}/meta/${section}`, {
      next: { revalidate: 3600 }, // ISR: Cache 1 hora - Títulos y metadatos cambian raramente
    }).then<GetTitlesResponse>(async (res) => {
      if (res.ok) return await res.json();
      if (isDevelopment) return { data: [] } as unknown as GetTitlesResponse;
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        if (isDevelopment) return { data: [] } as unknown as GetTitlesResponse;
        throw new ApiError("Error desconocido", res.status);
      }
    });
  } catch {
    if (isDevelopment) return {};
    throw new ApiError("No fue posible obtener metadatos de la sección", 503);
  }

  return response.data.reduce<Record<string, MetadataTitle>>((acc, meta) => {
    acc[meta.name] = {
      ...meta,
      className: `${meta.outline ? "text-stroke" : ""} ${
        meta.color ? "text-primary" : "text-foreground"
      }`.trim(),
    };
    return acc;
  }, {});
}

export async function getKnowJaver() {
  const response = await getTitlesBySection("meet-javer");

  const res = Object.values(response).reduce<ParsedKnowJaver>(
    (acc, meta) => {
      if (meta.name in acc) {
        if (meta.value && meta.value_en) {
          Object.assign(acc, {
            [meta.name]: meta,
          });
        } else {
          Object.assign(acc, {
            [meta.name]: meta.value,
          });
        }
      }

      return acc;
    },
    {
      imageUrl: "",
      altText: "",
      isImageLeft: "false",
      buttonUrl: "",
      isUrlExternal: "false",
      titleUpper: {
        value: "",
        value_en: "",
        section: "",
        name: "",
        className: "",
      },
      titleLower: {
        value: "",
        value_en: "",
        section: "",
        name: "",
        className: "",
      },
      description: {
        value: "",
        value_en: "",
        section: "",
        name: "",
        className: "",
      },
      buttonText: {
        value: "",
        value_en: "",
        section: "",
        name: "",
        className: "",
      },
    }
  );

  return res;
}

export async function getFAQs() {
  try {
  return await fetch(
    `${BACKEND_URL}/frequent-questions`
  ).then<FrequentQuestionResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as FrequentQuestionResponse;
    throw new ApiError("No fue posible obtener las preguntas frecuentes", 503);
  }
}

export async function getFAQById(id: number) {
  try {
  return await fetch(
    `${BACKEND_URL}/frequent-questions/id/${id}`
  ).then<FrequentQuestion>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return null as unknown as FrequentQuestion;
    throw new ApiError("No fue posible obtener la pregunta frecuente", 503);
  }
}

export async function getAllClientExperiences() {
  try {
  return await fetch(
    `${BACKEND_URL}/customer-experience/`
  ).then<ClientExperienceListResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as ClientExperienceListResponse;
    throw new ApiError("No fue posible obtener las experiencias", 503);
  }
}

export async function getClientExperienceById(id: number) {
  try {
  return await fetch(
    `${BACKEND_URL}/customer-experience/id/${id}`
  ).then<ClientExperienceResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as ClientExperienceResponse;
    throw new ApiError("No fue posible obtener la experiencia", 503);
  }
}

export async function getAllAboutSections() {
  const fetchAboutUs = async (url: string, cacheMode: RequestCache = "default") => {
    return await fetch(url, {
      next: { revalidate: 3600 }, // ISR: Cache 1 hora - Secciones "Nosotros" cambian raramente
      cache: cacheMode,
    }).then<AboutSectionListResponse>(async (res) => {
      if (res.ok) return await res.json();
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        throw new ApiError("Error desconocido", res.status);
      }
    });
  };

  try {
    return await fetchAboutUs(`${BACKEND_URL}/about-us/`);
  } catch (error) {
    if (isDevelopment) {
      return await fetchAboutUs("https://preprod-api.javer.com.mx/about-us/", "no-cache");
    }
    throw error;
  }
}

export async function getSNS() {
  try {
  return await fetch(`${BACKEND_URL}/social/`).then<SNSResponse>(
    async (res) => {
      if (res.ok) return await res.json();
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        throw new ApiError("Error desconocido", res.status);
      }
    }
  );
  } catch {
    if (isDevelopment) return [] as unknown as SNSResponse;
    throw new ApiError("No fue posible obtener las redes sociales", 503);
  }
}

export async function getDecalogues(type: "decalogue" | "notice") {
  try {
  return await fetch(`${BACKEND_URL}/section-decalogue/type/${type}`, {
    next: { revalidate: 3600 }, // ISR: Cache 1 hora - Decálogos cambian raramente
  }).then<DecaloguesResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as DecaloguesResponse;
    throw new ApiError("No fue posible obtener el decálogo", 503);
  }
}

export async function getDecalogueById(id: number) {
  try {
  return await fetch(`${BACKEND_URL}/decalogue/id/${id}`, {
    next: { revalidate: 600 }, // ISR: Cache 10 minutos - Decálogos individuales cambian ocasionalmente
  }).then<DecalogueResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as DecalogueResponse;
    throw new ApiError("No fue posible obtener el decálogo", 503);
  }
}

export async function getAllCertificationsAndAwards() {
  try {
  return await fetch(`${BACKEND_URL}/certifications`, {
    next: { revalidate: 3600 }, // ISR: Cache 1 hora - Certificaciones cambian raramente
  }).then<CertificationsAndAwardsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as CertificationsAndAwardsResponse;
    throw new ApiError("No fue posible obtener las certificaciones", 503);
  }
}

export async function getFeaturedBlogs(locale: string) {
  // const query = qs.stringify(
  //   new SQBuilder()
  //     .filters("isFeatured", (value) => value.eq(true))
  //     .locale(locale)
  //     .page(1)
  //     .pageSize(5)
  //     .sort({
  //       key: "publishedAt",
  //       type: "desc",
  //     })
  //     .build(),
  //   {
  //     encodeValuesOnly: true,
  //   }
  // );

  const query = qs.stringify(
    {
      filters: {
        isFeatured: {
          $eq: true,
        },
      },
      locale: locale,
      pagination: {
        page: 1,
        pageSize: 5,
      },
      sort: ["fecha:desc", "publishedAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  try {
  return await fetch(
    `${BLOG_URL}/api/blogs?status=published&${query}`
  ).then<BlogsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as BlogsResponse;
    throw new ApiError("No fue posible obtener los blogs destacados", 503);
  }
}

export async function getLatestBlogs(locale: string, limit: number = 5) {
  const query = qs.stringify(
    {
      locale: locale,
      pagination: {
        page: 1,
        pageSize: limit,
      },
      sort: ["fecha:desc", "publishedAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  try {
  return await fetch(
    `${BLOG_URL}/api/blogs?status=published&${query}`
  ).then<BlogsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as BlogsResponse;
    throw new ApiError("No fue posible obtener los últimos blogs", 503);
  }
}

export async function getBlogsByTopic(
  locale: string,
  topic: (string | string[]) | undefined,
  page: number,
  pageSize: number,
  omitArticles?: number[] | number
) {
  const filters = {
    ...(omitArticles && {
      id: {
        $notIn: Array.isArray(omitArticles) ? omitArticles : [omitArticles],
      },
    }),
    tags: {
      name: Array.isArray(topic) ? { $in: topic } : { $contains: topic ?? "" },
    },
  };

  const query = qs.stringify(
    {
      filters,
      locale,
      pagination: {
        page,
        pageSize,
      },
      sort: ["fecha:desc", "publishedAt:desc"],
    },
    { encodeValuesOnly: true }
  );

  return await fetch(
    `${BLOG_URL}/api/blogs?status=published&${query}`
  ).then<BlogsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function getBlogsByCategory(
  locale: string,
  category: (string | string[]) | undefined,
  page: number,
  pageSize: number,
  omitArticles?: number[] | number
) {
  const query = qs.stringify(
    {
      locale,
      category: Array.isArray(category) ? category.join(",") : category ?? "",
      status: "published",
      ...(omitArticles && {
        omitArticles: Array.isArray(omitArticles)
          ? omitArticles.join(",")
          : String(omitArticles),
      }),
      page,
      pageSize,
    },
    { encodeValuesOnly: true }
  );

  try {
  return await fetch(
    `${BLOG_URL}/api/blogs/findByCategory?${query}`
  ).then<BlogsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as BlogsResponse;
    throw new ApiError("No fue posible obtener los blogs", 503);
  }
}

export async function getBlogTopics(locale: string) {
  const query = qs.stringify(
    {
      locale,
      pagination: {
        page: 1,
        pageSize: 100,
      },
      sort: ["name:asc"],
    },
    { encodeValuesOnly: true }
  );
  try {
  return await fetch(
    `${BLOG_URL}/api/tags?status=published&${query}`
  ).then<BlogTopicsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as BlogTopicsResponse;
    throw new ApiError("No fue posible obtener los temas del blog", 503);
  }
}

export async function getBlogCategories(locale: string) {
  const query = qs.stringify(
    {
      locale,
      pagination: {
        page: 1,
        pageSize: 100,
      },
      sort: ["name:asc"],
    },
    { encodeValuesOnly: true }
  );

  try {
  return await fetch(
    `${BLOG_URL}/api/categories?status=published&${query}`
  ).then<BlogCategoryResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
  } catch {
    if (isDevelopment) return {} as BlogCategoryResponse;
    throw new ApiError("No fue posible obtener las categorías del blog", 503);
  }
}

export async function getBlogBySlug<
  State extends "published" | "draft",
  Result = State extends "published" ? BlogItem : Partial<BlogItem>
>(locale: string, slug: string, state: State): Promise<Result> {
  return await fetch(`${BLOG_URL}/api/blogs/findBySlug?slug=${encodeURIComponent(slug)}&status=${state}&locale=${locale}`)
    .then<BlogsResponse>(async (res) => {
      if (res.ok) return await res.json();
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        throw new ApiError("Error desconocido", res.status);
      }
    })
    .then((data) => {
      if (data === null) {
        throw new ApiError("Blog no encontrado", 404);
      }

      return data as Result;
    });
}

export async function getBlogBySearch(
  search: string,
  page: number,
  pageSize: number,
  locale: string
) {
  return await fetch(
    `${BLOG_URL}/api/blogs/findByName?name=${search}&status=published&locale=${locale}&page=${page}&pageSize=${pageSize}`
  ).then<BlogsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function getBlogByAuthor(
  firstName: string,
  lastName: string,
  page: number,
  pageSize: number,
  locale: string
) {
  const query = qs.stringify(
    {
      filters: {
        createdBy: {
          firstname: { $eq: firstName },
          lastname: { $eq: lastName },
        },
      },
      locale,
      pagination: {
        page,
        pageSize,
      },
      sort: ["publishedAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  return await fetch(
    `${BLOG_URL}/api/blogs?status=published&${query}`
  ).then<BlogsResponse>(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function registerNewsletter(email: string) {
  return await fetch(`${BLOG_URL}/api/news-letters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        email,
      },
    }),
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function getNextLaunches() {
  try {
    return await fetch(`${BACKEND_URL}/future-projects/get-all`, {
      next: { revalidate: 600 }, // ISR: Cache 10 minutos - Próximos lanzamientos se actualizan ocasionalmente
    }).then<{
      success: boolean;
      projects: NextLaunch[];
    }>(async (res) => {
      if (res.ok) return await res.json();
      try {
        const data = await res.json();
        if ("error" in data && typeof data.error === "string")
          throw new ApiError(data.error as string, res.status);
        else throw new ApiError("Error desconocido", res.status);
      } catch {
        throw new ApiError("Error desconocido", res.status);
      }
    });
  } catch {
    if (isDevelopment) {
      return {
        success: false,
        projects: [],
      };
    }
    throw new ApiError("No fue posible obtener los proyectos", 503);
  }
}

export async function sendContactFormNextLaunches(
  id: number,
  body: {
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    state: string;
    phone: string;
    message: string;
    recaptcha: string;
  }
) {
  return await fetch(`${BACKEND_URL}/future-projects/email/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (res.ok) return await res.json();
    try {
      const data = await res.json();
      if ("error" in data && typeof data.error === "string")
        throw new ApiError(data.error as string, res.status);
      else throw new ApiError("Error desconocido", res.status);
    } catch {
      throw new ApiError("Error desconocido", res.status);
    }
  });
}

export async function getPromotionByProjectId(projectId: number) {
  return await fetch(
    `${BACKEND_URL}/project-promotions/get-by-project/${projectId}`
  ).then(async (res) => {
    if (res.ok) {
      const response = await res.json();

      if (response.success) {
        return response.promotion;
      } else {
        return null;
      }
    }
  });
}

export async function getUrgencyByPropertyId(propertyId: number) {
  return await fetch(
    `${BACKEND_URL}/property-urgency-chip/get-by-property/${propertyId}`
  ).then(async (res) => {
    if (res.ok) {
      const response = await res.json();

      if (response.success) {
        return response.chip;
      } else {
        return null;
      }
    }
  });
}
