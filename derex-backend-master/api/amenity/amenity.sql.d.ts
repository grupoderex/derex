declare module AmenitySql {
  /**
   * @description Create a new amenity
   */
  type CreateAmenity = {
    name: string;
    name_eng: string;
    img_url: string | null;
    id_project: number;
    order?: number | null;
  };

  /**
   * @description Amenity SQL service
   */
  type AmenityService = {
    create: (input: CreateAmenity) => Promise<number>;
    update: (
      amenityId: number,
      input: CreateAmenity
    ) => Promise<Models.AmenityProperty>;
    getAllByProjectId: (
      propertyId: number
    ) => Promise<Models.AmenityProperty[]>;
    getById: (id: number) => Promise<Models.AmenityProperty>;
    delete: (id: number) => Promise<Models.AmenityProperty>;
  };
}
