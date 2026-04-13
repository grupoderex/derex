declare module SectionsFooterSql {
  type CreateSectionsFooter = {
    name: string;
    name_eng: string;
    path: string;
    is_url: boolean;
    active: boolean;
    section: string;
  };

  type SectionsFooterService = {
    create: (data: CreateSectionsFooter) => Promise<number>;
    update: (
      id: number,
      data: Partial<CreateSectionsFooter>
    ) => Promise<number>;
    getAll: () => Promise<Models.SectionsFooter[]>;
    getAllActives: () => Promise<Models.SectionsFooter[]>;
    getById: (id: number) => Promise<Models.SectionsFooter>;
    delete: (id: number) => Promise<number>;
  };
}
