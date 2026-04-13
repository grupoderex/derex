declare module AdminSql {
  type CreateAdmin = {
    name: string;
    hashed_password: string;
    email: string;
    phone: string;
    role: "owner" | "sales" | "marketing" | "IT";
  };

  type AdminService = {
    create: (input: CreateAdmin) => Promise<Models.Admin>;
    getAll: () => Promise<Models.Admin[]>;
    getById: (id: number) => Promise<Models.Admin>;
    delete: (id: number) => Promise<Models.Admin>;
  };
}
