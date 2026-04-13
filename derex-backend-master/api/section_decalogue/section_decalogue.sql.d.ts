declare module SectionDecalogueSql {
  type CreateSectionDecalogue = {
    name_es: string;
    name_en: string;
    type: string;
  };

  type SectionDecalogueService = {
    create: (data: CreateSectionDecalogue) => Promise<number>;
    update: (
      id: number,
      data: Partial<CreateSectionDecalogue>
    ) => Promise<number>;
    getAll: () => Promise<Models.SectionDecalogue[]>;
    getById: (id: number) => Promise<Models.SectionDecalogue>;
    delete: (id: number) => Promise<number>;
  };
}
