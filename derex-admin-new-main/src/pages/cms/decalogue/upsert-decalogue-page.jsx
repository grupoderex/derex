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
  api_createDecalogue,
  api_updateDecalogue,
  api_getDecalogueById,
  api_getAllDecalogueSections,
} from 'src/data/APICalls';

export function UpsertDecaloguePage({ isReadOnly = false, isEdit = false, isCreate = false }) {
  const { dataAuth, setFileForID } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { data: sections } = useQuery('decalogueSections', {
    queryFn: () => api_getAllDecalogueSections('decalogue', dataAuth.token),
  });

  const { refetch, isLoading } = useQuery('decalogue', {
    queryFn: () => api_getDecalogueById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues({
        ...data.data,
        id: undefined,
        content: undefined,
        content_date: undefined,
      });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createdecalogue', {
    mutationFn: (values) => api_createDecalogue(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/decalogue');
      toast.success('Decalogo creada');
    },
    onError: () => {
      toast.error('Error al crear decalogo');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updatedecalogue', {
    mutationFn: (values) => api_updateDecalogue(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Decalogo actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar decalogo');
    },
  });

  const validationSchema = yup.object().shape({
    title_es: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    title_en: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    file: yup.string().required('Este campo es requerido').url('URL inválida'),
    section_id: yup.number().required('Este campo es requerido'),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      title_es: '',
      title_en: '',
      file: '',
      section_id: undefined,
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
      setFileForID('file', fRef.files[0])
        .then((url) => {
          setFieldValue('file', url);
        })
        .then(() => {
          toast.success('Archivo subido');
        })
        .catch(() => {
          toast.error('Error al subir el archivo');
        });
    };
    fRef.click();
  };

  return (
    <Container>
      <h1>Decálogo</h1>
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
              <FormControl>
                <InputLabel id="project_id_label">Desarrollo</InputLabel>
                <Select
                  key={values.section_id}
                  id="project_id"
                  label="Desarrollo"
                  fullWidth
                  disabled={isReadOnly}
                  value={values.section_id}
                  onChange={(e) => setFieldValue('section_id', e.target.value)}
                  error={Boolean(errors.section_id)}
                >
                  {sections?.data?.map((section) => (
                    <MenuItem key={section.key} value={section.id}>
                      {section.name_es}
                    </MenuItem>
                  )) ?? []}
                </Select>
              </FormControl>
              <TextField
                label="Titulo en español"
                fullWidth
                multiline
                disabled={isReadOnly || isLoading}
                value={values.title_es}
                onChange={(e) => setFieldValue('title_es', e.target.value)}
                error={Boolean(errors.title_es)}
                helperText={errors.title_es}
              />
              <TextField
                label="Titulo en inglés"
                fullWidth
                multiline
                disabled={isReadOnly || isLoading}
                value={values.title_en}
                onChange={(e) => setFieldValue('title_en', e.target.value)}
                error={Boolean(errors.title_en)}
                helperText={errors.title_en}
              />
              <div
                style={{
                  display: 'flex',
                  gap: '1em',
                }}
              >
                {!isReadOnly && (
                  <Button
                    onClick={uploadFile}
                    disabled={isReadOnly || isLoading}
                    variant="outlined"
                  >
                    {values.file ? 'Cambiar archivo' : 'Subir archivo'}
                  </Button>
                )}
                {!isCreate && values.file && (
                  <Button href={values.file} target="_blank" rel="noreferrer">
                    Ver archivo
                  </Button>
                )}
              </div>
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

UpsertDecaloguePage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
