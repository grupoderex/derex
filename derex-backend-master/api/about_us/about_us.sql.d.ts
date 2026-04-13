declare module AboutUsSql {
  type CreateAboutUs = {
    index_order: number;
    image_url: string;
    is_image_left: boolean;
    content: string;
  };

  type AboutUsService = {
    create: (data: CreateAboutUs) => Promise<number>;
    update: (id: number, data: Partial<CreateAboutUs>) => Promise<number>;
    upsertMany: (data: CreateAboutUs[]) => Promise<number>;
    getAll: () => Promise<Models.AboutUs[]>;
    getById: (id: number) => Promise<Models.AboutUs>;
    delete: (id: number) => Promise<number>;
  };
}
