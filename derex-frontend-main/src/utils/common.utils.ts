export function capitalizeString(str: string) {
  try {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } catch {
    return "";
  }
}

export function toCurrency(number: number) {
  try {
    return number.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } catch {
    return "";
  }
}

export const toTitleCase = (str: string) => {
  str = str.replace(/-/g, " ");
  return str.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
};

export const toUpperCase = (str: string) => {
  str = str.replace(/-/g, " ");
  return str.toUpperCase();
};

export const toUrlCase = (str: string) => {
  return str?.replace(/\s+/g, "-").toLowerCase();
};

export const formatPhoneNumber = (number: string) => {
  return `(${number.slice(0, 2)}) ${number.slice(2, 6)}-${number.slice(6)}`;
};

export function normalizeString(str: string): string {
  const decodedName = decodeURIComponent(str);
  return decodedName;
}
