import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useRef, useMemo, useState } from 'react';
import { useQuery, useMutation } from 'react-query';

import {
  Card,
  Table,
  Button,
  Dialog,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  CardContent,
  DialogActions,
  TextField,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_upsertTitles,
  api_getTitlesBySection,
  api_deleteCertificationAndAward,
  api_getAllCertificationsAndAwards,
} from 'src/data/APICalls';

import { TitleInput } from '../titles/components/title-input';

const section = {
  title: 'Certificaciones y premios',
  titles: [
    {
      title: 'Título principal',
      key: 'certifications_mainTitle',
    },
    {
      title: 'Título banner',
      key: 'certifications_bannerTitle',
    },
    {
      title: 'Banner',
      key: 'certifications_bannerUrl',
      render: false,
    },
  ],
};

export function CertificationsAndAwardsPage() {
  const { dataAuth } = useAppContext();

  const { data: dataTitles, refetch: refetchTitles } = useQuery('titles', {
    queryFn: () => api_getTitlesBySection('certifications'),
    refetchOnWindowFocus: false,
    onSuccess: (newData) => {
      setValues(
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

  const { mutate, isLoading: isLoadingTitles } = useMutation('upsertTitles', {
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
  const initialValues = useMemo(
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

  const validationSchema = useMemo(
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

  const { submitForm, errors, setFieldValue, values, isValid, setValues } = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (newValues) =>
      mutate(
        Object.entries(newValues).map(([key, value]) => ({
          ...value,
          section: 'certifications',
          name: key,
        }))
      ),
  });

  const { data, refetch } = useQuery('certifications', {
    queryFn: () => api_getAllCertificationsAndAwards(dataAuth.token),
  });

  const { mutate: deleteCertification, isLoading } = useMutation('deleteCertifications', {
    mutationFn: (id) => api_deleteCertificationAndAward(id, dataAuth.token),
    onSuccess: () => {
      refetch();
    },
  });

  const [deleteId, setDeleteId] = useState(null);

  const { setMediaForID } = useAppContext();

  const fileRef = useRef();

  const uploadFile = () => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo archivo');
      setMediaForID('file', fRef.files[0])
        .then((url) => {
          setValues({
            ...values,
            certifications_bannerUrl: {
              ...values.certifications_bannerUrl,
              value: url,
            },
          });
        })
        .then(() => {
          toast.success('Imagen subida');
        })
        .catch(() => {
          toast.error('Error al subir la imagen');
        });
    };
    fRef.click();
  };

  const certifications = data?.data;

  return (
    <Container>
      <Dialog open={deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Estás seguro de eliminar esta certificación?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteCertification(deleteId);
              setDeleteId(null);
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
          onClick={submitForm}
          disabled={isLoadingTitles || !isValid}
        >
          Guardar
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
              {values.certifications_bannerUrl.value && (
                <img
                  src={values.certifications_bannerUrl.value}
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
              value={values.certifications_bannerUrl.value_en}
              onChange={(e) => {
                setValues({
                  ...values,
                  certifications_bannerUrl: {
                    ...values.certifications_bannerUrl,
                    value_en: e.target.value,
                  },
                });
              }}
              label="Texto alternativo de imagen principal"
              variant="outlined"
            />
            <div
              style={{
                color: 'red',
                marginBottom: '2em',
              }}
            >
              {errors.certifications_bannerUrl?.value && errors.certifications_bannerUrl.value_en}
            </div>
            {section.titles
              .filter((it) => it.render !== false)
              .map((title) => (
                <TitleInput
                  key={title.key}
                  label={title.title}
                  titleEs={values[title.key]?.value}
                  setTitleEs={(value) => setFieldValue(`${title.key}.value`, value)}
                  titleEn={values[title.key]?.value_en}
                  setTitleEn={(value) => setFieldValue(`${title.key}.value_en`, value)}
                  style={Object.entries(values[title.key] ?? {}).reduce((acc, [key, value]) => {
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
                  }, undefined)}
                  setStyle={(style) => {
                    setFieldValue(`${title.key}.bold`, style === 'bold');
                    setFieldValue(`${title.key}.outline`, style === 'border');
                    setFieldValue(`${title.key}.color`, style === 'color');
                  }}
                  errors={errors[title.key]}
                />
              ))}
          </div>
        </CardContent>
      </Card>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1em',
          marginTop: '2em',
        }}
      >
        <h1>Certificaciones y premios</h1>
        <Link to="/cms/certifications-and-awards/create">
          <Button variant="contained">Crear nuevo elemento</Button>
        </Link>
      </div>

      <Card>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: 'transparent' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                <Typography ml={1}>Bloques</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                <Typography mr={5}>Accion</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(certifications || []).map((item) => (
              <TableRow hover key={item.id}>
                <TableCell align="left">
                  <Typography sx={{ ml: '1em' }}>{item.title_es}</Typography>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Link to={`/cms/certifications-and-awards/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/certifications-and-awards/${item.id}`}>
                      <Button variant="contained" sx={{ marginRight: 1 }}>
                        Abrir
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteId(item.id)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Container>
  );
}
