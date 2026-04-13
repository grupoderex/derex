export interface AboutSection {
  index_order: number;
  image_url: string;
  image_alt_text?: string;
  is_image_left: boolean;
  content_es: string;
  content_en: string;
}

export interface AboutSectionListResponse {
  status: string;
  data: AboutSection[];
}
