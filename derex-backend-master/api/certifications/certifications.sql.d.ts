declare module CertificationSql {
  type CreateCertification = {
    title_es: string;
    title_en: string;
    description_es: string;
    description_en: string;
    date: Date;
    button_url?: string | null;
    new_tab?: boolean | null;
  };

  type CertificationService = {
    create: (data: CreateCertification) => Promise<number>;
    update: (id: number, data: Partial<CreateCertification>) => Promise<number>;
    getAll: () => Promise<Models.Certification[]>;
    getById: (id: number) => Promise<Models.Certification>;
    delete: (id: number) => Promise<number>;
  };
}
