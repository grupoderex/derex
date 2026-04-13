import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { Box, Button, Grid, TextField, Typography } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_createAmenity,
  api_deleteAmenity,
  api_getAmenities,
  api_updateAmenity,
} from 'src/data/projectApiCalls/amanities';

import Iconify from 'src/components/iconify/iconify';

export const Amenities = ({ id, onAmenitiesChanges, isOnlyImage = false }) => {
  const [saving, setSaving] = useState(false);
  const [amenity, setNewAmenity] = useState({
    name: '',
    name_eng: '',
    img_url: '',
    order: 0,
    img_alt_text: '',
  });
  const [amenitiesArray, setAmenitiesArray] = useState([]);

  const { setMediaForID, dataAuth } = useAppContext();
  const fileRef = useRef();

  useEffect(() => {
    onAmenitiesChanges(amenitiesArray);
  }, [amenitiesArray]);

  useEffect(() => {
    if (id !== 'new') {
      onGetAllAmenities();
    }
  }, [id]);

  const getUploadErrorMessage = (error) => {
    const status = error?.response?.status;
    const backendMessage = error?.response?.data?.error;

    if (status === 401 || status === 403) {
      return 'Sesion expirada, vuelve a iniciar sesion';
    }

    if (backendMessage && typeof backendMessage === 'string') {
      return backendMessage;
    }

    if (error?.message && typeof error.message === 'string') {
      return error.message;
    }

    return 'Error al subir la imagen';
  };

  const getApiErrorMessage = (error, fallback) => {
    const status = error?.response?.status;
    const backendMessage = error?.response?.data?.error;

    if (status === 401 || status === 403) {
      return 'Sesion expirada, vuelve a iniciar sesion';
    }

    if (backendMessage && typeof backendMessage === 'string') {
      return backendMessage;
    }

    if (error?.message && typeof error.message === 'string') {
      return error.message;
    }

    return fallback;
  };

  const handleClick = (event) => {
    event.preventDefault();

    const fRef = fileRef.current;
    fRef.click();
  };

  const uploadImageDisplay = async () => {
    const fileValue = fileRef.current.files[0];

    if (!fileValue) {
      toast.error('No se selecciono ninguna imagen');
      return;
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

      setNewAmenity((prevState) => ({ ...prevState, img_url: fileProcessed }));
    } catch (error) {
      toast.update(toastId, {
        render: getUploadErrorMessage(error),
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const onGetAllAmenities = async () => {
    setSaving(true);

    try {
      const { amenities: amenitiesinitials } = await api_getAmenities(
        id,
        dataAuth.token,
        isOnlyImage ? 'image' : 'text'
      );

      setAmenitiesArray(amenitiesinitials);

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

      toast.success('Nueva amenidad agregada');

      setAmenitiesArray((prevState) => [
        ...prevState,
        {
          name: amenity.name || undefined,
          img_url: amenity.img_url || undefined,
          name_eng: amenity.name_eng || undefined,
          order: amenity.order || 0,
          img_alt_text: amenity.img_alt_text || undefined,
        },
      ]);

      setNewAmenity({ name: '', img_url: '', name_eng: '', order: 0, img_alt_text: '' });

      return;
    }

    try {
      const body = {
        ...amenity,
        id_project: id,
      };

      const { data: response } = await api_createAmenity(body, dataAuth.token);

      toast.success('Nueva amenidad agregada');

      setAmenitiesArray((prevState) => [
        ...prevState,
        {
          id: response[0],
          name: amenity.name || undefined,
          img_url: amenity.img_url || undefined,
          name_eng: amenity.name_eng || undefined,
          order: amenity.order || 0,
          img_alt_text: amenity.img_alt_text || undefined,
        },
      ]);

      setNewAmenity({ name: '', img_url: '', name_eng: '', order: 0, img_alt_text: '' });

      setSaving(false);
    } catch (error) {
      toast.error('Error al agregar una nueva amenidad');

      setSaving(false);
    }
  };

  const onDeleteAmenity = async (amenityToDelete, index) => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar esta amenidad?');
    if (!confirmed) return;

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
      toast.error(
        `Error al eliminar la amenidad: ${getApiErrorMessage(
          error,
          'No se pudo eliminar la amenidad'
        )}`
      );
    }
  };

  const updateAmenity = async (amenityToUpdate, index) => {
    setSaving(true);

    try {
      const body = {
        ...amenityToUpdate,
        id_project: id,
      };

      await api_updateAmenity(amenityToUpdate.id, body, dataAuth.token);

      toast.warning('amenidad actualizada');
    } catch (error) {
      toast.error(
        `Error al actualizar la amenidad: ${getApiErrorMessage(
          error,
          'No se pudo actualizar la amenidad'
        )}`
      );
    }

    setSaving(false);
  };

  return (
    <>
      <input hidden accept="image/*" type="file" ref={fileRef} onChange={uploadImageDisplay} />

      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12} display="flex" alignItems="center">
          <Typography variant="h5">
            {isOnlyImage ? 'Imagenes de amenidades' : 'Texto de amenidades'}
          </Typography>
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
            {isOnlyImage &&
              (amenity.img_url ? (
                <Box py={2}>
                  <img
                    style={{ borderRadius: '0.5rem' }}
                    width="100%"
                    height="auto"
                    src={amenity.img_url}
                    alt="Imagen de Propiedad"
                  />
                </Box>
              ) : (
                <Button sx={{ my: 1, py: 3 }} fullWidth onClick={handleClick}>
                  Agregar Foto
                </Button>
              ))}

            {!isOnlyImage && (
              <>
                <TextField
                  sx={{ mb: 1 }}
                  fullWidth
                  value={amenity.name}
                  label="Nombre de amenidad"
                  onChange={(e) => {
                    setNewAmenity((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }));
                  }}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  value={amenity.name_eng}
                  label="Nombre de amenidad en ingles"
                  onChange={(e) => {
                    setNewAmenity((prevState) => ({
                      ...prevState,
                      name_eng: e.target.value,
                    }));
                  }}
                  variant="outlined"
                />
              </>
            )}
            {isOnlyImage && (
              <>
                <TextField
                  fullWidth
                  sx={{ my: 1 }}
                  value={amenity.order}
                  label="Posición"
                  type="number"
                  onChange={(e) => {
                    setNewAmenity((prevState) => ({
                      ...prevState,
                      order: e.target.value,
                    }));
                  }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  name="img_alt_text"
                  value={amenity.img_alt_text}
                  onChange={(e) => {
                    setNewAmenity((prevState) => ({
                      ...prevState,
                      img_alt_text: e.target.value,
                    }));
                  }}
                  label="Texto alternativo de imagen"
                  variant="outlined"
                />
              </>
            )}

            <Button
              sx={{ my: 1 }}
              variant="contained"
              color="secondary"
              fullWidth
              disabled={
                (!isOnlyImage && (amenity.name.length < 3 || amenity.name_eng.length < 3)) ||
                (isOnlyImage && (amenity.img_url.length < 3 || amenity.img_alt_text.length < 3)) ||
                saving
              }
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
              {item.img_url && isOnlyImage ? (
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
              <Typography textAlign="center">{item.name}</Typography>
              <Typography textAlign="center">{item.name_eng}</Typography>
              {isOnlyImage && (
                <>
                  <TextField
                    fullWidth
                    sx={{ my: 1 }}
                    value={item.order}
                    label="Posición"
                    type="number"
                    onChange={(e) => {
                      setAmenitiesArray((prevState) =>
                        prevState.map((v, index) =>
                          index === idx ? { ...v, order: e.target.value } : v
                        )
                      );
                    }}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    sx={{ mb: 1 }}
                    name="img_alt_text"
                    value={item.img_alt_text}
                    onChange={(e) => {
                      setAmenitiesArray((prevState) =>
                        prevState.map((v, index) =>
                          index === idx ? { ...v, img_alt_text: e.target.value } : v
                        )
                      );
                    }}
                    label="Texto alternativo de imagen"
                    variant="outlined"
                  />
                  <Button
                    sx={{ mb: 1 }}
                    onClick={() => updateAmenity(item, idx)}
                    style={{
                      minWidth: '48px',
                      minHeight: '48px',
                      maxHeight: '48px',
                    }}
                    variant="contained"
                  >
                    Guardar
                  </Button>
                </>
              )}
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
  isOnlyImage: PropTypes.bool,
};
