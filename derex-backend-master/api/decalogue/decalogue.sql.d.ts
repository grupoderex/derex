declare module DecalogueSql {
  type CreateDecalogue = {
    title_es: string;
    title_en: string;
    content: string;
    content_date: Date;
    file: string;
  };

  type DecalogueService = {
    create: (data: CreateDecalogue) => Promise<number>;
    update: (id: number, data: Partial<CreateDecalogue>) => Promise<number>;
    getAll: () => Promise<Models.Decalogue[]>;
    getById: (id: number) => Promise<Models.Decalogue>;
    delete: (id: number) => Promise<number>;
  };
}
