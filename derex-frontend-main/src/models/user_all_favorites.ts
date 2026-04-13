export interface UserAllFavoritesResponse {
  success: boolean;
  message?: string;
  favorites: Favorite[];
}

export interface Favorite {
  user_favorites_id: number;
  id: number;
  name: string;
  delivery_status: string;
  main_image: string;
  city_name: string;
  state_name: string;
  project_id: number;
  project_short_name: string;
}
