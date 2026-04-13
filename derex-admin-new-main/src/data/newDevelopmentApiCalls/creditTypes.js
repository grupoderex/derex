import { QueryClient } from 'react-query';
import { apiService } from '../APICalls';

export const queryClient = new QueryClient();


export const api_getCreditTypesCatalogs = async (page, limit, { token }) => {
    const { data } = await apiService.get(`/cat-credit-type/get-by-filters?search=&page=${page}&limit=${limit}`, {
        headers: {
            token,
        },
    });

    return data;
};
