declare module PropertySql {
  type CreateProperty = {
    banner: string;
    materport_video: string;
    bathrooms: number;
    cars_garage_capacity: number;
    cars_parking_lot_capacity: number;
    rooms: number;
    restrooms: string;
    name: string;
    description: string;
    description_eng: string;
    main_image: string;
    id_project: number;
    floors: number;
    square_meters: number;
    active: 1 | 0;
    project_order: number;
    isEdgeCertified: 1 | 0;
    features: Feature | null;
    additional_info: Models.AdditionalInfo | null;
    thumbnail: string | null;
  };

  type UpdateProperty = {
    banner: string | null;
    materport_video: string;
    bathrooms: number;
    cars_garage_capacity: number;
    cars_parking_lot_capacity: number;
    rooms: number;
    restrooms: string;
    name: string;
    description: string;
    description_eng: string;
    main_image: string;
    id_project: number;
    floors: number;
    square_meters: number;
    active: 1 | 0;
    project_order: number;
    isEdgeCertified: 1 | 0;
    features: Feature | null;
    thumbnail: string | null;
  };

  type Feature = {
    es: string[];
    en: string[];
  };

  type PropertyService = {
    search: (search: {
      project?: number;
      state?: number;
      showInactives?: 1 | 0;
      type?: "horizontal" | "vertical";
    }) => Promise<Models.Property[]>;
    getAll: () => Promise<Models.Property[]>;
    getById: (
      propertyId: number
    ) =>
      | Promise<Models.Property | null>
      | Promise<{ error: string; detail: string }>;
    create: (newProperty: CreateProperty) => Promise<number>;
    update: (
      propertyId: number,
      updatedData: UpdateProperty
    ) => Promise<number>;
    delete: (
      propertyId: number
    ) => Promise<number> | Promise<{ error: string; detail: string }>;
    getPriceFromByProjectId: (projectId: number) => Promise<any[]>;
    getAllPropertiesForHome: () => Promise<[number, object]>;
  };
}
