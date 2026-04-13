import { useFormik } from 'formik';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { Button, Card, CardContent, Container } from '@mui/material';

import { api_getTitlesBySection, api_upsertTitles } from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import { TitleInput } from '../titles/components/title-input';

const sections = [
  {
    title: 'Sección de contacto',
    titles: [
      {
        title: 'Título',
        key: 'home_contact_title',
        isDecorationsEnabled: true,
      },
      {
        title: 'Descripción',
        key: 'home_contact_description',
        minRows: 2,
        orientation: 'column',
      },
    ],
  },
  {
    title: 'Contacto',
    titles: [
      {
        title: 'Teléfonos separado por comas',
        key: 'home_contact_phone',
        isEnglishEnabled: false,
      },
      {
        title: 'Horario de atención',
        key: 'home_contact_schedule',
      },
    ],
  },
];

export default function HomeContactPage () {
  const { dataAuth } = useAppContext();

  const { data, refetch } = useQuery('titles', {
    queryFn: () => api_getTitlesBySection('home-contact'),
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
              value: yup
                .string()
                .required('Campo requerido')
                .max(title.minRows ? 500 : 500, `Máximo ${title.minRows ? 500 : 500} caracteres`),
              value_en:
                title.isEnglishEnabled === false
                  ? yup.string()
                  : yup
                    .string()
                    .required('Campo requerido')
                    .max(
                      title.minRows ? 500 : 500,
                      `Máximo ${title.minRows ? 500 : 500} caracteres`
                    ),
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
          section: 'home-contact',
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
        <h1>Contacto en inicio</h1>
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
                    isStyleEnabled={title.isDecorationsEnabled ?? false}
                    isEnglishEnabled={title.isEnglishEnabled ?? true}
                    minRows={title.minRows}
                    orientation={title.orientation}
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
