export interface DecaloguesResponse {
  data: DecalogueSection[];
  message: string;
}

export interface DecalogueSection {
  id: number;
  name_es: string;
  name_en: string;
  decalogue: Decalogue[];
}

export interface Decalogue {
  id: number;
  title_es: string;
  title_en: string;
  file: string | null;
}
