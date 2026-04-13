export interface LocationHierarchy {
  id: number;
  name: string;
  active: number;
  created_at: string;
  update_at: string;
  banner_url?: string;
  ciudades: Ciudade[];
}

export interface ResponseFormatted {
  data: LocationHierarchyFormatted[];
}

export interface LocationHierarchyFormatted {
  id: number;
  name: string;
  active: number;
  created_at: string;
  update_at: string;
  banner_url: string;
  ciudades: {
    id: number;
    name: string;
    active: number;
    created_at: string;
    update_at: string;
    desarrollos: {
      id: number;
      name: string;
      short_name: string;
      created_at: string;
      update_at: string;
      prototipos: {
        id: number;
        name: string;
        created_at: string;
        update_at: string;
      }[];
    }[];
  }[];
}

export interface Ciudade {
  id: number;
  name: string;
  id_state: number;
  active: number;
  created_at: string;
  update_at: string;
  proyectos: Proyecto[];
}

export interface Proyecto {
  id: number;
  id_city: number;
  type_project: string;
  name: string;
  short_name: string;
  type_orientation: "horizontal" | "vertical" | "mixed" | "previous";
  vertical_data: {
    levels: number;
    departments: number;
  } | null;
  description: string;
  description_eng: string;
  long_description: string;
  long_description_eng: string;
  logo_color: string;
  logo_color_alt_text?: string;
  logo_grey?: string;
  video_url: string;
  email_contact?: string;
  phone_contact: string;
  featured: string;
  active: number;
  created_at: string;
  update_at: string;
  latitud: string;
  longitud: string;
  link_map: string;
  ciudad?: string;
  colonia: string;
  calle: string;
  numero_ext?: string;
  numero_int?: string;
  cp: string;
  interest_area?: string;
  equipment?: string;
  live_the_experience_description?: string;
  live_the_experience_description_en?: string;
  live_the_experience_url?: string;
  wase_link_map?: string;
  additional_info?: string;
  outstanding: number;
  banner_url?: string;
  contact_form?: string;
  thumbnail?: string;
  thumbnail_alt_text?: string;
  is_presale?: 0 | 1;
  promotion_active: 0 | 1;
}
