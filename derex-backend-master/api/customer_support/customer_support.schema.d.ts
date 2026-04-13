declare module CustomerSupportSchema {
  type CreateCustomerSupportSchema = {
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
}
