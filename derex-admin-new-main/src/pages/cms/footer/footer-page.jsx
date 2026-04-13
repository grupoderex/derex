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
  api_upsertTitles,
  api_getTitlesBySection,
  api_deleteFooterElement,
  api_getAllFooterElements,
} from 'src/data/APICalls';

import { TitleInput } from '../titles/components/title-input';

const sectionTitles = [
  {
    title: 'Títulos de secciones',
    titles: [
      {
        title: 'Empresa',
        key: 'footer_company',
      },
      {
        title: 'Inversionistas',
        key: 'footer_investors',
      },
      {
        title: 'Información',
        key: 'footer_info',
      },
      {
        title: 'Clientes',
        key: 'footer_client',
      },
      {
        title: 'Copyrigth',
        key: 'footer_copyrigth',
        maxLength: 150,
      },
    ],
  },
  {
    title: 'Contacto',
    titles: [
      {
        title: 'Dirección',
        key: 'footer_address',
        isEnglishEnabled: false,
        maxLength: 150,
      },
      {
        title: 'Teléfono',
        key: 'footer_phone',
        isEnglishEnabled: false,
      },
      {
        title: 'Correo',
        key: 'footer_email',
        isEnglishEnabled: false,
      },
    ],
  },
];

export const sections = [
  {
    title: 'Empresa',
    key: 'company',
  },
  {
    title: 'Inversonistas',
    key: 'investors',
  },
  {
    title: 'Información',
    key: 'info',
  },
  {
    title: 'Clientes',
    key: 'client',
  },
];

export function FooterPage() {
  const { dataAuth } = useAppContext();

  const { data: dataTitles, refetch: refetchTitles } = useQuery('titles', {
    queryFn: () => api_getTitlesBySection('footer'),
    refetchOnWindowFocus: false,
    onSuccess: (newData) => {
      setValuesTitles(
        sectionTitles.reduce((acc, section) => {
          section.titles.forEach((title) => {
            const existentTitle = newData?.data.find((t) => t.name === title.key);
            acc[title.key] = {
              value: existentTitle?.value ?? '',
              value_en: existentTitle?.value_en ?? '',
              bold: existentTitle?.bold ?? false,
              outline: existentTitle?.outline ?? false,
              color: existentTitle?.color ?? false,
            };
          });

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
      sectionTitles.reduce((acc, section) => {
        section.titles.forEach((title) => {
          const existentTitle = dataTitles?.data.find((t) => t.name === title.key);
          acc[title.key] = {
            value: existentTitle?.value ?? '',
            value_en: existentTitle?.value_en ?? '',
            bold: existentTitle?.bold ?? false,
            outline: existentTitle?.outline ?? false,
            color: existentTitle?.color ?? false,
          };
        });

        return acc;
      }, {}),
    [dataTitles]
  );

  const validationSchemaTitles = useMemo(
    () =>
      yup.object().shape(
        sectionTitles.reduce((acc, section) => {
          section.titles.forEach((title) => {
            acc[title.key] = yup.object().shape({
              value: yup
                .string()
                .required('Campo requerido')
                .max(title?.maxLength ?? 50, `Máximo ${title?.maxLength ?? 50} caracteres`),
              value_en:
                title.isEnglishEnabled === false
                  ? yup.string()
                  : yup
                      .string()
                      .required('Campo requerido')
                      .max(title?.maxLength ?? 50, `Máximo ${title?.maxLength ?? 50} caracteres`),
              bold: yup.boolean(),
              outline: yup.boolean(),
              color: yup.boolean(),
            });
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
          section: 'footer',
          name: key,
        }))
      ),
  });

  const { data, refetch } = useQuery('footers', {
    queryFn: () => api_getAllFooterElements(dataAuth.token),
  });

  const { mutate: deleteFooter, isLoading } = useMutation('deletefooter', {
    mutationFn: (id) => api_deleteFooterElement(id, dataAuth.token),
    onSuccess: () => {
      refetch();
    },
  });

  const [deleteId, setDeleteId] = useState(null);

  const footers = data?.data ?? [];

  return (
    <Container>
      <Dialog open={deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Estás seguro de eliminar este elemento?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteFooter(deleteId);
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
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1em',
          }}
        >
          <h1>Títulos y datos</h1>
          <Button
            variant="contained"
            onClick={submitTitles}
            disabled={isLoadingTitles || !isValidTitles}
          >
            Guardar
          </Button>
        </div>
        {sectionTitles.map((section, index) => (
          <Card key={index}>
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
                    isStyleEnabled={false}
                    errors={errorsTitles[title.key]}
                    isEnglishEnabled={title.isEnglishEnabled ?? true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1em',
          marginTop: '3em',
        }}
      >
        <h1>Pie de pagina</h1>
        <Link to="/cms/footer/create">
          <Button variant="contained">Nuevo elemento</Button>
        </Link>
      </div>

      {sections.map((section) => (
        <div
          key={section.key}
          style={{
            marginBottom: '3em',
          }}
        >
          <Typography variant="h4" mb={1}>
            {section.title}
          </Typography>
          <Card>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: 'transparent' }}>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                    <Typography ml={1}>Nombre</Typography>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                    <Typography mr={5}>Accion</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {footers
                  ?.filter((item) => item.section === section.key)
                  .map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell align="left">
                        <Typography sx={{ ml: '1em' }}>{item.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}
                        >
                          <Link to={`/cms/footer/${item.id}/edit`}>
                            <Button sx={{ marginRight: 1 }}>Editar</Button>
                          </Link>
                          <Link to={`/cms/footer/${item.id}`}>
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
        </div>
      ))}
    </Container>
  );
}
