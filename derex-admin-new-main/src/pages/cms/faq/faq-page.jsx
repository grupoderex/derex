import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
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
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_getFAQs,
  api_deleteFAQ,
  api_upsertTitles,
  api_getTitlesBySection,
} from 'src/data/APICalls';

import { TitleInput } from '../titles/components/title-input';

const section = {
  title: 'Preguntas frecuentes',
  titles: [
    {
      title: 'Título principal',
      key: 'home_faqTitle',
    },
    {
      title: 'Descripción principal',
      key: 'home_faqDescription',
      rows: 3,
      direction: 'column',
      isStyleEnabled: false,
      max: 500,
    },
  ],
};

export function FAQPage() {
  const { dataAuth } = useAppContext();

  const { data: dataTitles, refetch: refetchTitles } = useQuery('titles', {
    queryFn: () => api_getTitlesBySection('faq'),
    refetchOnWindowFocus: false,
    onSuccess: (newData) => {
      setValuesTitles(
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

  const { mutate: setTitles, isLoading: isLoadingTitles } = useMutation('upsertTitles', {
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
  const initialValuesTitles = useMemo(
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

  const validationSchemaTitles = useMemo(
    () =>
      yup.object().shape(
        section.titles.reduce((acc, title) => {
          acc[title.key] = yup.object().shape({
            value: yup
              .string()
              .required('Campo requerido')
              .max(title.max ?? 50, `Máximo ${title.max ?? 50} caracteres`),
            value_en: yup
              .string()
              .required('Campo requerido')
              .max(title.max ?? 50, `Máximo ${title.max ?? 50} caracteres`),
            bold: yup.boolean(),
            outline: yup.boolean(),
            color: yup.boolean(),
          });

          return acc;
        }, {})
      ),
    []
  );

  const {
    submitForm: submitTitles,
    errors: errorsTitles,
    setFieldValue,
    values: valuesTitles,
    isValid: isValidTitles,
    setValues: setValuesTitles,
  } = useFormik({
    initialValues: initialValuesTitles,
    validationSchema: validationSchemaTitles,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (newValues) =>
      setTitles(
        Object.entries(newValues).map(([key, value]) => ({
          ...value,
          section: 'faq',
          name: key,
        }))
      ),
  });

  const { data, refetch } = useQuery('faqs', {
    queryFn: () => api_getFAQs(dataAuth.token),
  });

  const { mutate: deleteFAQ, isLoading } = useMutation('deleteFAQ', {
    mutationFn: (id) => api_deleteFAQ(id, dataAuth.token),
    onSuccess: () => {
      refetch();
    },
  });

  const [deleteId, setDeleteId] = useState(null);

  const faqs = data?.data;

  return (
    <Container>
      <Dialog open={deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Estás seguro de eliminar esta pregunta?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteFAQ(deleteId);
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
          onClick={submitTitles}
          disabled={isLoadingTitles || !isValidTitles}
        >
          Guardar
        </Button>
      </div>
      <Card>
        <CardContent>
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
            {section.titles.map((title) => (
              <TitleInput
                key={title.key}
                label={title.title}
                titleEs={valuesTitles[title.key]?.value}
                setTitleEs={(value) => setFieldValue(`${title.key}.value`, value)}
                titleEn={valuesTitles[title.key]?.value_en}
                setTitleEn={(value) => setFieldValue(`${title.key}.value_en`, value)}
                style={Object.entries(valuesTitles[title.key] ?? {}).reduce((acc, [key, value]) => {
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
                errors={errorsTitles[title.key]}
                minRows={title.rows}
                orientation={title.direction}
                isStyleEnabled={title.isStyleEnabled}
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
        }}
      >
        <h1>Preguntas frecuentes</h1>
        <Link to="/cms/faq/create">
          <Button variant="contained">Nueva pregunta</Button>
        </Link>
      </div>

      <Card>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: 'transparent' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                <Typography ml={1}>Pregunta</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                <Typography mr={5}>Accion</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(faqs || []).map((item) => (
              <TableRow hover key={item.id}>
                <TableCell align="left">
                  <Typography sx={{ ml: '1em' }}>{item.question_es}</Typography>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Link to={`/cms/faq/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/faq/${item.id}`}>
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
