import { QueryClient } from 'react-query';
import { apiService } from '../APICalls';

export const queryClient = new QueryClient();


export const api_getAllStates = async () => {
    const { data } = await apiService.get('/estados');
    return data;
};

export const api_createState = async (stateBody, token) => {
    const { data } = await apiService.post(
        `/estados/`,
        stateBody,
        {
            headers: {
                token,
            },
        }
    );
    return data;
};

export const api_updatedState = async (id, stateBody, token) => {
    const { data } = await apiService.put(
        `/estados/${id}`,
        stateBody,
        {
            headers: {
                token,
            },
        }
    );
    return data;
};