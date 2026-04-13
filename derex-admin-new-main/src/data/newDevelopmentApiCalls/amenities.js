import { QueryClient } from 'react-query';
import { apiService } from '../APICalls';

export const queryClient = new QueryClient();

export const api_getAmenities = async (developmentId, token) => {
  const { data } = await apiService.get(`/future-projects/amenity/get-all/${developmentId}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_createAmenity = async (body, token) => {
  const data = await apiService.post('/future-projects/amenity/create', body, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_updateAmenity = async (id, body, token) => {
  const data = await apiService.post(`/future-projects/amenity/update/${id}`, body, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_deleteAmenity = async (amenityId, token) => {
  const data = await apiService.delete(`/future-projects/amenity/delete/${amenityId}`, {
    headers: {
      token,
    },
  });
  return data;
};
