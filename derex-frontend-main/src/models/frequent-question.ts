export interface FrequentQuestion {
  id: number;
  question_es: string;
  question_en: string;
  answer_es: string;
  answer_en: string;
  url_link?: string;
  open_in_new_tab?: boolean;
}

export interface FrequentQuestionResponse {
  status: string;
  data: FrequentQuestion[];
}
