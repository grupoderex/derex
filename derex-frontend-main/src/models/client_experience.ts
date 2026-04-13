export interface ClientExperience {
  id: number;
  description_es: string;
  description_en: string;
  url: string;
  project_name: string;
  project_logo: string;
}

export interface ClientExperienceListResponse {
  status: string;
  data: ClientExperience[];
}

export interface ClientExperienceResponse {
  status: string;
  data: ClientExperience;
}
