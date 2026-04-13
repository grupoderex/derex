declare module SocialSql {
  type CreateSocial = {
    name: string;
    icon: string;
    url: string;
  };

  type SocialService = {
    create: (data: CreateSocial) => Promise<number>;
    update: (id: number, data: Partial<CreateSocial>) => Promise<number>;
    getAll: () => Promise<Models.Social[]>;
    getById: (id: number) => Promise<Models.Social>;
    delete: (id: number) => Promise<number>;
  };
}
