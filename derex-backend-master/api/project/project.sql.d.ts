declare module ProjectSql {
  type CreateProjectInput = {
    name: string;
    short_name: string;
    description: string;
    long_description: string;
    description_eng: string;
    long_description_eng: string;
    featured: string;
    email_contact: string;
    phone_contact: string;
    calle: string;
    colonia: string;
    id_city: number;
    cp: string;
    latitud: number;
    longitud: number;
    link_map: string;
    logo_color: string;
    video_url: string;
    cat_credits_id: number[];
    interest_area: InterestArea;
    equipment: Equipment;
    live_the_experience_description: string;
    live_the_experience_description_en: string;
    live_the_experience_url: string;
    wase_link_map: string;
    outstanding?: string | bool | null;
    additional_info: Models.AdditionalInfo | null;
    contact_form: Models.ContactForm | null;
    thumbnail?: string | null;
    is_presale?: boolean | null;
  };

  type InterestArea = {
    sp: string[];
    en: string[];
  };

  type Equipment = {
    sp: string[];
    en: string[];
  };

  type GetAllProjectsByFiltersSchema = {
    project_id: number | null;
    state_id: number | null;
    city_id: number | null;
  };

  type ProjectService = {
    create: (createInput: CreateProjectInput) => Promise<number>;
    update: (projectId: number, input: CreateProjectInput) => Promise<void>;
    getAll: () => Promise<Models.Project[]>;
    getById: (id: number) => Promise<Models.Project>;
    delete: (id: number) => Promise<Models.Project>;
    getAllProjectsByFilters: (
      filters?: GetAllProjectsByFiltersSchema
    ) => Promise<[number, object]>;
    getAllProjectsForHome: (
      filters?: GetAllProjectsByFiltersSchema
    ) => Promise<[number, object]>;
  };
}
