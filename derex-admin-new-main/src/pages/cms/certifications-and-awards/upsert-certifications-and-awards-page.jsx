import * as yup from 'yup';
import { useRef } from 'react';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Card,
  Button,
  Checkbox,
  Container,
  TextField,
  CardContent,
  FormControlLabel,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_createCertificationAndAward,
  api_updateCertificationAndAward,
  api_getCertificationAndAwardById,
} from 'src/data/APICalls';

import { TitleInput } from '../titles/components/title-input';

export function UpsertCertificationsAndAwardsPage({
  isReadOnly = false,
  isEdit = false,
  isCreate = false,
}) {
  const { dataAuth, setMediaForID } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { refetch, isLoading } = useQuery('certifications-and-awards', {
    queryFn: () => api_getCertificationAndAwardById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues({
        ...data.data,
        button_url: data.data.button_url ?? '',
        button_url_en: data.data.button_url_en ?? '',
        date: data.data.date ? new Date(data.data.date).toISOString().split('T')[0] : '',
      });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createCertification', {
    mutationFn: (values) => api_createCertificationAndAward(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/certifications-and-awards');
      toast.success('Certificación o premio creada');
    },
    onError: () => {
      toast.error('Error al crear certificación o premio');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updateCertification', {
    mutationFn: (values) => api_updateCertificationAndAward(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Certificación o premio actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar certificación o premio');
    },
  });

  const validationSchema = yup.object().shape({
    image_url: yup.string().required('La imagen es requerida'),
    title_es: yup
      .string()
      .required('El título en español es requerido')
      .max(50, 'Máximo 50 caracteres'),
    title_en: yup
      .string()
      .required('El título en inglés es requerido')
      .max(50, 'Máximo 50 caracteres'),
    description_es: yup
      .string()
      .required('La descripción en español es requerida')
      .max(250, 'Máximo 250 caracteres'),
    description_en: yup
      .string()
      .required('La descripción en inglés es requerida')
      .max(250, 'Máximo 250 caracteres'),
    date: yup.string().required('La fecha es requerida'),
    button_url: yup.string().url('La URL debe ser válida').optional(),
    button_url_en: yup.string().url('La URL debe ser válida').optional(),
    new_tab: yup.boolean().optional(),
    show_date: yup.boolean().optional(),
    image_alt_text: yup.string().optional(),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      image_url: '',
      image_alt_text: '',
      title_es: '',
      title_en: '',
      description_es: '',
      description_en: '',
      date: new Date().toISOString().split('T')[0],
      button_url: '',
      button_url_en: '',
      new_tab: false,
      show_date: true,
    },
    validationSchema: isReadOnly ? undefined : validationSchema,
    validateOnMount: true,
    onSubmit: (newValues) => {
      if (isCreate) {
        create(newValues);
      } else if (isEdit) {
        update(newValues);
      }
    },
  });

  const fileRef = useRef();

  const uploadFile = () => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo archivo');
      setMediaForID('file', fRef.files[0])
        .then((url) => {
          setFieldValue('image_url', url);
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

  return (
    <Container>
      <h1>Certificación o premio</h1>
      <Card>
        <CardContent>
          <input
            type="file"
            ref={fileRef}
            style={{
              display: 'none',
            }}
          />
          <div>
            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1em',
              }}
              onSubmit={handleSubmit}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  width: '100%',
                }}
              >
                {values.image_url && (
                  <img
                    src={values.image_url}
                    alt="Imagen de la sección"
                    style={{
                      width: 'auto',
                      height: '256px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                {!isReadOnly && (
                  <Button onClick={uploadFile} disabled={isReadOnly || isLoading}>
                    Subir imagen
                  </Button>
                )}
              </div>
              <TextField
                fullWidth
                name="image_alt_text"
                value={values.image_alt_text}
                onChange={(e) => {
                  setFieldValue('image_alt_text', e.target.value);
                }}
                disabled={isReadOnly || isLoading}
                label="Texto alternativo de la imagen"
                variant="outlined"
              />
              <TitleInput
                isStyleEnabled={false}
                label="Título"
                setTitleEs={(value) => setFieldValue('title_es', value)}
                setTitleEn={(value) => setFieldValue('title_en', value)}
                titleEn={values.title_en}
                titleEs={values.title_es}
                errors={{
                  value: errors.title_es,
                  value_en: errors.title_en,
                }}
                disabled={isReadOnly || isLoading}
              />
              <TitleInput
                label="Descripción"
                minRows={2}
                orientation="column"
                isStyleEnabled={false}
                setTitleEs={(value) => setFieldValue('description_es', value)}
                setTitleEn={(value) => setFieldValue('description_en', value)}
                titleEn={values.description_en}
                titleEs={values.description_es}
                errors={{
                  value: errors.description_es,
                  value_en: errors.description_en,
                }}
                disabled={isReadOnly || isLoading}
              />
              <TextField
                label="Fecha"
                type="date"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.date}
                onChange={(e) => setFieldValue('date', e.target.value)}
                error={Boolean(errors.date)}
                helperText={errors.date}
              />
              <TextField
                label="URL Español"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.button_url}
                onChange={(e) => setFieldValue('button_url', e.target.value)}
                error={Boolean(errors.button_url)}
                helperText={errors.button_url}
              />
              <TextField
                label="URL Inglés"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.button_url_en}
                onChange={(e) => setFieldValue('button_url_en', e.target.value)}
                error={Boolean(errors.button_url_en)}
                helperText={errors.button_url_en}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Abrir en nueva pestaña"
                disabled={isReadOnly || isLoading}
                checked={values.new_tab}
                onChange={(e) => setFieldValue('new_tab', e.target.checked)}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Mostrar fecha"
                disabled={isReadOnly || isLoading}
                checked={values.show_date}
                onChange={(e) => setFieldValue('show_date', e.target.checked)}
              />
              {(isEdit || isCreate) && (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loadingCreate || loadingUpdate || !isValid}
                  style={{
                    alignSelf: 'flex-end',
                    width: 'fit-content',
                  }}
                >
                  Guardar
                </Button>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}

UpsertCertificationsAndAwardsPage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
