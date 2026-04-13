export type ContratosDeAdhesionResponse = ContratoDeAdhesion[];

export interface ContratoDeAdhesion {
  section: string;
  documents: Document[];
}

export interface Document {
  id: number;
  name: string;
  url: string;
  active: number;
  page: string;
  section: string;
}
