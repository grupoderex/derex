import { QueryClient } from 'react-query';
import { apiService } from '../APICalls';

export const queryClient = new QueryClient();

export const api_setMediaForID = async (id, file, token) => {
  const formData = new FormData();
  formData.append('imgid', id);
  formData.append('file', file);

  const { data } = await apiService.post('pdf/set_file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token,
    },
  });

  return data;
};

export const api_setMediaVideoForID = async (id, file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiService.post('/media/set_video_development', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token,
    },
  });

  return data;
};

export const api_setPdfForID = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiService.post('pdf/set_file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      token,
    },
  });

  return data;
};
