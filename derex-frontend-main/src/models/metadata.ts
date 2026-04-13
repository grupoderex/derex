export interface Metadata {
  id: number;
  section: string;
  name: string;
  value: string;
  value_en: string;
  bold: boolean;
  outline: boolean;
  color: boolean;
}

export interface MetadataTitle {
  section: string;
  name: string;
  value: string;
  value_en: string;
  className: string;
}

export interface GetTitlesResponse {
  status: string;
  data: Metadata[];
}

export interface ParsedKnowJaver {
  imageUrl: string;
  altText?: string;
  isImageLeft: string;
  buttonUrl: string;
  isUrlExternal: string;
  titleUpper: MetadataTitle;
  titleLower: MetadataTitle;
  description: MetadataTitle;
  buttonText: MetadataTitle;
}

export interface GetKnowJaverResponse {
  status: string;
  data: Metadata[];
}

export type AvailableSections =
  | "home"
  | "home-contact"
  | "meet-javer"
  | "about-javer"
  | "faq"
  | "footer"
  | "certifications"
  | `project_${number}`
  | `property_${number}`;
