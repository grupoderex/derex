import { useFormik } from 'formik';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { Button, Card, CardContent, Container } from '@mui/material';

import { api_getAllTitles, api_upsertTitles } from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import { TitleInput } from './components/title-input';

const sections = [
  {
    title: 'Principal',
    titles: [
      {
        title: 'Buscador',
        key: 'home_search',
      },
      {
        title: 'Desarrollos destacados superior',
        key: 'home_featuredDevelopmentsUp',
      },
      {
        title: 'Desarrollos destacados inferior',
        key: 'home_featuredDevelopmentsDown',
      },
      {
        title: 'Blog Derex',
        key: 'home_blogJaver',
      },
      {
        title: 'Experiencia de clientes',
        key: 'home_customerExperience',
      },
      {
        title: 'Próximos desarrollos',
        key: 'home_nextDevelopments',
      },
    ],
  },
  {
    title: 'Blog',
    titles: [
      {
        title: 'Título principal',
        key: 'blog_mainTitle',
      },
      {
        title: 'Últimas novedades',
        key: 'blog_latestNews',
      },
    ],
  },
  {
    title: 'Lotes comerciales',
    titles: [
      {
        title: 'Título principal',
        key: 'commercialLots_mainTitle',
      },
      {
        title: 'Subtítulo',
        key: 'commercialLots_subtitle',
      },
    ],
  },
  {
    title: 'Reservas territoriales',
    titles: [
      {
        title: 'Título principal',
        key: 'territorialReservations_mainTitle',
      },
    ],
  },
  {
    title: 'Otros',
    titles: [
      {
        title: 'Aviso de privacidad',
        key: 'others_privacyNotice',
      },
      {
        title: 'Decálogos',
        key: 'others_decalogues',
      },
      {
        title: 'Contratos de adhesión',
        key: 'others_adhesionContracts',
      },
      {
        title: 'Código de ética',
        key: 'others_ethicsCode',
      },
      {
        title: 'Contacto global',
        key: 'others_globalContact',
      },
    ],
  },
];

export default function TitlesPage () {
  const { dataAuth } = useAppContext();

  const { data, refetch } = useQuery('titles', {
    queryFn: api_getAllTitles,
    refetchOnWindowFocus: false,
    onSuccess: (newData) => {
      setValues(
        sections.reduce((acc, section) => {
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

  const { mutate, isLoading } = useMutation('upsertTitles', {
    mutationFn: (values) => api_upsertTitles(values, dataAuth.token),
    onSuccess: () => {
      toast.success('Titulos actualizados');
      refetch();
    },
    onError: () => {
      toast.error('Error al actualizar titulos');
    },
  });

  /**
   * @type {Array<HomeTitle>}
   */
  const initialValues = useMemo(
    () =>
      sections.reduce((acc, section) => {
        section.titles.forEach((title) => {
          const existentTitle = data?.data.find((t) => t.name === title.key);
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
    [data]
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape(
        sections.reduce((acc, section) => {
          section.titles.forEach((title) => {
            acc[title.key] = yup.object().shape({
              value: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
              value_en: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
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

  const { submitForm, errors, setFieldValue, values, isValid, setValues } = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: (newValues) =>
      mutate(
        Object.entries(newValues).map(([key, value]) => ({
          ...value,
          section: 'home',
          name: key,
        }))
      ),
  });

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1>Títulos</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={submitForm}
          disabled={isLoading || !isValid}
        >
          Guardar
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {sections.map((section, index) => (
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
                    titleEs={values[title.key]?.value}
                    setTitleEs={(value) => setFieldValue(`${title.key}.value`, value)}
                    titleEn={values[title.key]?.value_en}
                    setTitleEn={(value) => setFieldValue(`${title.key}.value_en`, value)}
                    style={Object.entries(values[title.key] ?? {}).reduce((acc, [key, value]) => {
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
                    errors={errors[title.key]}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
}
