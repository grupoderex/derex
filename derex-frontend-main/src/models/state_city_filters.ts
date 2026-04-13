export interface StateCityFilters {
  state_id: number;
  state_name: string;
  cities: CityFilters[];
}

export interface CityFilters {
  city_id: number;
  city_name: string;
}
