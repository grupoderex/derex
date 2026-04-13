import * as yup from 'yup';
import { useFormik } from 'formik';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useQuery, useMutation } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';

import { Card, Button, Select, MenuItem, Container, TextField, CardContent } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_createDecalogue,
  api_updateDecalogue,
  api_getDecalogueById,
  api_getAllDecalogueSections,
} from 'src/data/APICalls';

import '../../../sections/blog-editor/blog-editor.css';

export function UpsertPrivacyPage({ isReadOnly = false, isEdit = false, isCreate = false }) {
  const { dataAuth } = useAppContext();

  const { id } = useParams();
  const router = useNavigate();

  const { data: sections } = useQuery('noticeSections', {
    queryFn: () => api_getAllDecalogueSections('notice', dataAuth.token),
  });

  const { refetch, isLoading } = useQuery('notice', {
    queryFn: () => api_getDecalogueById(id, dataAuth.token),
    enabled: !isCreate,
    onSuccess: (data) => {
      setValues({
        ...data.data,
        id: undefined,
        file: undefined,
        content: data.data.content ?? undefined,
        content_date: data.data.content_date
          ? new Date(data.data.content_date).toISOString().split('T')[0]
          : undefined,
      });
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: create, isLoading: loadingCreate } = useMutation('createnotice', {
    mutationFn: (values) => api_createDecalogue(values, dataAuth.token),
    onSuccess: () => {
      router('/cms/privacy');
      toast.success('Aviso de privacidad creado');
    },
    onError: () => {
      toast.error('Error al crear aviso de privacidad');
    },
  });

  const { mutate: update, isLoading: loadingUpdate } = useMutation('updatenotice', {
    mutationFn: (values) => api_updateDecalogue(id, values, dataAuth.token),
    onSuccess: () => {
      refetch();
      toast.success('Aviso de privacidad actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar aviso de privacidad');
    },
  });

  const validationSchema = yup.object().shape({
    title_es: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    title_en: yup.string().required('Este campo es requerido').max(150, 'Máximo 150 caracteres'),
    content: yup.string().required('Este campo es requerido'),
    section_id: yup.number().required('Este campo es requerido'),
    content_date: yup.date().required('Este campo es requerido'),
  });

  const { values, errors, setFieldValue, isValid, setValues, handleSubmit } = useFormik({
    initialValues: {
      title_es: '',
      title_en: '',
      content: '',
      section_id: undefined,
      content_date: new Date().toISOString().split('T')[0],
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

  const [descriptionState, setDescriptionState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(htmlToDraft(values.content ?? '').contentBlocks)
    )
  );

  useEffect(() => {
    if (values.content !== draftToHtml(convertToRaw(descriptionState.getCurrentContent()))) {
      setDescriptionState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(htmlToDraft(values.content ?? '').contentBlocks)
        )
      );
    }
  }, [values.content, descriptionState]);

  return (
    <Container>
      <h1>Aviso de privacidad</h1>

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
              <TextField
                label="Fecha de edición"
                fullWidth
                type="date"
                disabled={isReadOnly || isLoading}
                value={values.content_date}
                onChange={(e) => setFieldValue('content_date', e.target.value)}
                error={Boolean(errors.content_date)}
                helperText={errors.content_date}
              />
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

                  setFieldValue('content', draftToHtml(convertToRaw(state.getCurrentContent())));
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
                    'remove',
                    'history',
                  ],
                }}
              />
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

UpsertPrivacyPage.propTypes = {
  isReadOnly: PropTypes.bool,
  isEdit: PropTypes.bool,
  isCreate: PropTypes.bool,
};
