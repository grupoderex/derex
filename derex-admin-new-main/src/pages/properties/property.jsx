/* eslint-disable no-nested-ternary */
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  ImageList,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';
import { toUrlCase } from 'src/utils/format-url';

import { envProject } from 'src/config';
import {
  api_createImageProperty,
  api_createPriceProperty,
  api_createProperty,
  api_createUrgencyChip,
  api_deleteImageProperty,
  api_deletePriceProperty,
  api_deleteProperty,
  api_getAllProjects,
  api_getPropertyForID,
  api_getTitlesBySection,
  api_getUrgencyChipByProperty,
  api_saveProperty,
  api_updateImageProperty,
  api_updateUrgencyChip,
  api_upsertTitles,
} from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import LoadingSpiner from 'src/components/loading';
import { UrlPreview } from 'src/components/urlPreview';

import { validatePropertyData } from '../../utils/validations';
import { AditionalInfo } from '../projects/components/AditionalInfo';
import { EdgeCertified, Features, Outstanding, VirtualTour } from './components';
import { FloorComponent } from './components/FloorComponent';
import { ImageListComponent } from './components/ImageListComponent';
import TitlesPropertiesCMS, { titlesPropertySection } from './components/TitlesPropertiesCMS';
import { UrgencyChipForm } from './components/UrgencyChipForm';

export default function Property () {
  const { data: projects } = useQuery('projects', api_getAllProjects);
  const navigate = useNavigate();
  const [typingTimeout, setTypingTimeout] = useState(0);

  const { setMediaForID, dataAuth } = useAppContext();
  const [id, setId] = useState(new URLSearchParams(document.location.search).get('id') || 'new');
  const [projectIdNew] = useState(new URLSearchParams(document.location.search).get('idProject'));

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMixedHorizontal, setIsMixedHorizontal] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [project, setProject] = useState('');
  const [urgencyChipData, setDataUrgencyChip] = useState(null);
  const [featuresArray, setFeatureArray] = useState([]);
  const [titlesCms, setTitlesCms] = useState([]);
  const [databaseTitlesCms, setDatabaseTitlesCms] = useState([]);
  const [preciosArray, setPreciosArray] = useState([]);
  const [nuevoPrecio, setNuevoPrecio] = useState({
    price_base: 0,
    price_m2_ext: 0,
    name: '',
  });

  const parentProject = projects?.find((v) => v.id === parseInt(project, 10));

  const [dataProperty, setDataProperty] = useState({
    bathrooms: 0,
    cars_garage_capacity: 0,
    cars_parking_lot_capacity: 0,
    rooms: 0,
    restrooms: 0,
    floors: 0,
    square_meters: 0,
    name: '',
    description: '',
    description_eng: '',
    main_image: '',
    thumbnail: '',
    banner: '',
    vertical_floor: null,
    active: 0,
    project_order: 0,
    extra_images: [],
    isEdgeCertified: 0,
    virtual_tour_iframe: '',
    outstanding: false,
  });

  const [origData, setOrigData] = useState({});
  const [imageArray, setImageArray] = useState([]);
  // const [blueprintsArray, setBlueprintsArray] = useState([]);

  const onDeleteImageFromArray = async (index) => {
    const ia = imageArray.concat();
    api_deleteImageProperty(ia[index].id, dataAuth.token)
      .then(() => {
        toast.info('Imagen borrada correctamente');
        ia.splice(index, 1);
        setImageArray(ia);
      })
      .catch(() => {
        toast.error('Error al borrar la imagen');
      });
  };

  // const onDeleteBlueprintFromArray = async (index) => {
  //   const ia = blueprintsArray.concat();
  //   api_deleteBlueprint(ia[index].id, dataAuth.token)
  //     .then(() => {
  //       toast.info('Plano borrado correctamente');
  //       ia.splice(index, 1);
  //       setBlueprintsArray(ia);
  //     })
  //     .catch(() => {
  //       toast.error('Error al borrar el plano');
  //     });
  // };

  // const handleShowAddBlueprint = (open) => {
  //   setShowAddBlueprints(open);
  //   setAddBlueprintData({
  //     image_url: '',
  //     image_alt_text: '',
  //     characteristics_architectural_plans: [],
  //     title: {
  //       es: '',
  //       en: '',
  //     },
  //     orden: 0,
  //   });
  // };

  // const handleAddBlueprint = async (e) => {
  //   e.preventDefault();
  //   api_createBlueprint(
  //     {
  //       ...addBlueprintData,
  //       id_property: parseInt(id, 10),
  //     },
  //     dataAuth.token
  //   )
  //     .then(() => {
  //       api_getBlueprintsByPropertyId(id)
  //         .then(setBlueprintsArray)
  //         .catch(() => toast.error('Error al obtener las plantas arquitectónicas'));
  //       setShowAddBlueprints(false);

  //       toast.info('Plano creado correctamente');
  //     })
  //     .catch(() => {
  //       toast.error('Error al crear el plano');
  //     });
  // };

  useEffect(() => {
    if (id !== 'new') {
      setLoading(true);
      api_getPropertyForID(id)
        .then((dataApi) => {
          setIsMixedHorizontal(dataApi.vertical_floor === null);
          setDataProperty(dataApi);
          setOrigData(dataApi);
          setProject(dataApi.id_project);
          setImageArray(dataApi.extra_images);
          setPreciosArray(dataApi.precios);
          // api_getBlueprintsByPropertyId(id)
          //   .then(setBlueprintsArray)
          //   .catch(() => toast.error('Error al obtener las plantas arquitectónicas'));
        })
        .catch(() => {
          toast.error('Error al obtener la data de la propiedad');
          navigate('/properties');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  useEffect(() => {
    if (projectIdNew && projects) {
      setProject(projectIdNew);
    }
  }, [projectIdNew, projects]);

  useEffect(() => {
    if (id && id !== 'new') {
      api_getTitlesBySection(`property_${id}`)
        .then((data) => {
          setDatabaseTitlesCms(
            titlesPropertySection.titles.map((title) => {
              const existentTitle = data.data.find((t) => t.name === title.key);
              return {
                value: existentTitle?.value ?? '',
                value_en: existentTitle?.value_en ?? '',
                bold: existentTitle?.bold ?? false,
                outline: existentTitle?.outline ?? false,
                color: existentTitle?.color ?? false,
                name: title.key,
              };
            })
          );
        })
        .catch((err) => {
          toast.error('Error al obtener los titulos');
        });
    }
  }, [id]);

  useEffect(() => {
    if (id !== 'new') {
      setLoading(true);
      api_getUrgencyChipByProperty(id)
        .then(({ chip }) => {
          setDataUrgencyChip({
            description_en: chip.description_en,
            description_es: chip.description_es,
            notification_text_en: chip.notification_text_en,
            notification_text_es: chip.notification_text_es,
            is_active: chip.is_active,
            id: chip.id,
            property_id: chip.property_id,
          });
        })
        .catch((error) => {
          if (error.response.data.error === 'Chip de urgencia no encontrado para este proyecto.')
            return;

          toast.error('Error al obtener la data de la chip de urgencia', error);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const save = async () => {
    const toastId = toast.loading('Guardando la propiedad');
    setSaving(true);

    let idProperty = id;

    try {
      let features;

      if (featuresArray.length) {
        const es_interest = [];
        const en_interest = [];

        for (let index = 0; index < featuresArray.length; index += 1) {
          const interest = featuresArray[index];

          es_interest.push(interest.name);
          en_interest.push(interest.name_eng);
        }
        features = {
          es: es_interest,
          en: en_interest,
        };
      }

      const dataParsed = {
        banner: dataProperty?.banner,
        bathrooms: dataProperty?.bathrooms, // numero entero positvo menor a 100
        cars_garage_capacity: dataProperty?.cars_garage_capacity, // numero entero positvo menor a 100
        cars_parking_lot_capacity: dataProperty?.cars_parking_lot_capacity, // numero entero positvo menor a 100
        rooms: dataProperty?.rooms, // numero entero positvo menor a 100
        restrooms: dataProperty?.restrooms, // numero entero positvo menor a 50
        name: dataProperty?.name.trim(), // minimo 3 caracteres
        description: dataProperty.description.trim(), // minimo 20 caracteres
        description_eng: dataProperty.description_eng.trim(), // minimo 20 caracteres
        main_image: dataProperty?.main_image, // debe ser un url
        thumbnail: dataProperty?.thumbnail,
        id_project: project, // deber ser un numero entero positivo
        floors: dataProperty?.floors, // deber ser un numero entero positivo
        square_meters: dataProperty?.square_meters, // deber ser un numero flotante positivo
        active: dataProperty?.active,
        project_order: dataProperty?.project_order,
        vertical_floor:
          (parentProject?.type_orientation === 'vertical' ||
            (parentProject?.type_orientation === 'mixed' && !isMixedHorizontal)) &&
            dataProperty?.vertical_floor
            ? Number(dataProperty?.vertical_floor)
            : null,
        features,
        isEdgeCertified: dataProperty?.isEdgeCertified,
        outstanding: dataProperty?.outstanding === 1,
        virtual_tour_iframe: dataProperty?.virtual_tour_iframe,
        thumbnail_alt_text:
          dataProperty?.thumbnail_alt_text !== '' ? dataProperty?.thumbnail_alt_text : undefined,
        main_image_alt_text:
          dataProperty?.main_image_alt_text !== '' ? dataProperty?.main_image_alt_text : undefined,
        additional_info: {
          ...dataProperty?.additional_info,
          more_info_url:
            dataProperty?.additional_info?.more_info_url !== ''
              ? dataProperty?.additional_info?.more_info_url
              : undefined,
        },
      };

      const errorParsed = validatePropertyData(
        dataParsed,
        parentProject?.type_orientation,
        titlesCms
      );

      if (errorParsed) {
        toast.update(toastId, {
          render: errorParsed,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      } else if (id === 'new') {
        try {
          const dataApi = await api_createProperty(dataParsed, dataAuth.token);
          setId(dataApi?.id);
          idProperty = dataApi?.id;
          toast.update(toastId, {
            render: 'Propiedad creada exitosamente',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });

          if (urgencyChipData !== null && !urgencyChipData.id) {
            await api_createUrgencyChip(
              {
                ...urgencyChipData,
                property_id: idProperty,
                is_active: urgencyChipData.is_active,
              },
              dataAuth.token
            );
          } else if (urgencyChipData !== null && urgencyChipData.id) {
            await api_updateUrgencyChip(
              urgencyChipData.id,
              {
                ...urgencyChipData,
                property_id: idProperty,
                is_active: urgencyChipData.is_active,
              },
              dataAuth.token
            );
          }

          navigate(`/property?id=${dataApi?.id}`);
        } catch {
          toast.update(toastId, {
            render: 'Error al crear la propiedad',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        }
      } else {
        try {
          await api_saveProperty(id, dataParsed, dataAuth.token);

          if (urgencyChipData !== null && urgencyChipData.id) {
            await api_updateUrgencyChip(urgencyChipData.id, urgencyChipData, dataAuth.token);
          } else if (urgencyChipData !== null && !urgencyChipData.id) {
            await api_createUrgencyChip(
              {
                ...urgencyChipData,
                property_id: id,
                is_active: urgencyChipData.is_active ?? false,
              },
              dataAuth.token
            );
          }

          toast.update(toastId, {
            render: 'Propiedad actualizada exitosamente',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });
        } catch {
          toast.update(toastId, {
            render: 'Error al actualizar la propiedad',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      toast.update(toastId, {
        render: 'Error al guardar la propiedad',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      setSaving(false);
      return;
    }

    try {
      await saveCMSTitles(idProperty);
    } catch (error) {
      toast.error('Error al guardar los titulos');
    }

    setSaving(false);
    toast.dismiss(toastId);
  };

  const fileRef = useRef();

  const handleTitleChange = (childState) => {
    setTitlesCms(childState);
  };

  const saveCMSTitles = async (idProperty) => {
    try {
      await api_upsertTitles(
        titlesPropertySection.titles.map(({ key }) => {
          const title = titlesCms.find((t) => t.name === key);
          return {
            name: key,
            section: `property_${idProperty}`,
            value: title?.value ?? '',
            value_en: title?.value_en ?? '',
            bold: title?.bold ?? false,
            outline: title?.outline ?? false,
            color: title?.color ?? false,
          };
        }),
        dataAuth.token
      );
    } catch (error) {
      toast.error('Error al guardar los titulos');
    }
  };

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

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo Imagen');
      if (!fRef.files[0]) {
        onCancel(new Error('No se selecciono ninguna imagen'));
        return;
      }

      setMediaForID('file', fRef.files[0])
        .then(onChange)
        .catch((error) => onCancel(error));

      fRef.value = '';
    };
    fRef.click();
  };

  const uploadExtraImage = async () => {
    const toastId = toast.loading('Esperando por la seleccion de la imagen');
    UseFileRefForUpload(
      async (data) => {
        try {
          const newImg = await api_createImageProperty({ id_property: id, image_url: data }, dataAuth.token);
          toast.update(toastId, {
            render: 'Imagen subida correctamente',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });
          setImageArray((prevState) => [{ id: newImg.id, url: data }, ...prevState]);
        } catch (error) {
          toast.update(toastId, {
            render: getUploadErrorMessage(error) || 'Error al vincular la imagen con la propiedad',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        }
      },
      (error) => {
        toast.update(toastId, {
          render: getUploadErrorMessage(error),
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      }
    );
  };

  const handleFeaturesChange = (childState) => {
    setFeatureArray(childState);
  };

  const onRollBack = () => {
    const newDataProperty = { ...origData };
    setDataProperty(newDataProperty);
    setOrigData(newDataProperty);
  };

  return (
    <>
      {loading ? (
        <LoadingSpiner />
      ) : (
        <Container>
          <input className="hidden-file" type="file" ref={fileRef} />

          <Box display="flex">
            <Typography variant="h4">Propiedad</Typography>

            <Box sx={{ flexGrow: 1 }} />

            {id !== 'new' && (
              <a
                href={`${envProject.frontendUrl
                  }/desarrollos/${toUrlCase(projects?.find((v) => v.id === parseInt(project, 10))?.short_name)}/propiedad/${toUrlCase(
                    dataProperty?.name
                  )}?show_invisible=true`}
                target="_blank"
                rel="noreferrer"
              >
                <Button sx={{ mr: '0.5em' }} variant="outlined">
                  Ver en el sitio
                </Button>
              </a>
            )}

            <Button disabled={saving} onClick={onRollBack} variant="contained" color="inherit">
              Revertir
            </Button>

            {id !== 'new' ? (
              <Button
                onClick={() => setDeleteModalVisible(true)}
                disabled={saving}
                sx={{ ml: '0.5em' }}
                variant="contained"
                color="inherit"
              >
                Borrar
              </Button>
            ) : null}
            <Button
              onClick={save}
              disabled={saving}
              sx={{ ml: '0.5em' }}
              variant="contained"
              color="inherit"
            >
              Guardar
            </Button>
          </Box>

          <Grid container rowSpacing={2} marginTop={3}>
            <Outstanding dataProperty={dataProperty} setDataProperty={setDataProperty} />

            <EdgeCertified dataProperty={dataProperty} setDataProperty={setDataProperty} />
          </Grid>

          <Stack
            marginTop={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ pb: 3 }}
          >
            <Stack direction="column">
              <Button
                onClick={() => {
                  const toastId = toast.loading('Esperando por la seleccion de la imagen');
                  UseFileRefForUpload(
                    (data) => {
                      toast.update(toastId, {
                        render:
                          'Imagen subida correctamente, recuerda guardar cambios para ligarla a la propiedad',
                        type: 'warning',
                        isLoading: false,
                        autoClose: 5000,
                      });
                      setDataProperty((prevState) => ({ ...prevState, main_image: data }));
                    },
                    (error) => {
                      toast.update(toastId, {
                        render: getUploadErrorMessage(error),
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                      });
                    }
                  );
                }}
              >
                {dataProperty?.main_image
                  ? 'Actualizar imagen principal'
                  : 'Subir imagen principal'}
              </Button>
            </Stack>
            {dataProperty?.main_image ? (
              <Box py={2}>
                <img height="200" src={dataProperty.main_image} alt="Imagen de Propiedad" />
              </Box>
            ) : null}
          </Stack>

          <Stack sx={{ borderBottom: '1px solid #ddd', py: 3, mb: 3 }}>
            <TextField
              fullWidth
              name="main_image_alt_text"
              value={dataProperty.main_image_alt_text}
              onChange={(e) => {
                setDataProperty((prevState) => ({
                  ...prevState,
                  main_image_alt_text: e.target.value,
                }));
              }}
              label="Texto alternativo de imagen principal"
              variant="outlined"
            />
          </Stack>

          <Stack
            marginTop={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ pb: 3 }}
          >
            <Stack direction="column">
              <Button
                onClick={() => {
                  const toastId = toast.loading('Esperando por la seleccion de la imagen');
                  UseFileRefForUpload(
                    (data) => {
                      toast.update(toastId, {
                        render:
                          'Imagen subida correctamente, recuerda guardar cambios para ligarla a la propiedad',
                        type: 'warning',
                        isLoading: false,
                        autoClose: 5000,
                      });
                      setDataProperty((prevState) => ({ ...prevState, thumbnail: data }));
                    },
                    (error) => {
                      toast.update(toastId, {
                        render: getUploadErrorMessage(error),
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                      });
                    }
                  );
                }}
              >
                {(parentProject?.type_orientation === 'vertical' ||
                  parentProject?.type_orientation === 'mixed') &&
                  !isMixedHorizontal
                  ? dataProperty?.thumbnail
                    ? 'Actualizar planta arquitectónica principal'
                    : 'Subir planta arquitectónica principal'
                  : dataProperty?.thumbnail
                    ? 'Actualizar imagen miniatura'
                    : 'Subir imagen miniatura'}
              </Button>
            </Stack>
            {dataProperty?.thumbnail ? (
              <Box py={2}>
                <img height="200" src={dataProperty.thumbnail} alt="Imagen de Propiedad" />
              </Box>
            ) : null}
          </Stack>

          <Stack sx={{ borderBottom: '1px solid #ddd', py: 3, mb: 3 }}>
            <TextField
              fullWidth
              name="thumbnail_alt_text"
              value={dataProperty.thumbnail_alt_text}
              onChange={(e) => {
                setDataProperty((prevState) => ({
                  ...prevState,
                  thumbnail_alt_text: e.target.value,
                }));
              }}
              label="Texto alternativo de miniatura"
              variant="outlined"
            />
          </Stack>

          <Grid container columnSpacing={2} rowSpacing={4} mt={1}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                value={dataProperty.name}
                onChange={(e) =>
                  setDataProperty((prevState) => ({ ...prevState, name: e.target.value }))
                }
                label="Nombre"
                variant="outlined"
                required
              />
              <Box fontSize="0.8em" marginBottom={2} marginTop={1}>
                <UrlPreview
                  propertyTitle={dataProperty?.name}
                  projectTitle={projects?.find((v) => v.id === parseInt(project, 10))?.short_name}
                />
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Box
                sx={{
                  display: 'flex',
                  flexFlow: 'column',
                  justifyContent: 'flex-start',
                  width: '100%',
                  alignItems: 'flex-start',
                  height: 'fit-content',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={dataProperty.active === 1}
                      onChange={(e) =>
                        setDataProperty((prevState) => ({
                          ...prevState,
                          active: e.target.checked ? 1 : 0,
                        }))
                      }
                    />
                  }
                  label="Activo"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={dataProperty.description}
                onChange={(e) =>
                  setDataProperty((prevState) => ({ ...prevState, description: e.target.value }))
                }
                label="Descripción"
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={dataProperty.description_eng}
                onChange={(e) =>
                  setDataProperty((prevState) => ({
                    ...prevState,
                    description_eng: e.target.value,
                  }))
                }
                label="Descripción en Ingles"
                variant="outlined"
                required
              />
            </Grid>

            {parentProject?.type_orientation === 'mixed' && (
              <Grid item>
                <Typography variant="h5">Configuración de desarrollos mixtos</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isMixedHorizontal}
                      onChange={(e) => setIsMixedHorizontal(e.target.checked)}
                    />
                  }
                  label="Propiedad en desarrollo horizontal"
                />
              </Grid>
            )}

            {(parentProject?.type_orientation === 'vertical' ||
              parentProject?.type_orientation === 'mixed') &&
              !isMixedHorizontal && (
                <Grid item xs={12}>
                  <InputLabel>Nivel (Piso)</InputLabel>
                  <Select
                    fullWidth
                    value={dataProperty?.vertical_floor}
                    onChange={(e) => {
                      setDataProperty((prevState) => ({
                        ...prevState,
                        vertical_floor: e.target.value,
                      }));
                    }}
                    required
                  >
                    {Array.from({ length: parentProject?.vertical_data?.levels ?? 0 }).map(
                      (_, index) => (
                        <MenuItem key={index} value={index + 1}>
                          {index + 1}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </Grid>
              )}

            <Grid item container columnSpacing={4} rowSpacing={4} xs={12}>
              <Grid item xs={3}>
                <Typography mr={2}>Metros Cuadrados</Typography>
                <Input
                  fullWidth
                  value={dataProperty.square_meters}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({
                      ...prevState,
                      square_meters: e.target.value,
                    }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Typography mr={2}>Numero de Pisos</Typography>
                <Input
                  fullWidth
                  value={dataProperty.floors}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({ ...prevState, floors: e.target.value }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Typography mr={2}>Habitaciones</Typography>
                <Input
                  fullWidth
                  value={dataProperty.rooms}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({ ...prevState, rooms: e.target.value }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Typography mr={2}>Orden en el Carrusel</Typography>
                <Input
                  fullWidth
                  value={dataProperty.project_order}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({
                      ...prevState,
                      project_order: e.target.value,
                    }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Typography mr={2}>Baños</Typography>
                <Input
                  fullWidth
                  value={dataProperty.bathrooms}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({ ...prevState, bathrooms: e.target.value }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Typography mr={2}>Medios Baños</Typography>
                <Input
                  fullWidth
                  value={dataProperty.restrooms}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({ ...prevState, restrooms: e.target.value }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Typography mr={2}>Capacidad del Cochera</Typography>
                <Input
                  fullWidth
                  value={dataProperty.cars_garage_capacity}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({
                      ...prevState,
                      cars_garage_capacity: e.target.value,
                    }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Typography mr={2}>Capacidad del Estacionamiento</Typography>
                <Input
                  fullWidth
                  value={dataProperty.cars_parking_lot_capacity}
                  onChange={(e) =>
                    setDataProperty((prevState) => ({
                      ...prevState,
                      cars_parking_lot_capacity: e.target.value,
                    }))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
            </Grid>

            {projects && projects?.length > 0 ? (
              <Grid item container columnSpacing={4} rowSpacing={2} xs={12}>
                <Grid item xs={12}>
                  <Typography variant="h5">Desarrollos</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Select
                    fullWidth
                    value={project || ''}
                    onChange={(e) => {
                      setProject(e.target.value);
                    }}
                    required
                  >
                    {projects.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            ) : null}
            <Grid item container>
              <AditionalInfo data={dataProperty} setData={setDataProperty} />
            </Grid>

            <VirtualTour dataProperty={dataProperty} setDataProperty={setDataProperty} />

            <Grid item container columnSpacing={4} rowSpacing={2} xs={12}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {id === 'new'
                    ? 'Los precios se podrán agregar una vez creado la propiedad'
                    : 'Precios'}
                </Typography>
              </Grid>

              {id !== 'new' ? (
                <Grid item container columnSpacing={4} xs={12}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      value={nuevoPrecio.name}
                      onChange={(e) =>
                        setNuevoPrecio((prevState) => ({ ...prevState, name: e.target.value }))
                      }
                      label="Nombre en lista"
                      variant="outlined"
                      type="text"
                      required
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      value={nuevoPrecio.price_base}
                      onChange={(e) =>
                        setNuevoPrecio((prevState) => ({
                          ...prevState,
                          price_base: e.target.value,
                        }))
                      }
                      label="Precio Base (MXN)"
                      variant="outlined"
                      type="text"
                      required
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      value={nuevoPrecio.price_m2_ext}
                      onChange={(e) =>
                        setNuevoPrecio((prevState) => ({
                          ...prevState,
                          price_m2_ext: e.target.value,
                        }))
                      }
                      label="Precio por M2 extra (MXN)"
                      variant="outlined"
                      type="text"
                      required
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <Button
                      sx={{ py: 2 }}
                      fullWidth
                      variant="contained"
                      disabled={
                        nuevoPrecio.name.length < 2 ||
                        nuevoPrecio.price_base < 20 ||
                        nuevoPrecio.price_m2_ext < 0
                      }
                      onClick={() => {
                        api_createPriceProperty(
                          {
                            id_property: id,
                            name: nuevoPrecio.name,
                            price_m2_ext: nuevoPrecio.price_m2_ext,
                            price_base: nuevoPrecio.price_base,
                          },
                          dataAuth.token
                        ).then((data) => {
                          setPreciosArray((prevState) => [
                            ...prevState,
                            {
                              id: data.id,
                              name: nuevoPrecio.name,
                              price_m2_ext: nuevoPrecio.price_m2_ext,
                              price_base: nuevoPrecio.price_base,
                            },
                          ]);
                          toast.success('Nuevo precio agregado');
                          setNuevoPrecio({ name: '', price_m2_ext: 0, price_base: 0 });
                        });
                      }}
                    >
                      Agregar Precio
                    </Button>
                  </Grid>
                </Grid>
              ) : null}

              {preciosArray.length > 0 && (
                <Grid item container xs={12}>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      py={1}
                      mt={2}
                      mb={1}
                      px={2}
                      borderBottom="1px solid #ddd"
                    >
                      <Typography width="25%" variant="h7">
                        Nombre en lista
                      </Typography>

                      <Typography width="25%" variant="h7">
                        Precio base
                      </Typography>

                      <Typography width="25%" variant="h7">
                        Precio por M2 extra
                      </Typography>

                      <Box width="25%" />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    {preciosArray.map((item) => (
                      <Box
                        key={item.id}
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                        mt={2}
                        pb={1}
                        px={2}
                        borderBottom="1px solid #ddd"
                      >
                        <Typography width="25%" variant="h7">
                          {item.name}
                        </Typography>

                        <Typography width="25%" variant="h7">
                          {fCurrency(item.price_base)}
                        </Typography>

                        <Typography width="25%" variant="h7">
                          {fCurrency(item.price_m2_ext)}
                        </Typography>

                        <Box width="25%" display="flex" justifyContent="flex-end">
                          <Button
                            color="error"
                            variant="contained"
                            onClick={() =>
                              api_deletePriceProperty(item.id, dataAuth.token)
                                .then(() => {
                                  setPreciosArray((prevState) =>
                                    prevState.filter((v) => v.id !== item.id)
                                  );
                                  toast.warning('Precio eliminado correctamente');
                                })
                                .catch(() => toast.error('Error al eliminar el precio'))
                            }
                          >
                            Borrar
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Grid item xs={12}>
              <Features propertyInitialData={origData} onFeaturesChanges={handleFeaturesChange} />
            </Grid>

            <Grid item container columnSpacing={2} rowSpacing={2} xs={12}>
              <Grid item xs={12} display="flex" alignItems="center">
                <Typography variant="h5">
                  {id !== 'new'
                    ? 'Imágenes de galería'
                    : 'Necesita crear la propiedad para agregar las imágenes extras'}
                </Typography>

                {id !== 'new' ? (
                  <Button sx={{ mx: 3, px: 3 }} onClick={uploadExtraImage}>
                    Agregar imagen
                  </Button>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <ImageList cols={3} sx={{ overflowX: 'hidden' }}>
                  {imageArray.map((item, index) => (
                    <Box key={item.id} display="flex" flexDirection="column" alignItems="center">
                      <ImageListComponent
                        onDelete={onDeleteImageFromArray}
                        index={index}
                        src={item.url}
                      />

                      <TextField
                        fullWidth
                        name="image_alt"
                        value={item.alt_text}
                        sx={{ my: 2, width: '20vw' }}
                        onChange={(e) => {
                          clearTimeout(typingTimeout);
                          const newArray = [...imageArray];
                          newArray[index].alt_text = e.target.value;
                          setImageArray(newArray);
                          const timeout = setTimeout(() => {
                            api_updateImageProperty(
                              item.id,
                              {
                                image_alt_text: e.target.value,
                              },
                              dataAuth.token
                            )
                              .then(() => {
                                toast.info(`Imagen id: ${item.id} actualizada`);
                              })
                              .catch(() => {
                                toast.error('Error al actualizar el orden');
                              });
                          }, 1500);

                          setTypingTimeout(timeout);
                        }}
                        label="Texto alternativo"
                        variant="outlined"
                      />

                      <TextField
                        sx={{ my: 2, width: '20vw' }}
                        fullWidth
                        value={item.order}
                        onChange={(e) => {
                          if (!Number.isNaN(e.target.value)) {
                            clearTimeout(typingTimeout);
                            const newArray = [...imageArray];
                            newArray[index].order = e.target.value;
                            setImageArray(newArray);
                            const timeout = setTimeout(() => {
                              api_updateImageProperty(
                                item.id,
                                {
                                  order: e.target.value,
                                },
                                dataAuth.token
                              )
                                .then(() => {
                                  toast.info(
                                    `Imagen id: ${item.id} actualizada con el orden nro ${e.target.value}`
                                  );
                                })
                                .catch(() => {
                                  toast.error('Error al actualizar el orden');
                                });
                            }, 1500);

                            setTypingTimeout(timeout);
                          }
                        }}
                        label="Orden Nro"
                        type="number"
                        variant="outlined"
                        required
                      />
                    </Box>
                  ))}
                </ImageList>
              </Grid>
            </Grid>

            {/* <Grid item container columnSpacing={4} rowSpacing={2} xs={12}>
              <Grid item xs={12} display="flex" alignItems="center">
                <Typography variant="h5">
                  {id !== 'new'
                    ? 'Imágenes de plantas arquitectónicas'
                    : 'Necesita crear la propiedad para agregar las plantas arquitectónicas'}
                </Typography>
                {id !== 'new' ? (
                  <Button sx={{ mx: 3, px: 3 }} onClick={() => handleShowAddBlueprint(true)}>
                    Agregar planta arquitectónica
                  </Button>
                ) : null}
              </Grid>

              <Grid item xs={12}>
                <ImageList cols={3} sx={{ overflowX: 'hidden' }}>
                  {blueprintsArray.map((item, index) => {
                    const parsedName =
                      typeof item.title === 'string' ? JSON.parse(item.title) : item.title;

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
                            onEdit={onDeleteBlueprintFromArray}
                          />

                          <h5>{parsedName?.es}</h5>
                        </div>
                      </Box>
                    );
                  })}
                </ImageList>
              </Grid>

              <Grid item xs={12}>
                <TitlesPropertiesCMS
                  titles={titlesCms}
                  onTitleChange={handleTitleChange}
                  databaseTitles={databaseTitlesCms}
                />
              </Grid>
            </Grid> */}

            <Grid item container columnSpacing={4} rowSpacing={2} xs={12}>
              <FloorComponent propertyId={id} />
              <Grid item xs={12}>
                <TitlesPropertiesCMS
                  titles={titlesCms}
                  onTitleChange={handleTitleChange}
                  databaseTitles={databaseTitlesCms}
                />
              </Grid>
            </Grid>

            <Grid item xs={12} display="flex" alignItems="center">
              <UrgencyChipForm
                urgencyChipData={urgencyChipData}
                setUrgencyChip={setDataUrgencyChip}
              />
            </Grid>
          </Grid>
        </Container>
      )}

      {/* <Modal open={showAddBlueprints}>
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
          <form onSubmit={handleAddBlueprint}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Agregar Planta Arquitectónica
              <IconButton
                onClick={() => handleShowAddBlueprint(false)}
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
              value={addBlueprintData.title.es}
              onChange={(e) => {
                setAddBlueprintData((prevState) => ({
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
              value={addBlueprintData.title.en}
              onChange={(e) => {
                setAddBlueprintData((prevState) => ({
                  ...prevState,
                  title: { ...prevState.title, en: e.target.value },
                }));
              }}
            />
            <hr />
            {addBlueprintData.characteristics_architectural_plans.map((item, index) => (
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
                    const newArray = [...addBlueprintData.characteristics_architectural_plans];
                    newArray[index].es = e.target.value;
                    setAddBlueprintData((prevState) => ({
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
                    const newArray = [...addBlueprintData.characteristics_architectural_plans];
                    newArray[index].en = e.target.value;
                    setAddBlueprintData((prevState) => ({
                      ...prevState,
                      characteristics_architectural_plans: newArray,
                    }));
                  }}
                />
              </div>
            ))}
            <Button // TODO: Habilitar cuando se requieran características en los planos arquitectónicos
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
            </Button>
            <hr className="my-8" />
            <input
              type="file"
              accept="image/*"
              onChange={uploadBlueprintImage}
              ref={blueprintRef}
              style={{ display: 'none' }}
            />
            {addBlueprintData.image_url ? (
              <Box py={2}>
                <img
                  style={{ borderRadius: '0.5rem' }}
                  width="100px"
                  height="auto"
                  src={addBlueprintData.image_url}
                  alt="Imagen de Propiedad"
                />
              </Box>
            ) : (
              <Button sx={{ my: 1, py: 3 }} fullWidth onClick={() => blueprintRef.current.click()}>
                Agregar Foto
              </Button>
            )}
            <TextField
              fullWidth
              name="blueprint_alt_text"
              value={addBlueprintData.image_alt_text}
              onChange={(e) => {
                setAddBlueprintData((prevState) => ({
                  ...prevState,
                  image_alt_text: e.target.value,
                }));
              }}
              label="Texto alternativo de imagen"
              variant="outlined"
            />
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              label="Orden Nro"
              type="number"
              value={addBlueprintData.order}
              onChange={(e) => {
                setAddBlueprintData((prevState) => ({
                  ...prevState,
                  order: e.target.value,
                }));
              }}
              variant="outlined"
            />
            <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary" fullWidth>
              Agregar
            </Button>
          </form>
        </Box>
      </Modal> */}

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
            Borrar propiedad
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Estás seguro?
          </Typography>
          <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
            <Button
              sx={{ px: 3 }}
              onClick={() => {
                setSaving(true);
                api_deleteProperty(id, dataAuth.token)
                  .then(() => {
                    navigate('/properties');
                  })
                  .catch(() => {
                    toast.error('error al borrar la propiedad');
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

// function ImageListImage({ index, src, onDelete, onEdit }) {
//   const style = {
//     backgroundImage: `url(${src})`,
//   };

//   return (
//     <ImageListItem>
//       <div style={style} className="div-for-img">
//         <Button
//           onClick={() => {
//             onDelete(index);
//           }}
//         >
//           <Iconify width={24} icon="mdi:bin" />
//         </Button>

//         {onEdit && (
//           <Button
//             onClick={() => {
//               onEdit(index);
//             }}
//           >
//             <Iconify width={24} icon="mdi:square-edit-outline" />
//           </Button>
//         )}
//       </div>
//     </ImageListItem>
//   );
// }

// ImageListImage.propTypes = {
//   index: PropTypes.any,
//   src: PropTypes.string,
//   onDelete: PropTypes.func,
//   onEdit: PropTypes.func,
// };
