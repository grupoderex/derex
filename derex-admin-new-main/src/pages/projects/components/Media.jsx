import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { Box, Button, Stack, TextField } from '@mui/material';

import useAppContext from 'src/data/DataProvider';

const getUploadErrorMessage = (error, fallbackMessage) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403) return 'Sesion expirada. Inicia sesion de nuevo';
  if (error?.message === 'Sesion invalida o expirada') return 'Sesion expirada. Inicia sesion de nuevo';
  return fallbackMessage;
};

export const Media = ({ mediaInitialData, onFormChange }) => {
  const [media, setMedia] = useState({
    logo_color: '',
    video_url: '',
    logo_color_alt_text: '',
  });

  const { setMediaForID, setMediaVideoForID } = useAppContext();

  const fileRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const { logo_color, video_url, logo_color_alt_text } = mediaInitialData;
    setMedia({ logo_color, video_url, logo_color_alt_text });
  }, [mediaInitialData]);

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;

    fRef.onchange = () => {
      toast.info(`Subiendo imagen`);
      if (!fRef.files[0]) onCancel();
      else {
        setMediaForID('file', fRef.files[0]).then(onChange).catch((error) => onCancel(error));
      }

      fRef.value = '';
    };

    fRef.oncancel = onCancel;
    fRef.click();
  };

  const UseVideoRefForUpload = (onChange, onCancel) => {
    const fRef = videoRef.current;

    fRef.onchange = () => {
      const selectedFile = fRef.files[0];
      toast.info(`Subiendo media de fondo`);
      if (!selectedFile) onCancel();
      else {
        const uploadMedia = selectedFile.type?.startsWith('image/')
          ? setMediaForID
          : setMediaVideoForID;

        uploadMedia('file', selectedFile)
          .then(onChange)
          .catch((error) => onCancel(error))
          .then(() => {
            fRef.value = '';
          });
      }
    };

    fRef.oncancel = onCancel;
    fRef.click();
  };

  const onVideoView = () => {
    window.open(media.video_url);
  };

  const onEditLogo = () => {
    const toastId = toast.loading('Esperando por la seleccion del logo');

    UseFileRefForUpload(
      (a) => {
        toast.update(toastId, {
          render: 'Logo subido correctamente, recuerda guardar cambios para ligarlo al desarrollo',
          type: 'warning',
          isLoading: false,
          autoClose: 5000,
        });

        setMedia((prevState) => ({ ...prevState, logo_color: a }));
        onFormChange({ logo_color: a });
      },
      (error) => {
        toast.update(toastId, {
          render: getUploadErrorMessage(error, 'Error al subir el Logo'),
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      }
    );
  };

  const onEditVideo = () => {
    const toastId = toast.loading('Esperando por la seleccion de la media de fondo');

    UseVideoRefForUpload(
      (data) => {
        toast.update(toastId, {
          render: 'Media de fondo subida correctamente, recuerda guardar cambios para ligarlo al desarrollo',
          type: 'warning',
          isLoading: false,
          autoClose: 5000,
        });

        setMedia((prevState) => ({ ...prevState, video_url: data }));
        onFormChange({ video_url: data });
      },
      (error) => {
        toast.update(toastId, {
          render: getUploadErrorMessage(error, 'Error al subir la media de fondo'),
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      }
    );
  };

  return (
    <>
      <input className="hidden-file" type="file" ref={fileRef} accept="image/*" />
      <input className="hidden-file" type="file" ref={videoRef} accept="video/mp4,video/webm,video/ogg,image/*" />

      <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
        <Stack direction="column">
          <Button onClick={onEditLogo}>
            {media?.logo_color ? 'Actualizar logo' : 'Subir logo'}
          </Button>
        </Stack>

        {media?.logo_color ? (
          <Box py={2}>
            <img height="200" src={media?.logo_color} alt="Logo de desarrollo" />
          </Box>
        ) : null}
      </Stack>

      <TextField
        fullWidth
        name="logo_color_alt_text"
        value={media.logo_color_alt_text}
        onChange={(e) => {
          setMedia((prevState) => ({ ...prevState, logo_color_alt_text: e.target.value }));
          onFormChange({ logo_color_alt_text: e.target.value });
        }}
        label="Texto alternativo del logo"
        variant="outlined"
      />

      {media.video_url ? (
        <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
          Media de Fondo
          <Stack direction="row">
            <Button sx={{ marginRight: 1 }} onClick={onEditVideo}>
              Reemplazar
            </Button>

            <Button variant="contained" sx={{ marginRight: 1 }} onClick={onVideoView}>
              Abrir
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
          <Button onClick={onEditVideo} my={2}>
            {media?.video_url ? 'Actualizar media de fondo' : 'Subir media de fondo'}
          </Button>
        </Stack>
      )}
    </>
  );
};

Media.propTypes = {
  mediaInitialData: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
};
