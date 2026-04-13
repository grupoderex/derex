declare module StateSql {
  type CreateState = {
    name: string;
    banner_url: string | null;
    active?: 1 | 0;
  };

  type GetStateCitiesFiltersSchema = {
    state_id: number | null;
    city_id: number | null;
  };

  type StateService = {
    create: (createInput: CreateState) => Promise<number>;
    update: (id: number, updateInput: CreateState) => Promise<number>;
    getAll: () => Promise<Models.State[]>;
    getById: (id: number) => Promise<Models.State>;
    delete: (id: number) => Promise<number>;
    getAllStatesCitiesFilters: (filters?: GetStateCitiesFiltersSchema) => Promise<[number, object]>;
  };
}
