import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useRef, useState, useEffect } from 'react';

import { Box, Stack, Button } from '@mui/material';

import useAppContext from 'src/data/DataProvider';

export const Media = ({ mediaInitialData, onFormChange }) => {
  const [media, setMedia] = useState({
    main_image: '',
  });

  const { setMediaForID } = useAppContext();

  const fileRef = useRef();

  useEffect(() => {
    const { main_image } = mediaInitialData;
    setMedia({ main_image });
  }, [mediaInitialData]);

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;

    fRef.onchange = () => {
      toast.info(`Subiendo imagen`);
      if (!fRef.files[0]) onCancel();
      else {
        setMediaForID('file', fRef.files[0]).then(onChange).catch(onCancel);
      }
    };

    fRef.oncancel = onCancel;
    fRef.click();
  };

  const onEditLogo = () => {
    const toastId = toast.loading('Esperando por la selección de la imagen');

    UseFileRefForUpload(
      (a) => {
        toast.update(toastId, {
          render: 'imagen subida correctamente, recuerda guardar cambios para ligarlo al desarrollo',
          type: 'warning',
          isLoading: false,
          autoClose: 5000,
        });

        const updatedFormState = {
          ...media,
          main_image: a,
        };

        setMedia((prevState) => ({ ...prevState, main_image: a }));

        onFormChange(updatedFormState);
      },
      () => {
        toast.update(toastId, {
          render: 'Error al subir la imagen',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      }
    );
  };

  return (
    <>
      <input className="hidden-file" type="file" ref={fileRef} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
        <Stack direction="column">
          <Button onClick={onEditLogo}>
            {media?.main_image ? 'Actualizar imagen principal' : 'Subir imagen principal'}
          </Button>
        </Stack>

        {media?.main_image ? (
          <Box py={2}>
            <img height="200" src={media?.main_image} alt="imagen del próximo desarrollo" />
          </Box>
        ) : null}
      </Stack>
    </>
  );
};

Media.propTypes = {
  mediaInitialData: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
};
