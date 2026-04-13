import { toast } from 'react-toastify';
import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Grid, Modal, Stack, Button, Container, TextField, Typography } from '@mui/material';

import { toUrlCase } from 'src/utils/format-url';
import { validateProjectData } from 'src/utils/validations';
import { validatePromotionData } from 'src/utils/promotionValidation';

import { envProject } from 'src/config';
import useAppContext from 'src/data/DataProvider';
import { api_createAmenity } from 'src/data/projectApiCalls/amanities';
import {
  api_upsertTitles,
  api_createProject,
  api_updateProject,
  api_getProjectById,
  api_deleteProperty,
  api_deleteProjectById,
  api_getTitlesBySection,
  api_getPropertiesByProjectId,
  api_getPromotionsByProjectId,
  api_togglePromotionsByProject,
  api_createPromotionsByProjectId,
  api_updatePromotionsByProjectId,
} from 'src/data/APICalls';

import LoadingSpiner from 'src/components/loading';

import { Presale } from './components/Presale';
import { Promotions } from './components/Promotions';
import { AditionalInfo } from './components/AditionalInfo';
import { ProjectActive } from './components/ProjectActive';
import TitlesProjectsCMS, { titlesProjectsSection } from './components/TitlesProjectsCMS';
import {
  Media,
  Amenities,
  Direction,
  Equipments,
  CreditTypes,
  ProjectData,
  Propierties,
  Outstanding,
  ContactForm,
  LiveExpirence,
  InterestsZones,
  StatesAndCities,
} from './components';

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
  logo_color: '',
  video_url: '',
  name: '',
  short_name: '',
  type_orientation: 'horizontal',
  vertical_data: null,
  description: '',
  long_description: '',
  description_eng: '',
  long_description_eng: '',
  featured: '',
  email_contact: '',
  phone_contact: '',
  cat_credits_id: [],
  calle: '',
  colonia: '',
  cp: '',
  latitud: '19.5',
  longitud: '-99',
  link_map: '',
  wase_link_map: '',
  live_the_experience_description: '',
  live_the_experience_description_en: '',
  live_the_experience_url: '',
  interest_area: {},
  equipment: {},
  outstanding: 'false',
  contact_form: {
    phone_number: '',
    opening_hours: {
      es: '',
      en: '',
    },
  },
  visible: true,
  document_url: '',
  url_salesforce: '',
};

export default function Project() {
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    loadingStates: false,
    loadingCities: false,
  });
  const location = useLocation();
  const navigate = useNavigate();

  const { dataAuth, setMediaForID, setFileForID } = useAppContext();

  const [projectProperties, setProjectProperties] = useState([]);
  const [propertyToDelete, setPropertyToDelete] = useState(undefined);

  const [id, setId] = useState(new URLSearchParams(document.location.search).get('id') || 'new');

  const [saving, setSaving] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState(location.state?.id_city);
  const [amenitiesArray, setAmenitiesArray] = useState([]);
  const [amenitiesOnlyImageArray, setAmenitiesOnlyImageArray] = useState([]);
  const [interestArray, setInterestArray] = useState([]);
  const [equipmentsArray, setequipmentsArray] = useState([]);
  const [titlesCms, setTitlesCms] = useState([]);
  const [databaseTitlesCms, setDatabaseTitlesCms] = useState([]);

  const [promotion, setPromotion] = useState({
    title_es: '',
    title_en: '',
    description_es: '',
    description_en: '',
    promo_image: '',
    is_active: false,
  });

  const [dataProject, setDataProject] = useState(initialState);
  const [origData, setOrigData] = useState({
    ...initialState,
  });
  const [initialCity, setInitialCity] = useState(0);

  useEffect(() => {
    if (id !== 'new') {
      setLoading(true);
      api_getProjectById(id)
        .then((dataApi) => {
          const cp = dataApi.cp.slice(5);
          setDataProject({ ...dataApi, cp });
          setOrigData({ ...dataApi, cp });
          setInitialCity(dataApi.id_city);
        })
        .catch(() => {
          toast.error('Error al obtener la data del desarrollo');
          navigate('/');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id !== 'new') {
      api_getPropertiesByProjectId(id)
        .then(setProjectProperties)
        .catch(() =>
          toast.error(
            'Error al obtener las propiedades. Refresque la pagina o revise su conexion a internet'
          )
        );
    }
  }, [id, propertyToDelete]);

  useEffect(() => {
    if (id && id !== 'new') {
      api_getTitlesBySection(`project_${id}`)
        .then((data) => {
          setDatabaseTitlesCms(
            titlesProjectsSection.titles.map((title) => {
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
    if (id && id !== 'new') {
      api_getPromotionsByProjectId(id)
        .then(({ promotion }) => {
          setPromotion({
            id: promotion.id,
            project_id: promotion.project_id,
            title_es: promotion.title_es,
            title_en: promotion.title_en,
            promo_image: promotion.promo_image,
            description_es: promotion.description_es,
            description_en: promotion.description_en,
            color_combination: promotion.color_combination,
            is_active: promotion.is_active,
          });
        })
        .catch(() => {});
    }
  }, [id]);

  const onClickPropDelete = (id_property) => {
    setDeleteModalVisible(true);
    setPropertyToDelete(id_property);
  };

  const handleFormChange = (childState) => {
    setDataProject((prevState) => ({ ...prevState, ...childState }));
  };

  const handleFormStateChange = (childState) => {
    setSelectedCity(childState);
  };

  const handleAmenitiesChange = (childState) => {
    setAmenitiesArray(childState);
  };

  const handleAmenitiesOnlyImageChange = (childState) => {
    setAmenitiesOnlyImageArray(childState);
  };

  const handleInterestsChange = (childState) => {
    setInterestArray(childState);
  };

  const handleTitleChange = (childState) => {
    setTitlesCms(childState);
  };

  const handleEquipmentChange = (childState) => {
    setequipmentsArray(childState);
  };

  const handleFormStateLoadingChange = (state, city) => {
    setLoadingStates({
      loadingCities: city,
      loadingStates: state,
    });
  };

  const onSaveAmenites = async ({ name, name_eng, img_url }, id_project, toastId) => {
    try {
      const body = {
        id_project,
        name: name || undefined,
        name_eng: name_eng || undefined,
        img_url,
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

  const saveCMSTitles = async (idProject) => {
    try {
      await api_upsertTitles(
        titlesProjectsSection.titles.map(({ key }) => {
          const title = titlesCms.find((t) => t.name === key);
          return {
            name: key,
            section: `project_${idProject}`,
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

  const onSaveProject = async () => {
    const toastId = toast.loading('Guardando el desarrollo');
    setSaving(true);

    let idProject = id;

    try {
      let interest_area = {
        sp: [],
        en: [],
      };
      let equipment = {
        sp: [],
        en: [],
      };

      if (interestArray.length) {
        const sp_interest = [];
        const en_interest = [];

        for (let index = 0; index < interestArray.length; index += 1) {
          const interest = interestArray[index];

          sp_interest.push(interest.name);
          en_interest.push(interest.name_eng);
        }
        interest_area = {
          sp: sp_interest,
          en: en_interest,
        };
      }

      if (equipmentsArray.length) {
        const sp_equipment = [];
        const en_equipment = [];

        for (let index = 0; index < equipmentsArray.length; index += 1) {
          const equipment_element = equipmentsArray[index];

          sp_equipment.push(equipment_element.name);
          en_equipment.push(equipment_element.name_eng);
        }
        equipment = {
          sp: sp_equipment,
          en: en_equipment,
        };
      }

      const dataParsed = {
        ...dataProject,
        cp: `${dataProject?.cp}`,
        id_city: selectedCity.id_city,
        ciudad: selectedCity.ciudad,
        latitud: Number(dataProject?.latitud || '19.5'),
        longitud: Number(dataProject?.longitud || '-99'),
        vertical_data:
          dataProject?.vertical_data &&
          (dataProject?.type_orientation === 'vertical' ||
            dataProject?.type_orientation === 'mixed')
            ? {
                departments: Number(dataProject?.vertical_data?.departments),
                levels: Number(dataProject?.vertical_data?.levels),
              }
            : null,
        interest_area,
        equipment,
        cat_credits_id: dataProject.cat_credits_id?.map(({ id: creditTypeId }) => creditTypeId),
        credit_types: undefined,
        numero_ext: undefined,
        numero_int: undefined,
        logo_grey: undefined,
        active: undefined,
        id: undefined,
        type_project: undefined,
        update_at: undefined,
        created_at: undefined,
        hasPropertyWithEdgeCertification: undefined,
        outstanding: (dataProject.outstanding === 1).toString(),
        contact_form: dataProject?.contact_form,
        url_salesforce: dataProject.url_salesforce,
      };

      const errorParsed = validateProjectData(dataParsed);

      dataParsed.cp = `C.P. ${dataProject?.cp}`;

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

      if (id === 'new') {
        try {
          const { id: project_id } = await api_createProject(dataParsed, dataAuth.token);

          setId(project_id);
          idProject = project_id;

          if (amenitiesArray.length) {
            amenitiesArray.map(async (amenityToCreate) => {
              await onSaveAmenites(amenityToCreate, project_id, toastId);
            });
          }

          if (amenitiesOnlyImageArray.length) {
            amenitiesOnlyImageArray.map(async (amenityToCreate) => {
              await onSaveAmenites(amenityToCreate, project_id, toastId);
            });
          }

          const promotionValid = await validatePromotionData(promotion);

          if (promotion.title_es && promotionValid) {
            const response = await api_createPromotionsByProjectId(
              { ...promotion, project_id },
              dataAuth.token
            );

            if (promotion.is_active) {
              await api_togglePromotionsByProject(
                response[0],
                { is_active: promotion.is_active },
                dataAuth.token
              );
            }
          }

          toast.update(toastId, {
            render: 'Desarrollo creado exitosamente',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });

          setSaving(false);

          navigate(`/project?id=${project_id}`);
        } catch {
          toast.update(toastId, {
            render: 'Error al crear el desarrollo',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });

          setSaving(false);
        }

        return;
      }

      try {
        await api_updateProject(id, dataParsed, dataAuth.token);

        if (promotion?.id) {
          await api_updatePromotionsByProjectId(promotion.id, promotion, dataAuth.token);
        } else if (promotion?.title_es && !promotion?.id) {
          await api_createPromotionsByProjectId(
            { ...promotion, project_id: id, color_combination: 'residential' },
            dataAuth.token
          );
        }
        toast.update(toastId, {
          render: 'Desarrollo actualizado exitosamente',
          type: 'success',
          isLoading: false,
          autoClose: 5000,
        });

        setSaving(false);
      } catch {
        toast.update(toastId, {
          render: 'Error al actualizar el desarrollo',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });

        setSaving(false);
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: 'Error al guardar el desarrollo',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });

      setSaving(false);
      return;
    }

    try {
      await saveCMSTitles(idProject);
    } catch (error) {
      toast.error('Error al guardar los titulos');
    }

    toast.dismiss(toastId);
    setSaving(false);
  };

  const onRollback = () => {
    const newData = origData;
    setDataProject({ ...newData });
    setOrigData({ ...newData });
  };

  const fileRef = useRef();
  const filePdfRef = useRef();

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo Imagen');
      if (!fRef.files[0]) onCancel();
      else setMediaForID('file', fRef.files[0]).then(onChange).catch(onCancel);

      fRef.value = '';
    };
    fRef.oncancel = onCancel;
    fRef.click();
  };

  const UseFilePdfRefForUpload = (onChange, onCancel) => {
    const fRef = filePdfRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo archivo');
      if (!fRef.files[0]) onCancel();
      else setFileForID('file', fRef.files[0]).then(onChange).catch(onCancel);

      fRef.value = '';
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
              <a
                href={`${envProject.frontendUrl}/desarrollos/${toUrlCase(dataProject.short_name)}?show_invisible=true`}
                target="_blank"
                rel="noreferrer"
              >
                <Button sx={{ mr: '0.5em' }} variant="outlined">
                  Ver en el sitio
                </Button>
              </a>
            )}
            <Button disabled={saving} onClick={onRollback} variant="contained" color="inherit">
              Revertir
            </Button>
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

          <ProjectActive dataProject={dataProject} setDataProject={setDataProject} />

          <Presale dataProject={dataProject} setDataProject={setDataProject} />

          <Outstanding dataProject={dataProject} setDataProject={setDataProject} />

          <Media mediaInitialData={origData} onFormChange={handleFormChange} />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 3, mb: 3 }}
          >
            <input className="hidden-file" type="file" ref={fileRef} />
            <Stack direction="column" mr={3}>
              <Button
                onClick={() => {
                  const toastId = toast.loading('Esperando por la seleccion de la imagen');
                  UseFileRefForUpload(
                    (data) => {
                      toast.update(toastId, {
                        render:
                          'Miniatura subida correctamente, recuerda guardar cambios para ligarlo al proyecto',
                        type: 'warning',
                        isLoading: false,
                        autoClose: 5000,
                      });
                      setDataProject((prevState) => ({ ...prevState, thumbnail: data }));
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
                {dataProject?.thumbnail ? 'Actualizar la miniatura' : 'Subir miniatura'}
              </Button>
              {dataProject?.banner_url ? (
                <Button
                  sx={{ mt: 1 }}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setDataProject((prevState) => ({ ...prevState, thumbnail: null }));
                    toast.warn('Miniatura borrada, recuerde guardar cambios');
                  }}
                >
                  Borrar Miniatura
                </Button>
              ) : null}
            </Stack>
            {dataProject?.thumbnail ? (
              <Box py={2}>
                <img
                  height="200"
                  style={{
                    height: 'auto',
                    maxWidth: '300px',
                  }}
                  src={dataProject.thumbnail}
                  alt="Imagen de miniatura"
                />
              </Box>
            ) : null}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 3, mb: 3 }}
          >
            <input className="hidden-file" type="file" ref={filePdfRef} />
            <Stack direction="column" mr={3}>
              <Button
                onClick={() => {
                  const toastId = toast.loading('Esperando por la seleccion de la imagen');
                  UseFilePdfRefForUpload(
                    (data) => {
                      toast.update(toastId, {
                        render:
                          'Archivo subido correctamente, recuerda guardar cambios para ligarlo al proyecto',
                        type: 'warning',
                        isLoading: false,
                        autoClose: 5000,
                      });
                      setDataProject((prevState) => ({ ...prevState, document_url: data }));
                    },
                    () => {
                      toast.update(toastId, {
                        render: 'Error al subir el archivo',
                        type: 'error',
                        isLoading: false,
                        autoClose: 5000,
                      });
                    }
                  );
                }}
              >
                {dataProject?.document_url ? 'Actualizar el brochure' : 'Subir brochure'}
              </Button>
              {dataProject?.document_url ? (
                <Button
                  sx={{ mt: 1 }}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setDataProject((prevState) => ({ ...prevState, document_url: null }));
                    toast.warn('Brochure borrado, recuerde guardar cambios');
                  }}
                >
                  Borrar Brochure
                </Button>
              ) : null}
            </Stack>
            {dataProject?.document_url ? (
              <Box py={2}>
                <a href={dataProject.document_url} target="_blank" rel="noreferrer">
                  <Button variant="outlined">Ver Brochure</Button>
                </a>
              </Box>
            ) : null}
          </Stack>

          <Stack sx={{ borderBottom: '1px solid #ddd', py: 3, mb: 3 }}>
            <TextField
              fullWidth
              name="thumbnail_alt_text"
              value={dataProject.thumbnail_alt_text}
              onChange={(e) => {
                setDataProject((prevState) => ({
                  ...prevState,
                  thumbnail_alt_text: e.target.value,
                }));
              }}
              label="Texto alternativo de miniatura"
              variant="outlined"
            />
          </Stack>

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
                  const toastId = toast.loading('Esperando por la seleccion de la imagen');
                  UseFileRefForUpload(
                    (data) => {
                      toast.update(toastId, {
                        render:
                          'Banner subido correctamente, recuerda guardar cambios para ligarlo al proyecto',
                        type: 'warning',
                        isLoading: false,
                        autoClose: 5000,
                      });
                      setDataProject((prevState) => ({ ...prevState, banner_url: data }));
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
                {dataProject?.banner_url
                  ? 'Actualizar banner promocional'
                  : 'Subir banner promocional'}
              </Button>
              {dataProject?.banner_url ? (
                <Button
                  sx={{ mt: 1 }}
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setDataProject((prevState) => ({ ...prevState, banner_url: '' }));
                    toast.warn('Banner borrado, recuerde guardar cambios');
                  }}
                >
                  Borrar Banner
                </Button>
              ) : null}
            </Stack>
            {dataProject?.banner_url ? (
              <Box py={2}>
                <img
                  height="200"
                  style={{
                    height: 'auto',
                    maxWidth: '600px',
                  }}
                  src={dataProject.banner_url}
                  alt="Imagen de Promo"
                />
              </Box>
            ) : null}
          </Stack>

          <Grid container columnSpacing={2} rowSpacing={5}>
            <Grid item xs={12}>
              <ProjectData dataProject={dataProject} setDataProject={setDataProject} />
            </Grid>

            <Grid item xs={12}>
              <ContactForm dataProject={dataProject} setDataProject={setDataProject} />
            </Grid>

            <Grid item xs={12}>
              <CreditTypes creditInitialData={origData} onFormChange={handleFormChange} />
            </Grid>

            <Grid item xs={12}>
              <Direction directionInitialData={origData} onFormChange={handleFormChange} />
            </Grid>

            <Grid item xs={12}>
              <StatesAndCities
                initialCity={initialCity}
                onFormChange={handleFormStateChange}
                onLoaderChange={handleFormStateLoadingChange}
              />
            </Grid>

            <Grid item xs={12}>
              <AditionalInfo setData={handleFormChange} data={dataProject} />
            </Grid>

            <Grid item xs={12}>
              <LiveExpirence dataProject={dataProject} setDataProject={setDataProject} />
            </Grid>

            <Grid item xs={12}>
              <Amenities id={id} onAmenitiesChanges={handleAmenitiesChange} />
            </Grid>

            <Grid item xs={12}>
              <Amenities id={id} onAmenitiesChanges={handleAmenitiesOnlyImageChange} isOnlyImage />
            </Grid>

            <Grid item xs={12}>
              <InterestsZones
                interestZoneInitialData={origData}
                onInterestZoneChange={handleInterestsChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Equipments
                equipmentInitialData={origData}
                onEquipmentChange={handleEquipmentChange}
              />
            </Grid>

            {}

            <Grid item xs={12}>
              <Promotions promotionData={promotion} setPromotion={setPromotion} />
            </Grid>

            <Grid item xs={12}>
              <Propierties
                id={id}
                projectProperties={projectProperties}
                onDeleteProperty={onClickPropDelete}
              />
            </Grid>

            <Grid item xs={12}>
              <TitlesProjectsCMS
                isPresale={dataProject.is_presale}
                titles={titlesCms}
                onTitleChange={handleTitleChange}
                databaseTitles={databaseTitlesCms}
              />
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
            {propertyToDelete ? 'Borrar propiedad' : 'Borrar desarrollo'}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Estás seguro?
          </Typography>
          <Box display="flex" sx={{ mt: 3 }} justifyContent="center">
            <Button
              sx={{ px: 3 }}
              onClick={() => {
                setSaving(true);
                if (!propertyToDelete) {
                  api_deleteProjectById(id, dataAuth.token)
                    .then(() => {
                      toast.success('Desarrollo borrado');
                      navigate('/');
                    })
                    .catch(() => toast.error('Error al borrar el desarrollo'))
                    .finally(() => {
                      setSaving(false);
                      setDeleteModalVisible(false);
                    });
                } else {
                  api_deleteProperty(propertyToDelete, dataAuth.token)
                    .then(() => {
                      toast.success('Propiedad borrada');
                    })
                    .catch(() => toast.error('Error al borrar el desarrollo'))
                    .finally(() => {
                      setPropertyToDelete(undefined);
                      setDeleteModalVisible(false);
                      setSaving(false);
                    });
                }
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
