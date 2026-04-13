import { QueryClient } from 'react-query';
import { apiService } from '../APICalls';

export const queryClient = new QueryClient();

export const api_createNewDevelopment = async (data, token) => {
  const { data: result } = await apiService.post(`/future-projects/create`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_updateNewDevelopment = async (id, data, token) => {
  const { data: result } = await apiService.patch(`/future-projects/update/${id}`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_getAllNewDevelopments = async () => {
  const {
    data: { projects },
  } = await apiService.get('/future-projects/get-all');

  return projects;
};

export const api_getNewDevelopmentById = async (id) => {
  const { data } = await apiService.get(`/future-projects/get/${id}`);

  return data;
};

export const api_validateUniqueUrl = async (data, token) => {
  const { data: result } = await apiService.post(`/future-projects/validate-unique-url`, data, {
    headers: {
      token,
    },
  });
  return result;
};

export const api_deleteNewDevelopment = async (id, token) => {
  const { data: result } = await apiService.delete(`/future-projects/delete/${id}`, {
    headers: {
      token,
    },
  });
  return result;
};
