import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from 'react-query';

import { Button, Container } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_getKnowJaver, api_upsertKnowJaver } from 'src/data/APICalls';

import { KnowJaverSection } from './components/know-javer-section';

export function KnowJaver() {
  const { dataAuth } = useAppContext();

  const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);
  const isRelativePath = (value) => value.startsWith('/');

  const { refetch } = useQuery('know-javer', {
    queryFn: api_getKnowJaver,
    onSuccess: (data) => {
      setValues(data);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate, isLoading } = useMutation('save-know-javer', {
    mutationFn: (values) => api_upsertKnowJaver(values, dataAuth.token),
    onSuccess: () => {
      toast.success('Secciones guardadas');
      refetch();
    },
    onError: (error) => {
      toast.error('Error al guardar las secciones');
    },
  });

  const validationSchema = yup.object().shape({
    imageUrl: yup.string().required('Campo requerido'),
    isImageLeft: yup.string().required('Campo requerido'),
    buttonUrl: yup
      .string()
      .required('Campo requerido')
      .test(
        'is-url-or-relative-path',
        'URL inválida',
        (value) => !!value && (isAbsoluteUrl(value) || isRelativePath(value))
      ),
    isUrlExternal: yup.string().required('Campo requerido'),
    description: yup.object().shape({
      value: yup.string().required('Campo requerido').max(500, 'Máximo 500 caracteres'),
      value_en: yup.string().required('Campo requerido').max(500, 'Máximo 500 caracteres'),
    }),
    buttonText: yup.object().shape({
      value: yup.string().required('Campo requerido').max(30, 'Máximo 30 caracteres'),
      value_en: yup.string().required('Campo requerido').max(30, 'Máximo 30 caracteres'),
    }),
    titleLower: yup.object().shape({
      value: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
      value_en: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
      bold: yup.boolean().required('Campo requerido'),
      outline: yup.boolean().required('Campo requerido'),
      color: yup.boolean().required('Campo requerido'),
    }),
    titleUpper: yup.object().shape({
      value: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
      value_en: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
      bold: yup.boolean().required('Campo requerido'),
      outline: yup.boolean().required('Campo requerido'),
      color: yup.boolean().required('Campo requerido'),
    }),
  });

  /**
   * @type {ReturnType<typeof useFormik<import('src/data/APICalls').ParsedKnowJaver[]>>}
   */
  const { values, errors, submitForm, isValid, setValues } = useFormik({
    initialValues: {
      imageUrl: '',
      isImageLeft: 'false',
      buttonUrl: '',
      isUrlExternal: 'false',
      titleUpper: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
      titleLower: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
      description: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
      buttonText: {
        value: '',
        value_en: '',
        bold: false,
        outline: false,
        color: false,
      },
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (newValues) => mutate(newValues),
  });

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
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
          <h1>Conoce Javer</h1>
          <Button variant="contained" onClick={submitForm} disabled={isLoading || !isValid}>
            Guardar
          </Button>
        </div>

        {values.length === 0 && <p>No hay secciones</p>}

        <KnowJaverSection
          key={values.id}
          values={values}
          errors={errors}
          onUpdateValues={(newValue) => {
            setValues(newValue);
          }}
        />
      </div>
    </Container>
  );
}
