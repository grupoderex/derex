import * as yup from 'yup';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, Button, Container, TextField, CardContent } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_createCreditType,
  api_updateCreditType,
  api_getCreditTypeById,
} from 'src/data/APICalls';

export function UpsertCreditsPage({ isReadOnly = false, isEdit = false, isCreate = false }) {
  const { dataAuth } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { refetch, isLoading } = useQuery('credit', {
    queryFn: () => api_getCreditTypeById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues(data.data);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createCredit', {
    mutationFn: (values) => api_createCreditType(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/credits');
      toast.success('Crédito creado');
    },
    onError: () => {
      toast.error('Error al crear crédito');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updateCredit', {
    mutationFn: (values) => api_updateCreditType(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Crédito actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar crédito');
    },
  });

  const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      name: '',
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
      <h1>Tipo de crédito</h1>
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
                label="Nombre"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
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

UpsertCreditsPage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
