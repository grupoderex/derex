import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { useRef, useState, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';

import { Card, Button, Checkbox, CardContent, TextField } from '@mui/material';

import useAppContext from 'src/data/DataProvider';

import '../../../../sections/blog-editor/blog-editor.css';

/**
 * @typedef {object} AboutSectionProps
 * @property {() => void} removeSection
 * @property {(values: import('src/data/APICalls').AboutSection) => void} onUpdateValues
 * @property {import('src/data/APICalls').AboutSection} values
 * @property {import('formik').FormikErrors<import('src/data/APICalls').AboutSection> | undefined} errors
 * @property {() => void} moveSectionUp
 * @property {() => void} moveSectionDown
 * @property {string} maxIndex
 */

/**
 * @param {AboutSectionProps} props
 */
export function AboutSection({
  removeSection,
  onUpdateValues,
  values,
  errors,
  moveSectionUp,
  moveSectionDown,
  maxIndex,
}) {
  const [descriptionState, setDescriptionState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(htmlToDraft(values.content_es ?? '').contentBlocks)
    )
  );

  const [descriptionEnState, setDescriptionEnState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(htmlToDraft(values.content_en ?? '').contentBlocks)
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
            image_url: url,
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
    if (values.content_es !== draftToHtml(convertToRaw(descriptionState.getCurrentContent()))) {
      setDescriptionState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(htmlToDraft(values.content_es ?? '').contentBlocks)
        )
      );
    }

    if (values.content_en !== draftToHtml(convertToRaw(descriptionEnState.getCurrentContent()))) {
      setDescriptionEnState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(htmlToDraft(values.content_en ?? '').contentBlocks)
        )
      );
    }
  }, [values.content_en, values.content_es, descriptionState, descriptionEnState]);

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
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              width: '100%',
            }}
          >
            <h2
              style={{
                margin: '0px',
              }}
            >
              Sección #{Number(values.index_order) + 1} de Acerca de Javer
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '16px',
              }}
            >
              <Button onClick={moveSectionUp} disabled={values.index_order === 0}>
                Subir sección
              </Button>
              <Button onClick={moveSectionDown} disabled={values.index_order === maxIndex}>
                Bajar sección
              </Button>
              <Button onClick={removeSection} color="error">
                Eliminar sección
              </Button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
            }}
          >
            {values.image_url && (
              <img
                src={values.image_url}
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
            name="image_alt_text"
            value={values.image_alt_text}
            onChange={(e) => {
              onUpdateValues({
                ...values,
                image_alt_text: e.target.value,
              });
            }}
            label="Texto alternativo"
            variant="outlined"
          />
          <div>
            <Checkbox
              checked={values.is_image_left}
              onChange={(e) =>
                onUpdateValues({
                  ...values,
                  is_image_left: e.target.checked,
                })
              }
            />
            <span>Imagen a la izquierda</span>
          </div>

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
                  content_es: draftToHtml(convertToRaw(state.getCurrentContent())),
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
            {errors?.content_es && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.8em',
                  margin: '0px',
                }}
              >
                {errors.content_es}
              </p>
            )}
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
                  content_en: draftToHtml(convertToRaw(state.getCurrentContent())),
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

            {errors?.content_en && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.8em',
                  margin: '0px',
                }}
              >
                {errors.content_en}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

AboutSection.propTypes = {
  removeSection: PropTypes.func,
  onUpdateValues: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  moveSectionUp: PropTypes.func,
  moveSectionDown: PropTypes.func,
  maxIndex: PropTypes.string,
};
