// Type definitions for contact module

export interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  development?: string;
  typeOfCredit?: string;
  message: string;
  recaptcha?: string;
}

export interface SalesforceResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
  error?: string;
}

export interface SalesforceParams {
  captcha_settings: string;
  oid: string;
  retURL: string;
  "g-recaptcha-response": string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  "00N3l00000Q7A50": string; // birthDate
  "00N3l00000Q7A54": string; // development
  "00N3l00000Q7A5V": string; // typeOfCredit
  "00N3l00000Q7A57": string; // source
  "00N3l00000Q7A4n": string; // medium
  "00N3l00000Q7A5S": string; // campaign
  message: string;
  acceptPolicy: string;
}
