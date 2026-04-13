import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { useRef, useState, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';

import { Card, Button, Checkbox, TextField, CardContent } from '@mui/material';

import useAppContext from 'src/data/DataProvider';

import '../../../../sections/blog-editor/blog-editor.css';
import { TitleInput } from '../../titles/components/title-input';

/**
 * @typedef {object} KnowJaverSectionProps
 * @property {() => void} removeSection
 * @property {(values: import('src/data/APICalls').ParsedKnowJaver) => void} onUpdateValues
 * @property {import('src/data/APICalls').ParsedKnowJaver} values
 * @property {import('formik').FormikErrors<import('src/data/APICalls').ParsedKnowJaver> | undefined} errors
 * @property {() => void} moveSectionUp
 * @property {() => void} moveSectionDown
 * @property {string} maxIndex
 */

/**
 * @param {KnowJaverSectionProps} props
 */
export function KnowJaverSection({ onUpdateValues, values, errors }) {
  const [descriptionState, setDescriptionState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(htmlToDraft(values.description?.value ?? '').contentBlocks)
    )
  );

  const [descriptionEnState, setDescriptionEnState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(values.description?.value_en ?? '').contentBlocks
      )
    )
  );

  const { setMediaForID } = useAppContext();

  const fileRef = useRef();

  const uploadFile = () => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo archivo');
      setMediaForID('file', fRef.files[0])
        .then((url) => {
          onUpdateValues({
            ...values,
            imageUrl: url,
          });
        })
        .then(() => {
          toast.success('Imagen subida');
        })
        .catch(() => {
          toast.error('Error al subir la imagen');
        });
    };
    fRef.click();
  };

  useEffect(() => {
    if (
      values.description?.value !== draftToHtml(convertToRaw(descriptionState.getCurrentContent()))
    ) {
      setDescriptionState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(values.description?.value ?? '').contentBlocks
          )
        )
      );
    }

    if (
      values.description?.value_en !==
      draftToHtml(convertToRaw(descriptionEnState.getCurrentContent()))
    ) {
      setDescriptionEnState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            htmlToDraft(values.description?.value_en ?? '').contentBlocks
          )
        )
      );
    }
  }, [
    values.description?.value,
    values.description?.value_en,
    descriptionState,
    descriptionEnState,
  ]);

  return (
    <Card>
      <CardContent>
        <input
          type="file"
          ref={fileRef}
          style={{
            display: 'none',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
            }}
          >
            {values.imageUrl && (
              <img
                src={values.imageUrl}
                alt="Imagen de la sección"
                style={{
                  width: 'auto',
                  height: '256px',
                  objectFit: 'cover',
                }}
              />
            )}

            <Button onClick={uploadFile}>Subir imagen</Button>
          </div>

          <TextField
            fullWidth
            name="main_image_alt_text"
            value={values.altText ?? ''}
            onChange={(e) => {
              onUpdateValues({
                ...values,
                altText: e.target.value,
              });
            }}
            label="Texto alternativo"
            variant="outlined"
          />

          <div>
            <Checkbox
              checked={values.isImageLeft === 'true'}
              onChange={(e) =>
                onUpdateValues({
                  ...values,
                  isImageLeft: e.target.checked.toString(),
                })
              }
            />
            <span>Imagen a la izquierda</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              width: '100%',
            }}
          >
            <TextField
              label="URL del boton"
              style={{
                flexGrow: 1,
              }}
              value={values.buttonUrl ?? ''}
              onChange={(e) =>
                onUpdateValues({
                  ...values,
                  buttonUrl: e.target.value,
                })
              }
              error={Boolean(errors?.buttonUrl)}
              helperText={errors?.buttonUrl}
            />
          </div>

          <TitleInput
            label="Título superior"
            titleEs={values.titleUpper?.value ?? ''}
            setTitleEs={(value) =>
              onUpdateValues({
                ...values,
                titleUpper: {
                  ...values.titleUpper,
                  value,
                },
              })
            }
            titleEn={values.titleUpper?.value_en ?? ''}
            setTitleEn={(value) =>
              onUpdateValues({
                ...values,
                titleUpper: {
                  ...values.titleUpper,
                  value_en: value,
                },
              })
            }
            style={Object.entries(values.titleUpper ?? {}).reduce((acc, [key, value]) => {
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
            }, '')}
            setStyle={(style) => {
              onUpdateValues({
                ...values,
                titleUpper: {
                  ...values.titleUpper,
                  bold: style === 'bold',
                  outline: style === 'border',
                  color: style === 'color',
                },
              });
            }}
            errors={errors?.titleUpper}
          />

          <TitleInput
            label="Título inferior"
            titleEs={values.titleLower?.value ?? ''}
            setTitleEs={(value) =>
              onUpdateValues({
                ...values,
                titleLower: {
                  ...values.titleLower,
                  value,
                },
              })
            }
            titleEn={values.titleLower?.value_en ?? ''}
            setTitleEn={(value) =>
              onUpdateValues({
                ...values,
                titleLower: {
                  ...values.titleLower,
                  value_en: value,
                },
              })
            }
            style={Object.entries(values.titleLower ?? {}).reduce((acc, [key, value]) => {
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
            }, '')}
            setStyle={(style) => {
              onUpdateValues({
                ...values,
                titleLower: {
                  ...values.titleLower,
                  bold: style === 'bold',
                  outline: style === 'border',
                  color: style === 'color',
                },
              });
            }}
            errors={errors?.titleLower}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              width: '100%',
            }}
          >
            <h3>Español</h3>

            <Editor
              toolbarClassName="toolbar"
              wrapperClassName="wrapper"
              editorClassName="editor"
              localization={{
                locale: 'es',
              }}
              editorState={descriptionState}
              onEditorStateChange={(state) => {
                setDescriptionState(state);
                onUpdateValues({
                  ...values,
                  description: {
                    ...values?.description,
                    value: draftToHtml(convertToRaw(state.getCurrentContent())),
                  },
                });
              }}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'fontSize',
                  'fontFamily',
                  'list',
                  'textAlign',
                  'colorPicker',
                  'link',
                  'image',
                  'remove',
                  'history',
                ],
              }}
            />
            {errors?.description?.value && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.8em',
                  margin: '0px',
                }}
              >
                {errors.description?.value}
              </p>
            )}

            <TextField
              label="Texto del boton (Español)"
              fullWidth
              value={values.buttonText?.value ?? ''}
              onChange={(e) =>
                onUpdateValues({
                  ...values,
                  buttonText: {
                    ...values?.buttonText,
                    value: e.target.value,
                  },
                })
              }
              error={Boolean(errors?.buttonText?.value)}
              helperText={errors?.buttonText?.value}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              width: '100%',
            }}
          >
            <h3>Inglés</h3>

            <Editor
              toolbarClassName="toolbar"
              wrapperClassName="wrapper"
              editorClassName="editor"
              localization={{
                locale: 'es',
              }}
              editorState={descriptionEnState}
              onEditorStateChange={(state) => {
                setDescriptionEnState(state);
                onUpdateValues({
                  ...values,
                  description: {
                    ...values?.description,
                    value_en: draftToHtml(convertToRaw(state.getCurrentContent())),
                  },
                });
              }}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'fontSize',
                  'fontFamily',
                  'list',
                  'textAlign',
                  'colorPicker',
                  'link',
                  'image',
                  'remove',
                  'history',
                ],
              }}
            />

            {errors?.description?.value_en && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.8em',
                  margin: '0px',
                }}
              >
                {errors.description?.value_en}
              </p>
            )}

            <TextField
              label="Texto del boton (Inglés)"
              fullWidth
              value={values.buttonText?.value_en ?? ''}
              onChange={(e) =>
                onUpdateValues({
                  ...values,
                  buttonText: {
                    ...values?.buttonText,
                    value_en: e.target.value,
                  },
                })
              }
              error={Boolean(errors?.buttonText?.value_en)}
              helperText={errors?.buttonText?.value_en}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

KnowJaverSection.propTypes = {
  onUpdateValues: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
};
