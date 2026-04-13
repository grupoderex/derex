// En servidor (SSR/ISR), USA la variable privada BACKEND_URL
// En cliente, FALLBACK a NEXT_PUBLIC_REACT_APP_BACKEND_URL
export const BACKEND_URL =
  typeof window === "undefined"
    ? process.env.BACKEND_URL?.trim() || process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL
    : process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL;

export const SERVER_BACKEND_URL = process.env.BACKEND_URL;

export const BLOG_URL =
  (typeof window === "undefined"
    ? process.env.BLOG_URL?.trim() || process.env.NEXT_PUBLIC_REACT_APP_BLOG_URL?.trim()
    : process.env.NEXT_PUBLIC_REACT_APP_BLOG_URL?.trim()) ||
  "https://blog.javer.com.mx";
export const GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_KEY;
export const HAS_GOOGLE_MAPS_KEY = Boolean(GOOGLE_MAPS_KEY?.trim());
export const ENABLE_GOOGLE_MAPS_IN_DEV =
  process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAPS_DEV === "true";
export const SHOULD_LOAD_GOOGLE_MAPS =
  HAS_GOOGLE_MAPS_KEY &&
  (process.env.NODE_ENV === "production" || ENABLE_GOOGLE_MAPS_IN_DEV);
export const S3_URL = process.env.NEXT_PUBLIC_REACT_APP_S3_URL;
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? "";
export const PHONE_NUMBER =
  process.env.REACT_APP_PHONE_NUMBER ?? "81 1133-6614\n81 1133-6611";
export const SALESFORCE_URL_PREFIX =
  process.env.NODE_ENV !== "production" ? "test" : "webto";
export const SALESFORCE_ORG_ID =
  process.env.NODE_ENV !== "production" ? "00DEm000002Htjh" : "00Do0000000b6Io";
export const SALESFORCE_URL = `https://${SALESFORCE_URL_PREFIX}.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=${SALESFORCE_ORG_ID}`;
