import * as yup from 'yup';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Card,
  Button,
  Select,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  CardContent,
  FormControl,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_getAllProjects,
  api_createClientExperience,
  api_updateClientExperience,
  api_getClientExperienceById,
} from 'src/data/APICalls';

export function UpsertExperiencePage({ isReadOnly = false, isEdit = false, isCreate = false }) {
  const { dataAuth } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { data: developments } = useQuery('developments', {
    queryFn: () => api_getAllProjects(),
  });

  const { refetch, isLoading } = useQuery('client-experience', {
    queryFn: () => api_getClientExperienceById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues(data.data);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createClientExperience', {
    mutationFn: (values) => api_createClientExperience(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/client-experience');
      toast.success('Experiencia de cliente creada');
    },
    onError: () => {
      toast.error('Error al crear experiencia de cliente');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updateClientExperience', {
    mutationFn: (values) => api_updateClientExperience(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Experiencia de cliente actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar experiencia de cliente');
    },
  });

  const validationSchema = yup.object().shape({
    description_es: yup
      .string()
      .required('Este campo es requerido')
      .max(320, 'Máximo 320 caracteres'),
    description_en: yup
      .string()
      .required('Este campo es requerido')
      .max(320, 'Máximo 320 caracteres'),
    url: yup.string().required('Este campo es requerido').url('URL inválida'),
    project_id: yup.number().required('Este campo es requerido'),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      description_en: '',
      description_es: '',
      project_id: undefined,
      url: '',
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
      <h1>Experiencia de cliente</h1>
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
              <FormControl>
                <InputLabel id="project_id_label">Desarrollo</InputLabel>
                <Select
                  key={values.project_id}
                  id="project_id"
                  labelId="project_id_label"
                  label="Desarrollo"
                  fullWidth
                  disabled={isReadOnly}
                  value={values.project_id}
                  onChange={(e) => setFieldValue('project_id', e.target.value)}
                  error={Boolean(errors.project_id)}
                >
                  {developments?.map((development) => (
                    <MenuItem key={development.id} value={development.id}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}
                      >
                        <img
                          src={development.logo_color}
                          alt="development"
                          style={{
                            width: '30px',
                            height: '30px',
                            marginRight: '1em',
                            objectFit: 'contain',
                          }}
                        />
                        <div>{development.name}</div>
                      </div>
                    </MenuItem>
                  )) ?? []}
                </Select>
              </FormControl>
              <TextField
                label="Descripción en español"
                fullWidth
                multiline
                minRows={2}
                disabled={isReadOnly || isLoading}
                value={values.description_es}
                onChange={(e) => setFieldValue('description_es', e.target.value)}
                error={Boolean(errors.description_es)}
                helperText={errors.description_es}
              />
              <TextField
                label="Descripción en inglés"
                fullWidth
                multiline
                minRows={2}
                disabled={isReadOnly || isLoading}
                value={values.description_en}
                onChange={(e) => setFieldValue('description_en', e.target.value)}
                error={Boolean(errors.description_en)}
                helperText={errors.description_en}
              />
              <TextField
                label="URL"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.url}
                onChange={(e) => setFieldValue('url', e.target.value)}
                error={Boolean(errors.url)}
                helperText={errors.url}
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

UpsertExperiencePage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
