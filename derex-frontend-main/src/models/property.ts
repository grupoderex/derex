import { type Price } from "./price";

export interface Property {
  id: number;
  id_project: number;
  type: string;
  name: string;
  short_name: string;
  description: string;
  description_eng: string;
  rooms: number;
  bathrooms: number;
  restrooms: number;
  delivery_status: string;
  construction_status: string;
  architectural_plans_url?: string;
  "360_video": string;
  materport_video: string;
  cars_garage_capacity: number;
  cars_parking_lot_capacity: number;
  floors: number;
  square_meters: number;
  price_base_mxn: number;
  price_m2_extra_mxn: number;
  ubication?: string;
  email_contact?: string;
  phone_contact?: string;
  featured: string;
  active: number;
  main_image: string;
  main_image_alt_text?: string;
  main_image_vertical: string;
  created_at: string;
  update_at: string;
  project_order: number;
  banner?: string;
  virtual_tour_iframe: string;
  contact_form: ContactForm;
  features: Features;
  isEdgeCertified: number;
  additional_info: AdditionalInfo;
  outstanding: number;
  thumbnail: string;
  thumbnail_alt_text?: string;
  extra_images: ExtraImage[];
  amenidades: Amenidade[];
  blueprints: Blueprint[];
  precios: Price[];
  vertical_floor: number;
}

export interface ContactForm {
  phone_number: string;
  opening_hours: string;
}

export interface Features {
  es: string[];
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

export interface ExtraImage {
  id: number;
  url: string;
  order: number;
  alt_text?: string;
}

export interface Amenidade {
  id: number;
  id_property: number;
  name: string;
  name_eng: string;
  img_url: string;
  id_project?: number;
}

export interface Blueprint {
  id: number;
  id_property: number;
  image_url: string;
  image_alt_text?: string;
  created_at: string;
  update_at: string;
  characteristics_architectural_plans: CharacteristicsArchitecturalPlan[];
  title?: Title;
}

export interface CharacteristicsArchitecturalPlan {
  es: string;
  en: string;
}
