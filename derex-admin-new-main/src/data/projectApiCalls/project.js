import { QueryClient } from 'react-query';
import { apiService } from '../APICalls';

export const queryClient = new QueryClient();


export const api_getAllProjects = async () => {
    const { data } = await apiService.get('/proyectos');
    return data;
};

export const api_getProjectById = async (id) => {
    const { data } = await apiService.get(`/proyectos/id/${id}`);
    return data;
};

export const api_deleteProjectById = async (id, token) => {
    const { data } = await apiService.delete(`/proyectos/id/${id}`, {
        headers: {
            token,
        },
    });
    return data;
};

export const api_createProject = async (data, token) => {
    const { data: result } = await apiService.post(`/proyectos`, data, {
        headers: {
            token,
        },
    });
    return result;
};

export const api_updateProject = async (id, data, token) => {
    const { data: result } = await apiService.put(`/proyectos/id/${id}`, data, {
        headers: {
            token,
        },
    });
    return result;
};
