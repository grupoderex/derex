import * as cheerio from 'cheerio';
import { sha256 } from 'js-sha256';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { useRef, useState } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';

import {
  Box,
  Stack,
  Input,
  Button,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import { blogPost } from 'src/utils/blogPostModel';

import useAppContext from 'src/data/DataProvider';

import '../blog-editor.css';

const blogSections = ['Noticias', 'Hogar Javer', 'Responsabilidad', 'Finanzas'];

export default function BlogEditor({ startingPost, closeBlogEditor }) {
  const { setMediaForID, createBlog, updateBlog } = useAppContext();

  const fileRef = useRef();

  const uploadFile = (onChange) => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      setMediaForID('file', fRef.files[0]).then(onChange);
    };
    fRef.click();
  };

  const [editorState, setEditorState] = useState(
    startingPost
      ? // EditorState.createWithContent()
      EditorState.createWithContent(
        ContentState.createFromBlockArray(htmlToDraft(startingPost.post_content).contentBlocks)
        // ContentState.createFromText(startingPost.post_content)
      )
      : EditorState.createEmpty()
  );
  const [title, setTitle] = useState(startingPost?.post_title || '');
  const [author, setAuthor] = useState(startingPost?.post_author || '');
  const [section, setSection] = useState(startingPost?.post_section || 'p');
  const [mainImage, setMainImage] = useState(startingPost?.post_image1);
  const [interiorImage, setInteriorImage] = useState(startingPost?.post_image2);

  // A function to generate a URL-friendly permalink from the title
  function generatePermalink(_title) {
    return _title
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // A function to generate a simple hash for the blog post
  function generateHash(input) {
    const hash = sha256(input);
    return hash.substring(0, 32);
  }

  const saveBlog = async (status) => {
    const draft = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const perm = generatePermalink(title);

    const $ = cheerio.load(draft);

    $('[style]').removeAttr('style');

    $('span').each((_, element) => {
      $(element).replaceWith($(element).html());
    });

    const cleanContent = $.html();

    const post = {
      ...blogPost,
      post_author: author,
      post_title: title,
      post_name: title,
      post_status: status,
      post_image1: mainImage,
      post_image2: interiorImage,
      description: '',
      post_content_filtered: cleanContent,
      post_section: section,
      post_content: draft,
      permalink: perm,
      // Adding date to make hash unique per post
      permalink_hash: generateHash(perm + new Date().toISOString()),
    };
    if (!startingPost) {
      createBlog(post)
        .then(() => {
          toast.success("Blog creado");
          closeBlogEditor();
        })
        .catch(() => toast.error('Error al crear el Blog'))
    }
    else {
      updateBlog(startingPost.id, post)
        .then(() => {
          toast.success("Blog actualizado");
          closeBlogEditor();
        })
        .catch(() => toast.error('Error al actualizar el Blog'))
    }
  };

  return (
    <Box
      m={5}
      display="flex"
      maxWidth="100%"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <input className="hidden-file" type="file" ref={fileRef} />
      <Box
        display="flex"
        width="100%"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-around"
      >
        <Stack direction="column" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography fontWeight="bold">Imagen principal</Typography>

          <Button
            onClick={() => {
              uploadFile((data) => {
                setMainImage(data);
              });
            }}
          >
            Cargar
          </Button>
          {mainImage && <img alt="mainImage" height="300" src={mainImage} />}
        </Stack>
        <Stack direction="column" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography fontWeight="bold">Imagen interior</Typography>

          <Button
            onClick={() => {
              uploadFile((data) => {
                setInteriorImage(data);
              });
            }}
          >
            Cargar
          </Button>
          {interiorImage && <img alt="interiorImage" height="300" src={interiorImage} />}
        </Stack>
      </Box>

      <Box>
        <FormControl fullWidth>
          <InputLabel id="title">Título</InputLabel>
          <Input
            id="title"
            className="base-input title-input" // Apply the base style and the title-specific style
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="author">Autor</InputLabel>
          <Input
            id="author"
            className="base-input author-input" // Apply the base style and the author-specific style
            type="text"
            placeholder="Autor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="section">Sección</InputLabel>
          <Select
            className="base-input"
            fullWidth
            labelId="demo-simple-select-label"
            id="section"
            value={section}
            label="Seccion"
            onChange={(e) => setSection(e.target.value)}
          >
            {blogSections.map((v) => (
              <MenuItem value={v}>{v}</MenuItem>
            ))}
          </Select>
          <Editor
            editorState={editorState}
            toolbarClassName="toolbar"
            wrapperClassName="wrapper"
            editorClassName="editor"
            onEditorStateChange={(state) => setEditorState(state)}
            localization={{
              locale: 'es',
            }}
          />
        </FormControl>
      </Box>
      <Box sx={{ my: 2 }}>
        <Button variant='contained' onClick={() => saveBlog('draft')} sx={{ mr: 2 }}>
          Guardar Borrador
        </Button>
        <Button variant='contained' onClick={() => saveBlog('publish')} sx={{ mr: 2 }}>
          Publicar
        </Button>
      </Box>
    </Box>
  );
}


BlogEditor.propTypes = {
  startingPost: PropTypes.any,
  closeBlogEditor: PropTypes.any
}