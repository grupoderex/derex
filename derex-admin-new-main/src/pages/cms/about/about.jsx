import { useFormik } from 'formik';
import { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import {
  api_deleteAboutSection,
  api_getAllAboutSections,
  api_getTitlesBySection,
  api_upsertAboutSections,
  api_upsertTitles,
} from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import { TitleInput } from '../titles/components/title-input';
import { AboutSection } from './components/about-section';

const section = {
  title: 'Acerca de Javer',
  titles: [
    {
      title: 'Título principal',
      key: 'aboutJaver_mainTitle',
    },
    {
      title: 'Banner',
      key: 'aboutJaver_bannerUrl',
      render: false,
    },
  ],
};

export function About () {
  const { dataAuth, setMediaForID } = useAppContext();

  const hasNestedErrors = (errorNode) => {
    if (!errorNode) return false;
    if (typeof errorNode === 'string') return true;
    if (Array.isArray(errorNode)) return errorNode.some((item) => hasNestedErrors(item));
    if (typeof errorNode === 'object') {
      return Object.values(errorNode).some((value) => hasNestedErrors(value));
    }
    return false;
  };

  const findFirstError = (errorNode, path = '') => {
    if (!errorNode) return null;
    if (typeof errorNode === 'string') {
      return { path: path || 'seccion', message: errorNode };
    }
    if (Array.isArray(errorNode)) {
      for (let i = 0; i < errorNode.length; i += 1) {
        const result = findFirstError(errorNode[i], `${path}[${i}]`);
        if (result) return result;
      }
      return null;
    }
    if (typeof errorNode === 'object') {
      const entries = Object.entries(errorNode);
      for (let i = 0; i < entries.length; i += 1) {
        const [key, value] = entries[i];
        const nextPath = path ? `${path}.${key}` : key;
        const result = findFirstError(value, nextPath);
        if (result) return result;
      }
    }
    return null;
  };

  const { data: dataTitles, refetch: refetchTitles } = useQuery('titles', {
    queryFn: () => api_getTitlesBySection('about-javer'),
    refetchOnWindowFocus: false,
    onSuccess: (newData) => {
      setValuesTitles(
        section.titles.reduce((acc, title) => {
          const existentTitle = newData?.data.find((t) => t.name === title.key);
          acc[title.key] = {
            value: existentTitle?.value ?? '',
            value_en: existentTitle?.value_en ?? '',
            bold: existentTitle?.bold ?? false,
            outline: existentTitle?.outline ?? false,
            color: existentTitle?.color ?? false,
          };

          return acc;
        }, {})
      );
    },
  });

  const { mutate: setTitles, isLoading: isLoadingTitles } = useMutation('upsertTitles', {
    mutationFn: (values) => api_upsertTitles(values, dataAuth.token),
    onSuccess: () => {
      toast.success('Titulos actualizados');
      refetchTitles();
    },
    onError: () => {
      toast.error('Error al actualizar titulos');
    },
  });

  /**
   * @type {Array<HomeTitle>}
   */
  const initialValuesTitles = useMemo(
    () =>
      section.titles.reduce((acc, title) => {
        const existentTitle = dataTitles?.data.find((t) => t.name === title.key);
        acc[title.key] = {
          value: existentTitle?.value ?? '',
          value_en: existentTitle?.value_en ?? '',
          bold: existentTitle?.bold ?? false,
          outline: existentTitle?.outline ?? false,
          color: existentTitle?.color ?? false,
        };

        return acc;
      }, {}),
    [dataTitles]
  );

  const validationSchemaTitles = useMemo(
    () =>
      yup.object().shape(
        section.titles.reduce((acc, title) => {
          acc[title.key] = yup.object().shape({
            value: yup
              .string()
              .required('Campo requerido')
              .max(title.render !== false ? 50 : Number.MAX_SAFE_INTEGER, 'Máximo 50 caracteres'),
            value_en: yup
              .string()
              .required('Campo requerido')
              .max(title.render !== false ? 50 : Number.MAX_SAFE_INTEGER, 'Máximo 50 caracteres'),
            bold: yup.boolean(),
            outline: yup.boolean(),
            color: yup.boolean(),
          });

          return acc;
        }, {})
      ),
    []
  );

  const {
    submitForm: submitTitles,
    errors: errorsTitles,
    setFieldValue,
    values: valuesTitles,
    isValid: isValidTitles,
    setValues: setValuesTitles,
  } = useFormik({
    initialValues: initialValuesTitles,
    validationSchema: validationSchemaTitles,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (newValues) =>
      setTitles(
        Object.entries(newValues).map(([key, value]) => ({
          ...value,
          section: 'about-javer',
          name: key,
        }))
      ),
  });

  const [deleteSection, setDeleteSection] = useState(null);

  const { refetch } = useQuery('about-sections', {
    queryFn: api_getAllAboutSections,
    onSuccess: (data) => {
      setValues(data);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate, isLoading } = useMutation('save-about-javer', {
    mutationFn: (values) =>
      api_upsertAboutSections(
        values.map((it, index) => ({
          ...it,
          index_order: index,
          id: undefined,
        })),
        dataAuth.token
      ),
    onSuccess: () => {
      toast.success('Secciones guardadas');
      refetch();
    },
    onError: (error) => {
      toast.error('Error al guardar las secciones');
    },
  });

  const { mutate: deleteAbout } = useMutation('delete-about-section', {
    mutationFn: (id) => api_deleteAboutSection(id, dataAuth.token),
    onSuccess: () => {
      toast.success('Sección eliminada');
      refetch();
    },
    onError: () => {
      toast.error('Error al eliminar la sección');
    },
  });

  const validationSchema = yup.array().of(
    yup.object().shape({
      index_order: yup.number().required('El índice es requerido'),
      image_url: yup.string().required('La URL de la imagen es requerida'),
      is_image_left: yup.boolean().required('La posición de la imagen es requerida'),
      content_es: yup.string().required('El contenido en español es requerido'),
      content_en: yup.string().required('El contenido en inglés es requerido'),
    })
  );

  /**
   * @type {ReturnType<typeof useFormik<import('src/data/APICalls').AboutSection[]>>}
   */
  const { values, errors, submitForm, validateForm, submitCount, setValues } = useFormik({
    initialValues: [],
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (newValues) => mutate(newValues),
  });

  const handleSaveSections = async () => {
    const validationErrors = await validateForm();

    if (hasNestedErrors(validationErrors)) {
      const firstError = findFirstError(validationErrors);
      const detail = firstError
        ? `${firstError.path}: ${firstError.message}`
        : 'Revisa URL de imagen y contenido ES/EN.';
      toast.error(`Hay campos invalidos. ${detail}`);
      return;
    }

    submitForm();
  };

  const fileRef = useRef();

  const uploadFile = () => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo archivo');
      setMediaForID('file', fRef.files[0]).then((url) => {
        setValuesTitles({
          ...valuesTitles,
          aboutJaver_bannerUrl: {
            ...valuesTitles.aboutJaver_bannerUrl,
            value: url,
          },
        })
          .then(() => {
            toast.success('Imagen subida');
          })
          .catch(() => {
            toast.error('Error al subir la imagen');
          });
      });
    };
    fRef.click();
  };

  return (
    <Container>
      <Dialog open={deleteSection} onClose={() => setDeleteSection(null)}>
        <DialogTitle>¿Estás seguro de eliminar esta sección?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteSection(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteAbout(deleteSection);
              setDeleteSection(null);
            }}
            disabled={isLoading}
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1>Titulos</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={submitTitles}
          disabled={isLoadingTitles || !isValidTitles}
        >
          Guardar encabezado (meta)
        </Button>
      </div>
      <Card>
        <CardContent>
          <input
            type="file"
            ref={fileRef}
            style={{
              display: 'none',
            }}
          />
          <div
            key={section.title}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h2
              style={{
                marginTop: '0',
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                width: '100%',
              }}
            >
              {valuesTitles.aboutJaver_bannerUrl.value && (
                <img
                  src={valuesTitles.aboutJaver_bannerUrl.value}
                  alt="Imagen de la sección"
                  style={{
                    width: 'auto',
                    height: '256px',
                    objectFit: 'cover',
                  }}
                />
              )}

              <Button onClick={uploadFile}>Subir imagen</Button>
            </div>
            <TextField
              fullWidth
              name="main_image_alt_text"
              value={valuesTitles.aboutJaver_bannerUrl.value_en}
              onChange={(e) => {
                setValuesTitles({
                  ...valuesTitles,
                  aboutJaver_bannerUrl: {
                    ...valuesTitles.aboutJaver_bannerUrl,
                    value_en: e.target.value,
                  },
                });
              }}
              label="Texto alternativo"
              variant="outlined"
            />
            <div
              style={{
                color: 'red',
                marginBottom: '2em',
              }}
            >
              {errorsTitles.aboutJaver_bannerUrl?.value &&
                errorsTitles.aboutJaver_bannerUrl.value_en}
            </div>
            {section.titles
              .filter((it) => it.render !== false)
              .map((title) => (
                <TitleInput
                  key={title.key}
                  label={title.title}
                  titleEs={valuesTitles[title.key]?.value}
                  setTitleEs={(value) => setFieldValue(`${title.key}.value`, value)}
                  titleEn={valuesTitles[title.key]?.value_en}
                  setTitleEn={(value) => setFieldValue(`${title.key}.value_en`, value)}
                  style={Object.entries(valuesTitles[title.key] ?? {}).reduce(
                    (acc, [key, value]) => {
                      if (key === 'bold' && value) {
                        return 'bold';
                      }
                      if (key === 'outline' && value) {
                        return 'border';
                      }
                      if (key === 'color' && value) {
                        return 'color';
                      }
                      return acc;
                    },
                    undefined
                  )}
                  setStyle={(style) => {
                    setFieldValue(`${title.key}.bold`, style === 'bold');
                    setFieldValue(`${title.key}.outline`, style === 'border');
                    setFieldValue(`${title.key}.color`, style === 'color');
                  }}
                  errors={errorsTitles[title.key]}
                />
              ))}
          </div>
        </CardContent>
      </Card>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          marginTop: '3rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h1>Acerca de Javer</h1>
          <div
            style={{
              display: 'flex',
              gap: '16px',
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                setValues((prev) => [
                  ...prev,
                  {
                    index_order: prev.length,
                    image_url: '',
                    is_image_left: true,
                    content_es: '',
                    content_en: '',
                  },
                ]);
              }}
            >
              + Agregar sección
            </Button>
            <Button variant="contained" onClick={handleSaveSections} disabled={isLoading || values.length === 0}>
              Guardar secciones (about-us)
            </Button>
          </div>
        </div>

        {submitCount > 0 && hasNestedErrors(errors) && values.length > 0 && (
          <p style={{ color: '#b71c1c', margin: '0 0 16px 0' }}>
            Hay campos pendientes o invalidos en una o mas secciones. Revisa URL de imagen y contenido ES/EN.
          </p>
        )}

        {values.length === 0 && <p>No hay secciones</p>}

        {values.map((item, index) => (
          <AboutSection
            key={item.id}
            removeSection={() => {
              setDeleteSection(item.id);
            }}
            values={item}
            errors={errors[index]}
            onUpdateValues={(newValue) => {
              setValues((prev) =>
                prev.map((it) => (it.index_order === item.index_order ? newValue : it))
              );
            }}
            moveSectionUp={() => {
              setValues((prev) => {
                const currentIndex = prev.findIndex((it) => it.index_order === item.index_order);
                const prevIndex = currentIndex - 1;
                const newValues = [...prev];
                newValues[currentIndex] = {
                  ...prev[prevIndex],
                  index_order: currentIndex,
                };
                newValues[prevIndex] = {
                  ...prev[currentIndex],
                  index_order: prevIndex,
                };
                return newValues;
              });
            }}
            moveSectionDown={() => {
              setValues((prev) => {
                const currentIndex = prev.findIndex((it) => it.index_order === item.index_order);
                const nextIndex = currentIndex + 1;
                const newValues = [...prev];
                newValues[currentIndex] = {
                  ...prev[nextIndex],
                  index_order: currentIndex,
                };
                newValues[nextIndex] = {
                  ...prev[currentIndex],
                  index_order: nextIndex,
                };
                return newValues;
              });
            }}
            maxIndex={values.length - 1}
          />
        ))}
      </div>
    </Container>
  );
}
