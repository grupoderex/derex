export interface SectionResponse {
  navbar: Navbar[];
  footer: FooterType[];
}

export interface Navbar {
  id: number;
  name: string;
  path: string;
  active: number;
  name_eng: string;
}

export interface FooterType {
  id: number;
  name: string;
  name_eng: string;
  path: string;
  active: number;
  section?: "info" | "company" | "investors" | "client";
  is_bold?: number;
  is_url?: boolean;
}
