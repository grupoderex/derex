import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import { Box, Grid, Modal, Stack, Button, Container, TextField, Typography } from '@mui/material';

import { validateNewDevelopmentData } from 'src/utils/validations';

import useAppContext from 'src/data/DataProvider';
import { api_createAmenity } from 'src/data/newDevelopmentApiCalls/amenities';
import {
  api_createNewDevelopment,
  api_updateNewDevelopment,
  api_deleteNewDevelopment,
  api_getNewDevelopmentById,
} from 'src/data/APICalls';

import LoadingSpiner from 'src/components/loading';

import { TypesProject } from './components/Types';
import { Amenities } from './components/Amenities';
import { LaunchDate } from './components/LauchDate';
import { Media, DevelopmentData, StatesAndCities } from './components';

export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const initialState = {
  main_image: '',
  main_image_alt: '',
  secondary_image: '',
  secondary_image_alt: '',
  name: '',
  short_description_es: '',
  short_description_en: '',
  state_id: 0,
  city_id: 0,
  launch_date: '',
  contact_phone: '',
  contact_email: '',
  type: '',
  unique_url: '',
};

export default function NewNextProject() {
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    loadingStates: false,
    loadingCities: false,
  });
  const navigate = useNavigate();

  const { dataAuth, setMediaForID } = useAppContext();

  const [id, setId] = useState(new URLSearchParams(document.location.search).get('id') || 'new');

  const [saving, setSaving] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [amenitiesArray, setAmenitiesArray] = useState([]);

  const [dataProject, setDataProject] = useState({
    ...initialState,
  });
  const [origData, setOrigData] = useState({
    ...initialState,
  });

  useEffect(() => {
    if (id !== 'new') {
      setLoading(true);
      api_getNewDevelopmentById(id)
        .then(({ project }) => {
          setDataProject({ ...project });
          setOrigData({ ...project });
        })
        .catch(() => {
          toast.error('Error al obtener la data del próximo desarrollo');
          navigate('/developments');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleFormChange = (childState) => {
    setDataProject((prevState) => ({ ...prevState, ...childState }));
  };

  const handleFormStateChange = (childState) => {
    setDataProject((prevState) => ({ ...prevState, ...childState }));
  };

  const handleAmenitiesChange = (childState) => {
    setAmenitiesArray(childState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormStateLoadingChange = (state, city) => {
    setLoadingStates({
      loadingCities: city,
      loadingStates: state,
    });
  };

  const handleTypeChange = (type) => {
    setDataProject((prevState) => ({ ...prevState, ...type }));
  };

  const onSaveAmenites = async ({ name, name_en, name_es }, id_future_project, toastId) => {
    try {
      const body = {
        id_future_project,
        name,
        name_en,
        name_es,
      };

      await api_createAmenity(body, dataAuth.token);
    } catch (error) {
      toast.update(toastId, {
        render: 'Error al crear la amenindad',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const onSaveProject = async () => {
    const toastId = toast.loading('Guardando un próximo desarrollo nuevo');
    setSaving(true);

    try {
      const bodyParsed = {
        main_image: dataProject.main_image,
        main_image_alt: dataProject.main_image_alt,
        secondary_image: dataProject.secondary_image ? dataProject.secondary_image : undefined,
        secondary_image_alt: dataProject.secondary_image
          ? dataProject.secondary_image_alt
          : undefined,
        name: dataProject.name,
        state_id: dataProject.state_id,
        launch_date: dataProject.launch_date
          ? dayjs(dataProject.launch_date).format('YYYY/MM/DD')
          : undefined,
        contact_phone: dataProject.contact_phone,
        contact_email: dataProject.contact_email,
        type: dataProject.type,
        unique_url: dataProject.unique_url,
        city_id: dataProject.city_id != null ? dataProject.city_id : undefined,
      };

      const errorParsed = validateNewDevelopmentData(bodyParsed);

      if (errorParsed) {
        toast.update(toastId, {
          render: errorParsed,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });

        setSaving(false);
        return;
      }

      if (amenitiesArray.length === 0) {
        toast.update(toastId, {
          render: 'No puedes crear un próximo lanzamiento sin agregar amenidades',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
        setSaving(false);
        return;
      }

      if (id === 'new') {
        try {
          const response = await api_createNewDevelopment(bodyParsed, dataAuth.token);
          const newDevelopmentId = response[0];
          setId(newDevelopmentId);

          if (amenitiesArray.length) {
            await Promise.all(
              amenitiesArray.map((amenityToCreate) =>
                onSaveAmenites(amenityToCreate, newDevelopmentId, toastId)
              )
            );
          }

          toast.update(toastId, {
            render: 'Próximo lanzamiento creado exitosamente',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });

          setSaving(false);
          navigate(`/developments?id=${newDevelopmentId}`);
        } catch {
          toast.update(toastId, {
            render: `Error al crear el nuevo desarrollo`,
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
          setSaving(false);
        }

        return;
      }

      try {
        await api_updateNewDevelopment(id, bodyParsed, dataAuth.token);
        toast.update(toastId, {
          render: 'Próximo lanzamiento actualizado exitosamente',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });
        setSaving(false);
      } catch {
        toast.update(toastId, {
          render: 'Error al actualizar el próximo lanzamiento',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
        setSaving(false);
      }
    } catch (error) {
      toast.update(toastId, {
        render: 'Error al guardar el próximo lanzamiento',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });

      setSaving(false);
      return;
    }
    toast.dismiss(toastId);
    setSaving(false);
  };

  const fileRef = useRef();

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo Imagen');
      if (!fRef.files[0]) onCancel();
      else setMediaForID('file', fRef.files[0]).then(onChange).catch(onCancel);
    };
    fRef.oncancel = onCancel;
    fRef.click();
  };

  return (
    <>
      {loading || loadingStates.loadingCities || loadingStates.loadingStates ? (
        <LoadingSpiner />
      ) : (
        <Container>
          <Box display="flex">
            <Typography variant="h4">Desarrollo</Typography>
            <Box sx={{ flexGrow: 1 }} />

            {id !== 'new' && (
              <Button
                onClick={() => setDeleteModalVisible(true)}
                disabled={saving}
                sx={{ ml: '0.5em' }}
                variant="contained"
                color="inherit"
              >
                Borrar
              </Button>
            )}
            <Button
              onClick={onSaveProject}
              disabled={saving}
              sx={{ ml: '0.5em' }}
              variant="contained"
              color="inherit"
            >
              Guardar
            </Button>
          </Box>

          <Media mediaInitialData={origData} onFormChange={handleFormChange} />

          {dataProject.main_image && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="main_image_alt"
                value={dataProject?.main_image_alt}
                onChange={handleInputChange}
                label="Alt de imagen principal"
                variant="outlined"
                required
              />
            </Grid>
          )}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 3, mb: 3, borderBottom: '1px solid #ddd' }}
          >
            <input className="hidden-file" type="file" ref={fileRef} />
            <Stack direction="column" mr={3}>
              <Button
                onClick={() => {
                  const toastId = toast.loading('Esperando por la selección de la imagen');
                  UseFileRefForUpload(
                    (data) => {
                      toast.update(toastId, {
                        render:
                          'Banner subido correctamente, recuerda guardar cambios para ligarlo al proyecto',
                        type: 'warning',
                        isLoading: false,
                        autoClose: 5000,
                      });
                      setDataProject((prevState) => ({ ...prevState, secondary_image: data }));
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
                }}
              >
                {dataProject?.secondary_image
                  ? 'Actualizar imagen secundaria'
                  : 'Subir imagen secundaria'}
              </Button>
              {dataProject?.secondary_image ? (
                <Button
                  sx={{ mt: 1 }}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setDataProject((prevState) => ({ ...prevState, secondary_image: '' }));
                    toast.warn('Banner borrado, recuerde guardar cambios');
                  }}
                >
                  Borrar imagen de portada
                </Button>
              ) : null}
            </Stack>
            {dataProject?.secondary_image ? (
              <Box py={2}>
                <img
                  height="200"
                  style={{
                    height: 'auto',
                    maxWidth: '600px',
                  }}
                  src={dataProject.secondary_image}
                  alt="Imagen de Promo"
                />
              </Box>
            ) : null}
          </Stack>

          <Grid container columnSpacing={2} rowSpacing={5}>
            {dataProject.secondary_image && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="secondary_image_alt"
                  value={dataProject?.secondary_image_alt}
                  onChange={handleInputChange}
                  label="Alt de imagen secundaria"
                  variant="outlined"
                  required
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <DevelopmentData dataProject={dataProject} setDataProject={setDataProject} />
            </Grid>

            <Grid item xs={12}>
              <StatesAndCities
                dataProject={dataProject}
                onFormChange={handleFormStateChange}
                onLoaderChange={handleFormStateLoadingChange}
              />
            </Grid>

            <Grid item xs={12} justifyContent="space-between" alignItems="center">
              <Amenities id={id} onAmenitiesChanges={handleAmenitiesChange} />
            </Grid>

            <Grid container item xs={12}>
              <Grid item xs={6}>
                <TypesProject initialType={dataProject.type} onFormChange={handleTypeChange} />
              </Grid>
              <Grid item xs={6}>
                <LaunchDate dataProject={dataProject} onLaunchChange={setDataProject} />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}

      <Modal open={deleteModalVisible}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: '1rem',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ¿Deseas borrar el proximo desarrollo seleccionado?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro?, si continuas no podrás recuperar el desarrollo
          </Typography>
          <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
            <Button
              sx={{ px: 3 }}
              onClick={() => {
                setSaving(true);
                api_deleteNewDevelopment(id, dataAuth.token)
                  .then(() => {
                    toast.success('Próximo desarrollo borrado');
                    navigate('/developments');
                  })
                  .catch(() => toast.error('Error al intentar borrar el desarrollo'))
                  .finally(() => {
                    setSaving(false);
                    setDeleteModalVisible(false);
                  });
              }}
              variant="contained"
              color="error"
            >
              Borrar
            </Button>
            <Button
              sx={{ ml: 3, px: 3 }}
              onClick={() => {
                setDeleteModalVisible(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
