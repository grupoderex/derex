export interface DecalogueResponse {
  data: DecalogueById;
}

export interface DecalogueById {
  id: number;
  title_es: string;
  title_en: string;
  content: string | null;
  content_date: string | null;
  file: string | null;
  section_id: number;
}


export const EMPTY_DECALOGUE: DecalogueById = {
  id: 0,
  title_es: "",
  title_en: "",
  content: null,
  content_date: null,
  file: null,
  section_id: 0,
};