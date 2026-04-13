import { toast } from 'react-toastify';
import { useState, useEffect } from 'react'

import useAppContext from 'src/data/DataProvider';
import { api_getCreditTypesCatalogs } from 'src/data/projectApiCalls/creditTypes';

export const useCreditType = (page, limit) => {
    const { dataAuth } = useAppContext();
    const [credits, setCredits] = useState([]);

    const onFetch = async () => {
        try {
            const { data: { data } } = await api_getCreditTypesCatalogs(page, limit, dataAuth);

            setCredits(data);
        } catch (error) {
            toast.error('Error al cargar los tipos de créditos')
        }
    }

    useEffect(() => {
        onFetch()
    }, [])


    return {
        credits
    }

}
