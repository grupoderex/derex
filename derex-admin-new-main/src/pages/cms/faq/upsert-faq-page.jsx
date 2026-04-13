import * as yup from 'yup';
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
import { api_createFAQ, api_updateFAQ, api_getFAQById } from 'src/data/APICalls';

export function UpsertFAQPage({ isReadOnly = false, isEdit = false, isCreate = false }) {
  const { dataAuth } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { refetch, isLoading } = useQuery('faq', {
    queryFn: () => api_getFAQById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues({
        ...data,
        url_link: data.url_link ?? '',
      });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createFAQ', {
    mutationFn: (values) => api_createFAQ(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/faq');
      toast.success('Pregunta creada');
    },
    onError: () => {
      toast.error('Error al crear pregunta');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updateFAQ', {
    mutationFn: (values) => api_updateFAQ(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Pregunta actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar pregunta');
    },
  });

  const validationSchema = yup.object().shape({
    question_es: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    question_en: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    answer_es: yup.string().required('Este campo es requerido').max(500, 'Máximo 500 caracteres'),
    answer_en: yup.string().required('Este campo es requerido').max(500, 'Máximo 500 caracteres'),
    url_link: yup.string().url('Debe ser una URL válida'),
    open_in_new_tab: yup.boolean(),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      question_en: '',
      question_es: '',
      answer_en: '',
      answer_es: '',
      url_link: '',
      open_in_new_tab: false,
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

  return (
    <Container>
      <h1>Pregunta frecuente</h1>
      <Card>
        <CardContent>
          <div>
            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1em',
              }}
              onSubmit={handleSubmit}
            >
              <TextField
                label="Pregunta en español"
                fullWidth
                multiline
                rows={2}
                disabled={isReadOnly || isLoading}
                value={values.question_es}
                onChange={(e) => setFieldValue('question_es', e.target.value)}
                error={Boolean(errors.question_es)}
                helperText={errors.question_es}
              />
              <TextField
                label="Pregunta en inglés"
                fullWidth
                multiline
                rows={2}
                disabled={isReadOnly || isLoading}
                value={values.question_en}
                onChange={(e) => setFieldValue('question_en', e.target.value)}
                error={Boolean(errors.question_en)}
                helperText={errors.question_en}
              />
              <TextField
                label="Respuesta en español"
                fullWidth
                multiline
                rows={2}
                disabled={isReadOnly || isLoading}
                value={values.answer_es}
                onChange={(e) => setFieldValue('answer_es', e.target.value)}
                error={Boolean(errors.answer_es)}
                helperText={errors.answer_es}
              />
              <TextField
                label="Respuesta en inglés"
                fullWidth
                multiline
                rows={2}
                disabled={isReadOnly || isLoading}
                value={values.answer_en}
                onChange={(e) => setFieldValue('answer_en', e.target.value)}
                error={Boolean(errors.answer_en)}
                helperText={errors.answer_en}
              />
              <TextField
                label="URL"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.url_link}
                onChange={(e) => setFieldValue('url_link', e.target.value)}
                error={Boolean(errors.url_link)}
                helperText={errors.url_link}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Abrir en nueva pestaña"
                disabled={isReadOnly || isLoading}
                checked={values.open_in_new_tab}
                onChange={(e) => setFieldValue('open_in_new_tab', e.target.checked)}
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

UpsertFAQPage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
