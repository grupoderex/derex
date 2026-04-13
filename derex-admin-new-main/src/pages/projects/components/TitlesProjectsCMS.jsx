import * as yup from 'yup';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useMemo, useEffect } from 'react';

import { TitleInput } from 'src/pages/cms/titles/components/title-input';

export const titlesProjectsSection = {
  title: 'Títulos de secciones',
  titles: [
    {
      title: 'Preventa',
      key: 'developments_presale',
      defaultValues: {
        value: '',
        value_en: '',
      },
      isStyleEnabled: false,
    },
    {
      title: 'Texto de preventa',
      key: 'developments_presaleText',
      defaultValues: {
        value: '',
        value_en: '',
      },
      maxLength: 1000,
      rows: 2,
      isStyleEnabled: false,
    },
    {
      title: 'Amenidades',
      key: 'developments_amenities',
      defaultValues: {
        value: 'Amenidades / Equipamiento',
        value_en: 'Amenities / Equipment',
      },
    },
    {
      title: 'Zonas de interés',
      key: 'developments_interestZones',
      defaultValues: {
        value: 'Zonas de interés / Servicios',
        value_en: 'Interest zones / Services',
      },
    },
    {
      title: 'Ubicación',
      key: 'developments_location',
      defaultValues: {
        value: 'Ubicación',
        value_en: 'Location',
      },
    },
    {
      title: 'Equipamento',
      key: 'developments_equipment',
      defaultValues: {
        value: 'Equipamento',
        value_en: 'Equipment',
      },
    },
    {
      title: 'Contacto desarrollo',
      key: 'developments_developmentContact',
      defaultValues: {
        value: 'Haz realidad el hogar de tus sueños',
        value_en: 'Make your dream home a reality',
      },
    },
    {
      title: 'Contacto desarrollo descripción',
      key: 'developments_developmentContactDescription',
      isStyleEnabled: false,
      defaultValues: {
        value:
          'Estamos para ayudarte siempre que lo necesites, con gusto resolveremos esa inquietud que tienes.',
        value_en:
          'We are here to help you whenever you need it, we will gladly resolve that concern you have.',
      },
      maxLength: 250,
      rows: 2,
    },
  ],
};

/**
 * @param {Object} props
 * @param {Array<import('src/data/APICalls').Metadata>} props.titles
 * @param {(newValue: Array<import('src/data/APICalls').Metadata>) => void} props.onTitleChange
 * @param {Array<import('src/data/APICalls').Metadata>} props.databaseTitles
 */
export default function TitlesProjectsCMS({ titles, onTitleChange, databaseTitles, isPresale }) {
  /**
   * @type {Array<HomeTitle>}
   */
  const initialValues = useMemo(
    () =>
      titlesProjectsSection.titles.map((title) => {
        const existentTitle = titles?.find((t) => t.name === title.key);

        return {
          name: title.key,
          value: existentTitle?.value || title.defaultValues.value,
          value_en: existentTitle?.value_en || title.defaultValues.value_en,
          bold: existentTitle?.bold ?? false,
          outline: existentTitle?.outline ?? false,
          color: existentTitle?.color ?? false,
        };
      }),
    [titles]
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape(
        titlesProjectsSection.titles.reduce((acc, section) => {
          acc[section.key] = yup.object().shape({
            value:
              section.key === 'developments_presale'
                ? yup.string().optional()
                : yup
                    .string()
                    .required('Campo requerido')
                    .max(section.maxLength ?? 50, 'Máximo 50 caracteres'),
            value_en:
              section.key === 'developments_presale'
                ? yup.string().optional()
                : yup
                    .string()
                    .required('Campo requerido')
                    .max(section.maxLength ?? 50, 'Máximo 50 caracteres'),
            bold: yup.boolean(),
            outline: yup.boolean(),
            color: yup.boolean(),
          });

          return acc;
        }, {})
      ),
    []
  );

  const { errors, setFieldValue, values, setValues } = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  useEffect(() => {
    if (values) {
      onTitleChange(
        titlesProjectsSection.titles.map(({ key, defaultValues }) => ({
          name: key,
          value: values[key]?.value || defaultValues.value,
          value_en: values[key]?.value_en || defaultValues.value_en,
          bold: values[key]?.bold || false,
          outline: values[key]?.outline || false,
          color: values[key]?.color || false,
        }))
      );
    }
  }, [values, onTitleChange]);

  useEffect(() => {
    setValues(
      titlesProjectsSection.titles.reduce((acc, section) => {
        const existentTitle = databaseTitles?.find((t) => t.name === section.key);
        acc[section.key] = {
          value: existentTitle?.value || section.defaultValues.value,
          value_en: existentTitle?.value_en || section.defaultValues.value_en,
          bold: existentTitle?.bold || false,
          outline: existentTitle?.outline || false,
          color: existentTitle?.color || false,
        };

        return acc;
      }, {})
    );
  }, [databaseTitles, setValues]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h3>Titulos de secciones</h3>
      {titlesProjectsSection.titles
        .filter(
          (title) =>
            isPresale ||
            (title.key !== 'developments_presale' && title.key !== 'developments_presaleText')
        )
        .map(({ key, title, isStyleEnabled, rows }) => (
          <TitleInput
            key={key}
            label={title}
            titleEs={values[key]?.value ?? ''}
            setTitleEs={(value) => {
              setFieldValue(`${key}.value`, value);
            }}
            titleEn={values[key]?.value_en ?? ''}
            setTitleEn={(value) => {
              setFieldValue(`${key}.value_en`, value);
            }}
            style={Object.entries(values[key] ?? {}).reduce((acc, [objKey, value]) => {
              if (objKey === 'bold' && value) {
                return 'bold';
              }
              if (objKey === 'outline' && value) {
                return 'border';
              }
              if (objKey === 'color' && value) {
                return 'color';
              }
              return acc;
            }, undefined)}
            setStyle={(style) => {
              setValues({
                ...values,
                [key]: {
                  ...values[key],
                  bold: style === 'bold',
                  outline: style === 'border',
                  color: style === 'color',
                },
              });
            }}
            errors={errors[title.key]}
            isStyleEnabled={isStyleEnabled ?? true}
            minRows={rows}
            orientation={rows && rows > 1 ? 'column' : 'row'}
          />
        ))}
    </div>
  );
}

TitlesProjectsCMS.propTypes = {
  titles: PropTypes.array,
  onTitleChange: PropTypes.func,
  databaseTitles: PropTypes.array,
  isPresale: PropTypes.bool,
};
