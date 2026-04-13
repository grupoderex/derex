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
  Checkbox,
  MenuItem,
  Container,
  TextField,
  CardContent,
  FormControlLabel,
  InputLabel,
  FormControl,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_createFooterElement,
  api_updateFooterElement,
  api_getFooterElementById,
} from 'src/data/APICalls';

import { sections } from './footer-page';
import { TitleInput } from '../titles/components/title-input';

export function UpsertFooterPage({ isReadOnly = false, isEdit = false, isCreate = false }) {
  const { dataAuth } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { refetch, isLoading } = useQuery('footer', {
    queryFn: () => api_getFooterElementById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues(data.data);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createFooter', {
    mutationFn: (values) => api_createFooterElement(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/footer');
      toast.success('Pie de pagina creado');
    },
    onError: () => {
      toast.error('Error al crear pie de pagina');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updateFooter', {
    mutationFn: (values) => api_updateFooterElement(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Pie de pagina actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar pie de pagina');
    },
  });

  const validationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    name_eng: yup.string().required('El nombre en inglés es requerido'),
    path: yup.string().required('La ruta es requerida').url('La ruta debe ser una URL válida'),
    section: yup.string().required('La sección es requerida'),
    is_url: yup.boolean().required('El tipo de enlace es requerido'),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      name: '',
      name_eng: '',
      path: '',
      section: '',
      is_url: false,
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
      <h1>Pie de pagina</h1>
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
                  key={values.section}
                  labelId="project_id_label"
                  id="project_id"
                  label="Desarrollo"
                  fullWidth
                  disabled={isReadOnly}
                  value={values.section}
                  onChange={(e) => setFieldValue('section', e.target.value)}
                  error={Boolean(errors.section)}
                >
                  {sections?.map((section) => (
                    <MenuItem key={section.key} value={section.key}>
                      {section.title}
                    </MenuItem>
                  )) ?? []}
                </Select>
              </FormControl>
              <TitleInput
                label="Nombre"
                disabled={isReadOnly || isLoading}
                value={values.name}
                errors={{
                  value: errors.name,
                  value_en: errors.name_eng,
                }}
                isStyleEnabled={false}
                setTitleEn={(e) => setFieldValue('name_eng', e)}
                setTitleEs={(e) => setFieldValue('name', e)}
                titleEn={values.name_eng}
                titleEs={values.name}
              />
              <TextField
                label="URL"
                fullWidth
                disabled={isReadOnly || isLoading}
                value={values.path}
                onChange={(e) => setFieldValue('path', e.target.value)}
                error={Boolean(errors.path)}
                helperText={errors.path}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Abrir en nueva pestaña"
                disabled={isReadOnly || isLoading}
                checked={values.is_url}
                onChange={(e) => setFieldValue('is_url', e.target.checked)}
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

UpsertFooterPage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
