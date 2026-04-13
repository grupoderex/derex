declare module StateSchema {
  type CreateStateSchema = {
    name: string;
    banner_url: string | null;
  };

  type UpdateStateSchema = {
    name: string;
    banner_url: string | null;
    active: 1 | 0;
  };
}
