import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useRef, useState, useEffect } from 'react';

import { Box, Stack, Button } from '@mui/material';

import useAppContext from 'src/data/DataProvider';

export const Banner = ({ onFormChange, bannerInitialData }) => {
  const [banner, setBanner] = useState({
    banner_url: '',
  });

  const { setMediaForID } = useAppContext();

  const fileRef = useRef();

  useEffect(() => {
    if (!bannerInitialData) return;

    const { banner_url } = bannerInitialData;
    setBanner({ banner_url });
  }, [bannerInitialData]);

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;

    fRef.onchange = () => {
      toast.info(`Subiendo banner`);
      if (!fRef.files[0]) onCancel();
      else {
        setMediaForID('file', fRef.files[0]).then(onChange).catch(onCancel);
      }
    };

    fRef.oncancel = onCancel;
    fRef.click();
  };

  const onEditBanner = () => {
    const toastId = toast.loading('Esperando por la seleccion del banner');

    UseFileRefForUpload(
      (res) => {
        toast.update(toastId, {
          render:
            'Banner subido correctamente, recuerda guardar cambios para ligarlo al desarrollo',
          type: 'warning',
          isLoading: false,
          autoClose: 3000,
        });

        const updatedFormState = {
          banner_url: res,
        };

        setBanner(updatedFormState);

        onFormChange(updatedFormState);
      },
      () => {
        toast.update(toastId, {
          render: 'Error al subir el banner',
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
          <Button onClick={onEditBanner}>
            {banner?.banner_url ? 'Actualizar banner' : 'Subir banner'}
          </Button>
        </Stack>

        {banner?.banner_url && (
          <Box py={2}>
            <img height="100" src={banner?.banner_url} alt="Banner de estado" />
          </Box>
        )}
      </Stack>
    </>
  );
};

Banner.propTypes = {
  bannerInitialData: PropTypes.object,
  onFormChange: PropTypes.func.isRequired,
};
