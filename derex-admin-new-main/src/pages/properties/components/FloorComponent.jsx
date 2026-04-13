import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Box,
  Button,
  Grid,
  IconButton,
  ImageList,
  Modal,
  TextField,
  Typography,
} from '@mui/material';

import {
  api_createBlueprint,
  api_deleteBlueprint,
  api_editBlueprint,
  api_getBlueprintsByPropertyId,
} from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import Iconify from 'src/components/iconify/iconify';

import { ImageListComponent } from './ImageListComponent';

export function FloorComponent ({ ...props }) {
  const { setMediaForID, dataAuth } = useAppContext();
  const [blueprintsArray, setBlueprintsArray] = useState([]);

  const [showAddBlueprints, setShowAddBlueprints] = useState(false);
  const [blueprintMode, setBlueprintMode] = useState('create');
  const [blueprintData, setBlueprintData] = useState({
    image_url: '',
    characteristics_architectural_plans: [],
    title: {
      es: '',
      en: '',
    },
    image_alt_text: '',
    //TODO:  orden: 0,
  });

  const blueprintRef = useRef();

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

  const handleOpenAdd = () => {
    setBlueprintMode('create');
    setBlueprintData({
      image_url: '',
      characteristics_architectural_plans: [],
      title: {
        es: '',
        en: '',
      },
      image_alt_text: '',
      //TODO_ orden: 0,
    });
    setShowAddBlueprints(true);
  };

  const onDeleteBlueprintFromArray = async (index) => {
    const ia = blueprintsArray.concat();
    api_deleteBlueprint(ia[index].id, dataAuth.token)
      .then(() => {
        toast.info('Plano borrado correctamente');
        ia.splice(index, 1);
        setBlueprintsArray(ia);
      })
      .catch(() => {
        toast.error('Error al borrar el plano');
      });
  };

  const handleOpenEdit = (blueprint) => {
    console.log('blueprint', blueprint);
    setBlueprintMode('edit');
    setBlueprintData(blueprint);
    setShowAddBlueprints(true);
  };

  const handleCloseModal = (open) => {
    setShowAddBlueprints(open);
  };

  const handleAddBlueprint = async (e) => {
    e.preventDefault();
    api_createBlueprint(
      {
        ...blueprintData,
        id_property: parseInt(props.propertyId, 10),
      },
      dataAuth.token
    )
      .then(() => {
        api_getBlueprintsByPropertyId(props.propertyId)
          .then(setBlueprintsArray)
          .catch(() => toast.error('Error al obtener las plantas arquitectónicas'));
        setShowAddBlueprints(false);

        toast.info('Plano creado correctamente');
      })
      .catch((err) => {
        const textErr = err.response.data.error;

        toast.error(`Error al crear el plano:  ${textErr}`);
      });
  };

  const handleEditBlueprint = async (e) => {
    e.preventDefault();

    const floorDataBody = {
      id_property: blueprintData.id_property,
      title: {
        es: blueprintData.title.es,
        en: blueprintData.title.en,
      },
      image_url: blueprintData.image_url,
      image_alt_text: blueprintData.image_alt_text,
      characteristics_architectural_plans: blueprintData.characteristics_architectural_plans,
      //TODO: orden: blueprintData.orden,
    };

    api_editBlueprint(
      blueprintData.id,
      {
        ...floorDataBody,
      },
      dataAuth.token
    )
      .then(() => {
        api_getBlueprintsByPropertyId(props.propertyId)
          .then(setBlueprintsArray)
          .catch(() => toast.error('Error al obtener las plantas arquitectónicas'));
        setShowAddBlueprints(false);
        toast.info('Plano editado correctamente');
      })
      .catch((err) => {
        const textErr = err.response.data.error;
        toast.error(`Error al editar el plano:  ${textErr}`);
      });
  };

  const uploadBlueprintImage = async () => {
    const fileValue = blueprintRef.current.files[0];

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

      setBlueprintData({
        ...blueprintData,
        image_url: fileProcessed,
      });
    } catch (error) {
      toast.update(toastId, {
        render: getUploadErrorMessage(error),
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (props.propertyId !== 'new') {
      api_getBlueprintsByPropertyId(props.propertyId)
        .then(setBlueprintsArray)
        .catch(() => toast.error('Error al obtener las plantas arquitectónicas'));
    }
  }, [props.propertyId]);

  return (
    <>
      <Grid item xs={12} display="flex" alignItems="center">
        <Typography variant="h5">
          {props.propertyId !== 'new'
            ? 'Imágenes de plantas arquitectónicas'
            : 'Necesita crear la propiedad para agregar las plantas arquitectónicas'}
        </Typography>
        {props.propertyId !== 'new' ? (
          <Button sx={{ mx: 3, px: 3 }} onClick={() => handleOpenAdd(true)}>
            Agregar planta arquitectónica
          </Button>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <ImageList cols={3} sx={{ overflowX: 'hidden' }}>
          {blueprintsArray.map((item, index) => {
            const parsedName = typeof item.title === 'string' ? JSON.parse(item.title) : item.title;

            return (
              <Box key={item.id} display="flex" flexDirection="column" alignItems="center">
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <ImageListComponent
                    onDelete={onDeleteBlueprintFromArray}
                    index={index}
                    src={item.image_url}
                    onEdit={() => handleOpenEdit(item)}
                  />

                  <h5>{parsedName?.es}</h5>

                  {/* <p className='text-center font-bold text-sm'>
                    Orden No: {item.orden}
                  </p> */}
                </div>
              </Box>
            );
          })}
        </ImageList>
      </Grid>
      <Modal open={showAddBlueprints}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: '1rem',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <form onSubmit={blueprintMode === 'create' ? handleAddBlueprint : handleEditBlueprint}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {blueprintMode === 'create'
                ? 'Agregar Planta Arquitectónica'
                : 'Editar Planta Arquitectónica'}
              <IconButton
                onClick={() => handleCloseModal(false)}
                sx={{ position: 'absolute', top: 0, right: 0 }}
              >
                <Iconify icon="mdi:close" />
              </IconButton>
            </Typography>
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="Nombre en español"
              variant="outlined"
              required
              value={blueprintData.title.es}
              onChange={(e) => {
                setBlueprintData((prevState) => ({
                  ...prevState,
                  title: { ...prevState.title, es: e.target.value },
                }));
              }}
            />
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="Nombre en inglés"
              variant="outlined"
              required
              value={blueprintData.title.en}
              onChange={(e) => {
                setBlueprintData((prevState) => ({
                  ...prevState,
                  title: { ...prevState.title, en: e.target.value },
                }));
              }}
            />
            <hr />
            {blueprintData.characteristics_architectural_plans.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '1rem',
                }}
              >
                <TextField
                  sx={{ mt: 2 }}
                  fullWidth
                  label={`Característica ${index + 1} en español`}
                  variant="outlined"
                  required
                  value={item.es}
                  onChange={(e) => {
                    const newArray = [...blueprintData.characteristics_architectural_plans];
                    newArray[index].es = e.target.value;
                    setBlueprintData((prevState) => ({
                      ...prevState,
                      characteristics_architectural_plans: newArray,
                    }));
                  }}
                />
                <TextField
                  sx={{ mt: 2 }}
                  fullWidth
                  label={`Característica ${index + 1} en inglés`}
                  variant="outlined"
                  required
                  value={item.en}
                  onChange={(e) => {
                    const newArray = [...blueprintData.characteristics_architectural_plans];
                    newArray[index].en = e.target.value;
                    setBlueprintData((prevState) => ({
                      ...prevState,
                      characteristics_architectural_plans: newArray,
                    }));
                  }}
                />
              </div>
            ))}
            {/* <Button // TODO: Habilitar cuando se requieran características en los planos arquitectónicos
              sx={{ mt: 2 }}
              onClick={() => {
                setAddBlueprintData((prevState) => ({
                  ...prevState,
                  characteristics_architectural_plans: [
                    ...prevState.characteristics_architectural_plans,
                    { es: '', en: '' },
                  ],
                }));
              }}
            >
              Agregar Característica
            </Button> */}
            {/* <hr className="my-8" /> */}
            <input
              type="file"
              accept="image/*"
              onChange={uploadBlueprintImage}
              ref={blueprintRef}
              style={{ display: 'none' }}
            />

            {blueprintData.image_url ? (
              <Grid container>
                <Grid item xs={10}>
                  <Box py={2}>
                    <img
                      style={{ borderRadius: '0.5rem' }}
                      width="100px"
                      height="auto"
                      src={blueprintData.image_url}
                      alt="Imagen de Propiedad"
                    />
                  </Box>
                </Grid>

                <Grid item xs={2}>
                  <Button
                    sx={{ my: 1, py: 3 }}
                    onClick={(e) => {
                      setBlueprintData((prevState) => ({
                        ...prevState,
                        image_url: null,
                      }));
                    }}
                  >
                    Cambiar
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Button sx={{ my: 2, py: 3 }} fullWidth onClick={() => blueprintRef.current.click()}>
                Agregar Foto
              </Button>
            )}
            <TextField
              fullWidth
              name="blueprint_alt_text"
              value={blueprintData.image_alt_text}
              onChange={(e) => {
                setBlueprintData((prevState) => ({
                  ...prevState,
                  image_alt_text: e.target.value,
                }));
              }}
              label="Texto alternativo de imagen"
              variant="outlined"
            />
            {/*
            TODO: veamos
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="Orden Nro"
              type="number"
              value={blueprintData.orden}
              onChange={(e) => {
                setBlueprintData((prevState) => ({
                  ...prevState,
                  orden: e.target.value,
                }));
              }}
              variant="outlined"
            /> */}
            <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary" fullWidth>
              {blueprintMode === 'create' ? 'Agregar' : 'Editar'}
            </Button>
          </form>
        </Box>
      </Modal>
      ;
    </>
  );
}

FloorComponent.propTypes = {
  propertyId: PropTypes.any,
};
