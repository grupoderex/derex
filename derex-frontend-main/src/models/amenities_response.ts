export interface AmenitiesResponse {
  success: boolean;
  amenities: Amenity[];
}

export interface Amenity {
  id: number;
  id_property?: number;
  name: string;
  name_eng: string;
  img_url?: string;
  img_alt_text?: string;
  id_project: number;
  order?: number;
}
