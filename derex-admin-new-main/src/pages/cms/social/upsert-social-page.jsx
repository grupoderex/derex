import * as yup from 'yup';
import { useRef } from 'react';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, Button, Container, TextField, CardContent } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_createSNS, api_updateSNS, api_getSNSById } from 'src/data/APICalls';

export function UpsertSocialPage({ isReadOnly = false, isEdit = false, isCreate = false }) {
  const { dataAuth, setMediaForID } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { refetch, isLoading } = useQuery('social', {
    queryFn: () => api_getSNSById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues(data.data);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createSocial', {
    mutationFn: (values) => api_createSNS(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/social');
      toast.success('Red social creada');
    },
    onError: () => {
      toast.error('Error al crear red social');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updateSocial', {
    mutationFn: (values) => api_updateSNS(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Red social actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar red social');
    },
  });

  const validationSchema = yup.object().shape({
    name: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    link: yup.string().url('Debe ser una URL válida').required('Este campo es requerido'),
    icon: yup.string().url('Debe ser una URL válida').required('Este campo es requerido'),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      name: '',
      link: '',
      icon: '',
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
          setFieldValue('icon', url);
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
      <h1>Red social</h1>
      <input
        type="file"
        ref={fileRef}
        style={{
          display: 'none',
        }}
      />
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
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  width: '100%',
                }}
              >
                {values.icon && (
                  <img
                    src={values.icon}
                    alt="Imagen de la sección"
                    style={{
                      width: 'auto',
                      height: '256px',
                      objectFit: 'cover',
                    }}
                  />
                )}

                {!isReadOnly && <Button onClick={uploadFile}>Subir imagen</Button>}
              </div>
              <TextField
                label="Nombre"
                fullWidth
                multiline
                rows={2}
                disabled={isReadOnly || isLoading}
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
              <TextField
                label="URL"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.link}
                onChange={(e) => setFieldValue('link', e.target.value)}
                error={Boolean(errors.link)}
                helperText={errors.link}
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

UpsertSocialPage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
