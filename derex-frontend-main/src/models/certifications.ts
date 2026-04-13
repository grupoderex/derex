export interface CertificationsAndAwardsResponse {
  data: CertificationsAndAwards[];
  message: string;
}

export interface CertificationsAndAwards {
  id: number;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  date: string;
  button_url: string;
  button_url_en?: string;
  new_tab: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
  image_alt_text?: string;
  show_date: boolean;
}
