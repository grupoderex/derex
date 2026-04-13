import { QueryClient } from 'react-query';
import { apiService } from '../APICalls';

export const queryClient = new QueryClient();

export const api_getAmenities = async (projectId, token, type) => {
  const { data } = await apiService.get(`/amenidades/get_all/${projectId}?type=${type}`, {
    headers: {
      token,
    },
  });
  return data;
};

export const api_updateAmenity = async (id, body, token) => {
  const data = await apiService.patch(
    `/amenidades/update/${id}`,
    {
      ...body,
      image_url: body.img_url ? body.img_url : undefined,
      name: body.name ? body.name : undefined,
      name_eng: body.name_eng ? body.name_eng : undefined,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_createAmenity = async (body, token) => {
  const data = await apiService.post(
    '/amenidades/create',
    {
      ...body,
      name: body.name ? body.name : undefined,
      name_eng: body.name_eng ? body.name_eng : undefined,
    },
    {
      headers: {
        token,
      },
    }
  );
  return data;
};

export const api_deleteAmenity = async (amenityId, token) => {
  const data = await apiService.delete(`/amenidades/delete/${amenityId}`, {
    headers: {
      token,
    },
  });
  return data;
};
