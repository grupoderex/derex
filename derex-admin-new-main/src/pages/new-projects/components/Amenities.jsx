import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import { Box, Grid, Button, TextField, Typography } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_getAmenities,
  api_createAmenity,
  api_deleteAmenity,
} from 'src/data/newDevelopmentApiCalls/amenities';

import Iconify from 'src/components/iconify/iconify';

export const Amenities = ({ id, onAmenitiesChanges }) => {
  const [saving, setSaving] = useState(false);
  const [amenity, setNewAmenity] = useState({
    name_es: '',
    name_en: '',
  });
  const [amenitiesArray, setAmenitiesArray] = useState([]);

  const { dataAuth } = useAppContext();

  useEffect(() => {
    onAmenitiesChanges(amenitiesArray);
  }, [amenitiesArray]);

  useEffect(() => {
    if (id !== 'new') {
      onGetAllAmenities();
    }
  }, [id]);

  const onGetAllAmenities = async () => {
    setSaving(true);

    try {
      const { amenities } = await api_getAmenities(id, dataAuth.token);
      setAmenitiesArray((prevState) => [...amenities]);
      setSaving(false);
    } catch (error) {
      toast.error('Error al agregar una nueva amenidad');

      setSaving(false);
    }
  };

  const saveAmenity = async () => {
    setSaving(true);
    if (id === 'new') {
      onAmenitiesChanges(amenitiesArray);
      setSaving(false);

      setAmenitiesArray((prevState) => [
        ...prevState,
        {
          name_es: amenity.name_es,
          name_en: amenity.name_en,
        },
      ]);
      setNewAmenity({ name_es: '', name_en: '' });
      toast.success('Nueva amenidad agregada');
      return;
    }

    try {
      const body = {
        ...amenity,
        id_future_project: id,
      };

      const { data: response } = await api_createAmenity(body, dataAuth.token);

      toast.success('Nueva amenidad agregada');

      setAmenitiesArray((prevState) => [
        ...prevState,
        {
          id: response[0],
          name_es: amenity.name_es,
          name_en: amenity.name_en,
        },
      ]);

      setNewAmenity({ name_es: '', name_en: '' });

      setSaving(false);
    } catch (error) {
      toast.error('Error al agregar una nueva amenidad');
      setSaving(false);
    }
  };

  const onDeleteAmenity = async (amenityToDelete, index) => {
    if (id === 'new') {
      const updatedFormState = amenitiesArray.filter((v, index2) => index !== index2);

      setAmenitiesArray((prevState) => prevState.filter((v, index2) => index !== index2));

      onAmenitiesChanges(updatedFormState);

      toast.warning('amenidad eliminada');
      return;
    }

    try {
      await api_deleteAmenity(amenityToDelete.id, dataAuth.token);

      setAmenitiesArray((prevState) => prevState.filter((v) => v.id !== amenityToDelete.id));

      toast.warning('amenidad eliminada');
    } catch (error) {
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.error;

      if (status === 401 || status === 403) {
        toast.error('Sesión expirada, vuelve a iniciar sesión');
      } else if (backendMessage && typeof backendMessage === 'string') {
        toast.error(`Error al eliminar la amenidad: ${backendMessage}`);
      } else if (error?.message) {
        toast.error(`Error al eliminar la amenidad: ${error.message}`);
      } else {
        toast.error('Error al eliminar la amenidad');
      }
    }
  };

  return (
    <>
      {/* <input hidden accept="image/*" type="file" ref={fileRef} onChange={uploadImageDisplay} /> */}

      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography variant="h5">Amenidades</Typography>
        </Grid>

        <Grid item xs={3} minHeight={180}>
          <Box
            height="100%"
            minHeight={180}
            m={1}
            p={1}
            borderRadius="0.5rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              sx={{ mb: 1 }}
              fullWidth
              value={amenity.name_es}
              label="Nombre de amenidad"
              onChange={(e) => {
                setNewAmenity((prevState) => ({
                  ...prevState,
                  name_es: e.target.value,
                }));
              }}
              variant="outlined"
              inputProps={{ maxLength: 50 }}
            />

            <TextField
              fullWidth
              value={amenity.name_en}
              label="Nombre de amenidad en ingles"
              onChange={(e) => {
                setNewAmenity((prevState) => ({
                  ...prevState,
                  name_en: e.target.value,
                }));
              }}
              variant="outlined"
              inputProps={{ maxLength: 50 }}
            />

            <Button
              sx={{ my: 1 }}
              variant="contained"
              color="secondary"
              fullWidth
              disabled={amenity.name_es.length < 3 || amenity.name_en.length < 3 || saving}
              onClick={saveAmenity}
            >
              Guardar
            </Button>
          </Box>
        </Grid>

        {amenitiesArray.map((item, idx) => (
          <Grid item xs={3} key={idx}>
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
              {item.img_url ? (
                <Box py={2}>
                  <img
                    width="100%"
                    style={{ borderRadius: '0.5rem' }}
                    height="auto"
                    src={item.img_url}
                    alt="Imagen de amenidad"
                  />
                </Box>
              ) : null}
              <Typography
                textAlign="center"
                sx={{
                  wordBreak: 'break-word', // fuerza el quiebre de palabra
                  overflowWrap: 'break-word', // alternativa compatible
                }}
              >
                {item.name_es}
              </Typography>
              <Typography
                textAlign="center"
                sx={{
                  wordBreak: 'break-word', // fuerza el quiebre de palabra
                  overflowWrap: 'break-word', // alternativa compatible
                }}
              >
                {item.name_en}
              </Typography>
              <Button onClick={() => onDeleteAmenity(item, idx)}>
                <Iconify width={24} icon="mdi:bin" />
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

Amenities.propTypes = {
  id: PropTypes.string.isRequired,
  onAmenitiesChanges: PropTypes.func.isRequired,
};
