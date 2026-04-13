declare module PropertyUrgencyChipSql {
  /**
   * @description Create a new property urgency chip
   */
  type CreatePropertyUrgencyChip = {
    property_id: number;
    description_es: string;
    description_en: string;
    notification_text_es: string;
    notification_text_en: string;
    is_active?: boolean;
  };

  /**
   * @description property Urgency Chip SQL service
   */
  type propertyUrgencyChipService = {
    create: (input: CreatePropertyUrgencyChip) => Promise<number>;
    update: (
      chipId: number,
      input: Partial<CreatePropertyUrgencyChip>
    ) => Promise<Models.PropertyUrgencyChip>;
    getAll: () => Promise<Models.PropertyUrgencyChip[]>;
    getById: (chipId: number) => Promise<Models.PropertyUrgencyChip>;
    getBypropertyId: (propertyId: number) => Promise<Models.PropertyUrgencyChip>;
    delete: (chipId: number) => Promise<Models.PropertyUrgencyChip>;
    toggleActive: (
      chipId: number,
      isActive: boolean
    ) => Promise<Models.PropertyUrgencyChip>;
  };
}
