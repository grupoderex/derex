declare module FrequentQuestionsSql {
  type CreateFrequentQuestions = {
    project_id: number;
    question_es: string;
    question_en: string;
    answer_es: string;
    answer_en: string;
    url_link: string;
    open_in_new_tab: boolean;
  };

  type FrequentQuestionsService = {
    create: (data: CreateFrequentQuestions) => Promise<number>;
    update: (id: number, data: CreateFrequentQuestions) => Promise<number>;
    getAll: () => Promise<Models.FrequentQuestion[]>;
    getById: (id: number) => Promise<Models.FrequentQuestion>;
    delete: (id: number) => Promise<number>;
  };
}
