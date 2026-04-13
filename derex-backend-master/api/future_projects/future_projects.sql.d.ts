declare module FutureProjectsSql {
  /**
   * @description Create a new future project
   */
  type CreateFutureProject = {
    main_image: string;
    main_image_alt: string;
    secondary_image?: string | null;
    secondary_image_alt?: string | null;
    name: string;
    state_id?: number | null;
    launch_date?: Date | null;
    contact_phone?: string | null;
    contact_email: string;
    type: "Vertical" | "Horizontal" | "Mixed";
    unique_url: string;
  };

  /**
   * @description Create a new future project amenity
   */
  type CreateFutureProjectAmenity = {
    id_future_project: number;
    name_es: string | null;
    name_en: string | null;
  };

  /**
   * @description Future Project SQL service
   */
  type FutureProjectsService = {
    create: (input: CreateFutureProject) => Promise<number>;
    update: (
      projectId: number,
      input: Partial<CreateFutureProject>
    ) => Promise<Models.FutureProject>;
    getAll: () => Promise<Models.FutureProject[]>;
    getAllByStateId: (stateId: number) => Promise<Models.FutureProject[]>;
    getAllByType: (type: string) => Promise<Models.FutureProject[]>;
    getById: (projectId: number) => Promise<Models.FutureProject>;
    delete: (projectId: number) => Promise<Models.FutureProject>;

    createAmenity: (input: CreateFutureProjectAmenity) => Promise<number>;
    getAmenitiesByProjectId: (
      projectId: number
    ) => Promise<Models.FutureAmenityProperty[]>;
    getAmenityById: (
      amenityId: number
    ) => Promise<Models.FutureAmenityProperty>;
    updateAmenity: (
      amenityId: number,
      input: Partial<CreateFutureProjectAmenity>
    ) => Promise<Models.FutureAmenityProperty>;
    deleteAmenity: (amenityId: number) => Promise<Models.FutureAmenityProperty>;
  };
}
