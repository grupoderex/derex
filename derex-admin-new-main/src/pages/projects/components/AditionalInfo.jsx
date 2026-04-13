import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useRef, useState } from 'react';

import { Box, Grid, Button, TextField, Typography } from '@mui/material';

import useAppContext from 'src/data/DataProvider';

import Iconify from 'src/components/iconify/iconify';

export function AditionalInfo({ setData, data }) {
  const fileRef = useRef();
  const { setMediaForID } = useAppContext();
  const [additionalInfo, setAdditionalInfo] = useState(
    data.additional_info || {
      title: {
        es: '',
        en: '',
      },
      description: {
        es: '',
        en: '',
      },
      more_info_url: '',
      image_ulr: '',
      image_alt_text: '',
    }
  );

  const uploadImageDisplay = async () => {
    const fileValue = fileRef.current.files[0];

    if (!fileValue) {
      toast.loading({
        render: 'Error al subir la imágen',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }

    const toastId = toast.loading('Subiendo imagen');

    try {
      const fileProcessed = await setMediaForID('file', fileValue);

      toast.update(toastId, {
        render: 'Imagen subida correctamente, recuerda guardar cambios para ligarla a la propiedad',
        type: 'warning',
        isLoading: false,
        autoClose: 5000,
      });

      setAdditionalInfo((prevState) => ({ ...prevState, image_ulr: fileProcessed }));
      setData({
        ...data,
        additional_info: {
          ...additionalInfo,
          image_ulr: fileProcessed,
        },
      });
    } catch (error) {
      toast.update(toastId, {
        render: 'Error al subir la imagen',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }
    toast.dismiss(toastId);
  };

  const onDeleteImage = () => {
    setAdditionalInfo((prevState) => ({ ...prevState, image_ulr: '' }));
    setData({
      ...data,
      additional_info: {
        ...additionalInfo,
        image_ulr: '',
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedFormState = { ...additionalInfo };

    if (name === 'title_es') {
      updatedFormState = {
        ...additionalInfo,
        title: {
          ...additionalInfo.title,
          es: value,
        },
      };
    } else if (name === 'title_en') {
      updatedFormState = {
        ...additionalInfo,
        title: {
          ...additionalInfo.title,
          en: value,
        },
      };
    } else if (name === 'description_es') {
      updatedFormState = {
        ...additionalInfo,
        description: {
          ...additionalInfo.description,
          es: value,
        },
      };
    } else if (name === 'description_en') {
      updatedFormState = {
        ...additionalInfo,
        description: {
          ...additionalInfo.description,
          en: value,
        },
      };
    } else {
      updatedFormState = {
        ...additionalInfo,
        [name]: value,
      };
    }

    setAdditionalInfo(updatedFormState);
    setData({
      ...data,
      additional_info: updatedFormState,
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} display="flex" alignItems="center" mt={2}>
        <Typography variant="h4">Información adicional</Typography>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="title_es"
            value={additionalInfo.title?.es}
            onChange={handleInputChange}
            label="Título en español"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="title_en"
            value={additionalInfo.title?.en}
            onChange={handleInputChange}
            label="Título en inglés"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="description_es"
            value={additionalInfo.description?.es}
            onChange={handleInputChange}
            label="Descripción en español"
            variant="outlined"
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="description_en"
            value={additionalInfo.description?.en}
            onChange={handleInputChange}
            label="Descripción en inglés"
            variant="outlined"
            multiline
            rows={4}
          />
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="more_info_url"
          value={additionalInfo.more_info_url}
          onChange={handleInputChange}
          label="Link de más información"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <input
          type="file"
          ref={fileRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={uploadImageDisplay}
        />
        <Box
          minHeight={180}
          height="100%"
          m={1}
          p={1}
          sx={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
          borderRadius="0.5rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {additionalInfo.image_ulr ? (
            <Box py={2} alignItems="center" display="flex" flexDirection="column">
              <img
                width="100%"
                style={{ borderRadius: '0.5rem' }}
                height="auto"
                src={additionalInfo.image_ulr}
                alt="Imagen de información adicional"
              />
              <Button onClick={() => onDeleteImage()}>
                <Iconify width={24} icon="mdi:bin" />
              </Button>
            </Box>
          ) : (
            <Button
              sx={{ my: 1, py: 3 }}
              fullWidth
              onClick={() => {
                fileRef.current.click();
              }}
            >
              Subir imagen
            </Button>
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="image_alt_text"
          value={additionalInfo.image_alt_text}
          onChange={handleInputChange}
          label="Texto alternativo de imagen"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
}

AditionalInfo.propTypes = {
  setData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};
