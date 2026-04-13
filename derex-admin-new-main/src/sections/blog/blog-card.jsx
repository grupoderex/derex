import { useState } from 'react';
import { Icon } from '@iconify/react';

import Menu from '@mui/material/Menu';
import { Box, Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

import { grey, success } from 'src/theme/palette';

const getDayDifference = (date) => {
  const diffTime = Math.abs(new Date() - new Date(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const BlogCard = ({ post, setEditedPost, handleDelete }) => {
  const { post_title, view, post_status, post_date, post_image1 } = post;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleEdit = () => {
    setEditedPost(post);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <Grid
        container
        border={2}
        borderColor={grey[300]}
        borderRadius="10px"
        width="100%"
        gap={2}
        paddingY={2}
        paddingX={4}
        display="flex"
        alignItems="center"
        flexDirection="row"
      >
        <Grid item xs={12} md={5}>
          <h3>{post_title}</h3>
          {/* <img src={post_image1}/> */}
          <Box component="p" fontSize="0.8em" color={grey[400]}>
            {post.post_status === 'publish' ? 'Publicado' : 'Creado'} hace{' '}
            {`${getDayDifference(post.post_date)} ${
              getDayDifference(post.post_date) > 1 ? 'días' : 'día'
            }  `}
          </Box>
        </Grid>

        <Grid item xs={4} md={2} display="flex" justifyContent="center">
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            border={2}
            borderColor={success.main}
            color={success.main}
            padding={2}
            borderRadius={10}
          >
            {post.post_status === 'publish' ? 'Publicada' : 'En curso'}
          </Box>
        </Grid>
        <Grid item xs={6} md={4} display="flex" alignItems="center" justifyContent="end" gap={2}>
          <Box display="flex" gap={2} alignItems="center" justifyContent="start">
            <Box component="span" fontSize="1.8em" fontWeight="bold">
              {view || 0}
            </Box>
            <Box component="p" color="grey">
              vistas
            </Box>
          </Box>
          <Icon
            cursor="pointer"
            fontSize="2em"
            color="info"
            icon="tabler:dots"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          />
        </Grid>
      </Grid>
    </>
  );
};
