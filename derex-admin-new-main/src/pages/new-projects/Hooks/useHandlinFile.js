import { toast } from 'react-toastify';
import { useState, useEffect } from "react";

const UseHandlinFile = (file) => {
    const [data, setData] = useState(null);

    useEffect(
        () => {
            if (file == null) return;

            const toastId = toast.loading('Esperando por la seleccion de la imagen');
            toast.info('Subiendo Imagen');

            if (!file) {
                toast.update(toastId, {
                    render: 'Error al subir la imágen',
                    type: 'error',
                    isLoading: false,
                    autoClose: 5000,
                });
            } else {
                setData(file)

            }

        }, [file])


    return [data];
};

export default UseHandlinFile;