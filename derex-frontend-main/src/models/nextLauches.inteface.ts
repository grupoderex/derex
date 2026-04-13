export interface NextLaunch {
  id: number;
  main_image: string;
  main_image_alt: string;
  secondary_image: string;
  secondary_image_alt: string;
  name: string;
  short_description_es: string;
  short_description_en: string;
  state_id: number;
  city_id: number;
  launch_date: string;
  contact_phone: string;
  contact_email: string;
  type: "horizontal" | "vertical" | "mixed";
  unique_url: string;
  created_at: string;
  updated_at: string;
  state_name: string;
  city_name: string;
  amenities: AmenityNextLaunch[];
}

export interface AmenityNextLaunch {
  id: number;
  id_future_project: number;
  name_es: string;
  name_en: string;
}
