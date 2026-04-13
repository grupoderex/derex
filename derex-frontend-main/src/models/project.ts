export interface Project {
  id: number;
  id_city: number;
  type_project: string;
  type_orientation: "horizontal" | "vertical" | "mixed" | "previous";
  vertical_data: {
    levels: number;
    departments: number;
  } | null;
  name: string;
  short_name: string;
  description: string;
  description_eng: string;
  long_description: string;
  long_description_eng: string;
  logo_color: string;
  logo_color_alt_text?: string;
  logo_grey: string;
  video_url: string;
  email_contact: string;
  phone_contact: string;
  featured: string;
  active: number;
  created_at: string;
  update_at: string;
  latitud: string;
  longitud: string;
  link_map: string;
  ciudad: string;
  colonia: string;
  calle: string;
  numero_ext: string;
  numero_int: string | null;
  cp: string;
  interest_area: InterestArea;
  equipment: Equipment;
  live_the_experience_description: string;
  live_the_experience_description_en: string;
  live_the_experience_url: string;
  wase_link_map: string;
  additional_info: AdditionalInfo;
  outstanding: number;
  banner_url: string;
  contact_form: ContactForm;
  credit_types: string[];
  hasPropertyWithEdgeCertification: boolean;
  is_presale: boolean | 0 | 1;
  thumbnail?: string;
  thumbnail_alt_text?: string;
  promotion_active: boolean;
  document_url?: string;
  url_salesforce: string;
}

export interface InterestArea {
  sp: string[];
  en: string[];
}

export interface Equipment {
  sp: string[];
  en: string[];
}

export interface AdditionalInfo {
  title: Title;
  description: Description;
  image_ulr: string;
  more_info_url: string;
  image_alt_text?: string;
}

export interface Title {
  es: string;
  en: string;
}

export interface Description {
  es: string;
  en: string;
}

export interface ContactForm {
  phone_number: string;
  opening_hours: OpeningHours;
}

export interface OpeningHours {
  es: string;
  en: string;
}
