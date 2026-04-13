import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, Modal } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { api_deletePost, api_getAllPosts } from 'src/data/APICalls';

import Iconify from 'src/components/iconify';
import LoadingSpiner from 'src/components/loading';

import { BlogEditor } from 'src/sections/blog-editor/view';

import { BlogCard } from '../blog-card';

// ----------------------------------------------------------------------
export default function BlogView() {
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editedPost, setEditedPost] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(0);

  const { data, refetch, isLoading } = useQuery('blogs', api_getAllPosts);
  const mutation = useMutation({ mutationFn: api_deletePost });

  const handleDelete = (id) => {
    mutation.mutate(id);
    refetch();
  };

  const closeBlogEditor = () => {
    setEditorOpen(false);
    setEditedPost(null);
    refetch();
  };
  const editBlog = (post) => {
    setEditorOpen(true);
  };

  return isEditorOpen || editedPost ? (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} m={5}>
        <Typography variant="h4">Blog</Typography>

        <Button variant="contained" color="inherit" onClick={closeBlogEditor}>
          Regresar
        </Button>
      </Stack>
      <BlogEditor startingPost={editedPost} closeBlogEditor={closeBlogEditor} />
    </>
  ) : (
    <Container>
      <Modal open={!!deleteModalVisible}>
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            'flex-direction': 'column',
            'text-align': 'center',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Eliminar post
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Está seguro de que desea eliminar el post?
          </Typography>

          <Box>
            <Button
              sx={{ mt: 2 }}
              onClick={() => {
                handleDelete(deleteModalVisible);
                setDeleteModalVisible(0);
              }}
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
            <Button
              sx={{ mt: 2 }}
              onClick={() => {
                setDeleteModalVisible(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blog</Typography>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={editBlog}
        >
          Crear post
        </Button>
      </Stack>
      {isLoading ? (<LoadingSpiner />) : (<>
        <Grid container marginBottom={5}>
          <Grid item xs={5} fontWeight="bold" fontSize="1.8em">
            <Box>TITULO</Box>
          </Grid>
          <Grid item xs={3} fontWeight="bold" fontSize="1.8em">
            <Box>ESTADO</Box>
          </Grid>
          <Grid item xs={4} fontWeight="bold" fontSize="1.8em">
            <Box>ESTADISTICAS</Box>
          </Grid>
        </Grid>
        <Grid container spacing={3} gap={3}>
          {data?.map((post) => (
            <BlogCard
              post={post}
              key={post.id}
              setEditedPost={setEditedPost}
              handleDelete={() => setDeleteModalVisible(post.id)}
            />
          ))}
        </Grid>
      </>)}
    </Container>
  );
}
