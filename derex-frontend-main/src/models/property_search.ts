export interface PropertySearch {
  id: number;
  project_order: number;
  active: number;
  banner?: string;
  type?: string;
  name: string;
  description: string;
  description_eng: string;
  rooms: number;
  bathrooms: number;
  restrooms: number;
  delivery_status?: string;
  construction_status?: string;
  cars_garage_capacity: number;
  cars_parking_lot_capacity: number;
  floors: number;
  main_image: string;
  main_image_alt_text?: string;
  "360_video"?: string;
  materport_video: string;
  id_project: number;
  full_address: string;
  latitud: string;
  longitud: string;
  video_url: string;
  thumbnail: string;
  thumbnail_alt_text?: string;
  virtual_tour_iframe?: string;
  contact_form?: ContactForm;
  extra_images: ExtraImage[];
  precios: Precio[];
  blueprints: Blueprint[];
  vertical_floor: number;
  features: {
    es: string[];
    en: string[];
  };
  has_urgency_chip?: boolean;
}

export interface ContactForm {
  phone_number: string;
  opening_hours: string;
}

export interface ExtraImage {
  id: number;
  url: string;
  order: number;
  alt_text?: string;
}

export interface Precio {
  id: number;
  id_property: number;
  name: string;
  price_base: number;
  price_m2_ext: number;
}

export interface Blueprint {
  image_url: string;
  image_alt_text?: string;
  characteristics_architectural_plans: string[];
}
