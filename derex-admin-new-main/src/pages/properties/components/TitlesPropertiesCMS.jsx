import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import * as yup from 'yup';

import { TitleInput } from 'src/pages/cms/titles/components/title-input';

export const titlesPropertySection = {
  title: 'Títulos de secciones',
  titles: [
    {
      title: 'Características',
      key: 'prototypes_features',
    },
    {
      title: 'Plantas arquitectónicas',
      key: 'prototypes_architecturalPlans',
    },
    {
      title: 'Tour virtual',
      key: 'prototypes_virtualTour',
    },
  ],
};

/**
 * @param {Object} props
 * @param {Array<import('src/data/APICalls').Metadata>} props.titles
 * @param {(newValue: Array<import('src/data/APICalls').Metadata>) => void} props.onTitleChange
 * @param {Array<import('src/data/APICalls').Metadata>} props.databaseTitles
 */
export default function TitlesPropertiesCMS ({ titles, onTitleChange, databaseTitles }) {
  const getDefaultTitleValue = (value, fallback) =>
    typeof value === 'string' && value.trim() ? value : fallback;

  /**
   * @type {Array<HomeTitle>}
   */
  const initialValues = useMemo(
    () =>
      titlesPropertySection.titles.map((title) => {
        const existentTitle = titles?.find((t) => t.name === title.key);
        return {
          name: title.key,
          value: getDefaultTitleValue(existentTitle?.value, title.title),
          value_en: getDefaultTitleValue(existentTitle?.value_en, title.title),
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
        titlesPropertySection.titles.reduce((acc, section) => {
          acc[section.key] = yup.object().shape({
            value: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
            value_en: yup.string().required('Campo requerido').max(50, 'Máximo 50 caracteres'),
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
        titlesPropertySection.titles.map(({ key }) => ({
          name: key,
          value: values[key]?.value ?? '',
          value_en: values[key]?.value_en ?? '',
          bold: values[key]?.bold ?? false,
          outline: values[key]?.outline ?? false,
          color: values[key]?.color ?? false,
        }))
      );
    }
  }, [values, onTitleChange]);

  useEffect(() => {
    setValues(
      titlesPropertySection.titles.reduce((acc, section) => {
        const existentTitle = databaseTitles?.find((t) => t.name === section.key);
        acc[section.key] = {
          value: getDefaultTitleValue(existentTitle?.value, section.title),
          value_en: getDefaultTitleValue(existentTitle?.value_en, section.title),
          bold: existentTitle?.bold ?? false,
          outline: existentTitle?.outline ?? false,
          color: existentTitle?.color ?? false,
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
      {titlesPropertySection.titles.map(({ key, title }) => (
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
        />
      ))}
    </div>
  );
}

TitlesPropertiesCMS.propTypes = {
  titles: PropTypes.array,
  onTitleChange: PropTypes.func,
  databaseTitles: PropTypes.array,
};
