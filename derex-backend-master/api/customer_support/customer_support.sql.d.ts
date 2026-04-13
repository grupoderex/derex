declare module CustomerSupportSql {
  type CreateCustomerSupport = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    acquired_subdivision: string;
    street_address: string;
    street_number: string;
    block: string;
    lot: string;
    subject: string;
    message: string;
  };

  type CustomerSupportService = {
    create: (createInput: CreateCustomerSupport) => Promise<number>;
    getAll: () => Promise<Models.CustomerSupport[]>;
    getById: (id: number) => Promise<Models.CustomerSupport>;
  };
}
