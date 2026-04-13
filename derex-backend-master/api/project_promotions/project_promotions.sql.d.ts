declare module ProjectPromotionsSql {
  /**
   * @description Create a new project promotion
   */
  type CreateProjectPromotion = {
    project_id: number;
    title_es: string;
    title_en: string;
    description_es: string;
    description_en: string;
    promo_image: string;
    is_active?: boolean;
  };

  /**
   * @description Project Promotion SQL service
   */
  type ProjectPromotionsService = {
    create: (input: CreateProjectPromotion) => Promise<number>;
    update: (
      promotionId: number,
      input: Partial<CreateProjectPromotion>
    ) => Promise<Models.ProjectPromotion>;
    getAll: () => Promise<Models.ProjectPromotion[]>;
    getById: (promotionId: number) => Promise<Models.ProjectPromotion>;
    getByProjectId: (projectId: number) => Promise<Models.ProjectPromotion>;
    delete: (promotionId: number) => Promise<Models.ProjectPromotion>;
    toggleActive: (
      promotionId: number,
      isActive: boolean
    ) => Promise<Models.ProjectPromotion>;
  };
}
