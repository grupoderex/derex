export interface ProjectByFiltersResult {
  state_id: number;
  state_name: string;
  city_id: number;
  city_name: string;
  projects: ProjectByFilters[];
}

export interface ProjectByFilters {
  project_id: number;
  logo_color: string;
  logo_color_alt_text?: string;
  project_name: string;
  credit_types?: string[];
  amenities?: string[];
  amenities_eng?: string[];
  price_base_mxn: number;
  latitud: string;
  longitud: string;
  link_map: string;
  promotion_active: boolean | null;
  promotion: {
    id: number;
    title_es: string;
    title_en: string;
    description_es: string;
    description_en: string;
    promo_image: string;
    is_active: number;
  } | null;
}
