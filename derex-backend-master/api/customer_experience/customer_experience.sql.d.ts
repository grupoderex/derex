declare module CustomerExperienceSql {
  type CreateCustomerExperience = {
    project_id: number;
    description_es: string;
    description_en: string;
    url: string;
  };

  type CustomerExperienceService = {
    create: (data: CreateCustomerExperience) => Promise<number>;
    update: (id: number, data: CreateCustomerExperience) => Promise<number>;
    getAll: () => Promise<Models.CustomerExperience[]>;
    getById: (id: number) => Promise<Models.CustomerExperience>;
    delete: (id: number) => Promise<number>;
  };
}
