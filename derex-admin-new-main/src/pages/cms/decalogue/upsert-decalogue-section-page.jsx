import * as yup from 'yup';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, Button, Container, TextField, CardContent } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_createDecalogueSection,
  api_updateDecalogueSection,
  api_getDecalogueSectionById,
} from 'src/data/APICalls';

export function UpsertDecalogueSectionPage({
  isReadOnly = false,
  isEdit = false,
  isCreate = false,
}) {
  const { dataAuth } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { refetch, isLoading } = useQuery('decalogue-section', {
    queryFn: () => api_getDecalogueSectionById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues({
        name_es: data.data.name_es ?? '',
        name_en: data.data.name_en ?? '',
      });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createdecalogue-section', {
    mutationFn: (values) =>
      api_createDecalogueSection(
        {
          ...values,
          type: 'decalogue',
        },
        dataAuth.token
      ),
    onSuccess: () => {
      router('/cms/decalogue');
      toast.success('Seccion creada');
    },
    onError: () => {
      toast.error('Error al crear seccion');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updatedecalogue-section', {
    mutationFn: (values) =>
      api_updateDecalogueSection(
        id,
        {
          ...values,
          type: 'decalogue',
        },
        dataAuth.token
      ),
    onSuccess: () => {
      refetch();
      toast.success('Seccion actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar seccion');
    },
  });

  const validationSchema = yup.object().shape({
    name_es: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    name_en: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      name_en: '',
      name_es: '',
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
      <h1>Sección del decálogo</h1>
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
                label="Nombre en español"
                fullWidth
                multiline
                disabled={isReadOnly || isLoading}
                value={values.name_es}
                onChange={(e) => setFieldValue('name_es', e.target.value)}
                error={Boolean(errors.name_es)}
                helperText={errors.name_es}
              />
              <TextField
                label="Nombre en inglés"
                fullWidth
                multiline
                disabled={isReadOnly || isLoading}
                value={values.name_en}
                onChange={(e) => setFieldValue('name_en', e.target.value)}
                error={Boolean(errors.name_en)}
                helperText={errors.name_en}
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

UpsertDecalogueSectionPage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
