import { useState } from 'react';
import PropTypes from 'prop-types';

import { Modal, Button, Box, TextField } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useMutation } from 'react-query';
import { api_updateStyle } from 'src/data/APICalls';
import { toast } from 'react-toastify';
import useAppContext from 'src/data/DataProvider';

export default function DocumentsTableRow({ name, alt, onOpen, onEdit, itemKey }) {
  const [open, setOpen] = useState(false);
  const [altText, setAltText] = useState(alt);
  const { dataAuth } = useAppContext();

  const { mutate, isLoading } = useMutation('updateMediaAltText', {
    mutationFn: (data) => api_updateStyle(itemKey, { alt_text: data }, dataAuth.token),
    onSuccess: () => {
      toast.success('Texto alternativo de imagen actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar el texto alternativo de imagen');
    },
  });

  return (
    <TableRow hover>
      <Modal open={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: '1rem',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Texto alternativo de imagen
          </Typography>
          <TextField
            fullWidth
            name="alt_text"
            sx={{ mb: 2 }}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            label="Texto alternativo de imagen"
            variant="outlined"
          />

          <Button
            sx={{ px: 3 }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            sx={{ px: 3 }}
            onClick={() => {
              setOpen(false);
              mutate(altText);
            }}
            disabled={isLoading}
            variant="contained"
          >
            Reemplazar
          </Button>
        </Box>
      </Modal>
      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{name}</Typography>
      </TableCell>
      <TableCell align="right">
        <Button sx={{ marginRight: 1 }} onClick={() => setOpen(true)}>
          Texto alternativo
        </Button>
        {onEdit ? (
          <Button sx={{ marginRight: 1 }} onClick={onEdit}>
            Reemplazar
          </Button>
        ) : null}
        <Button variant="contained" sx={{ marginRight: 1 }} onClick={onOpen}>
          Abrir
        </Button>
      </TableCell>
    </TableRow>
  );
}

DocumentsTableRow.propTypes = {
  name: PropTypes.string,
  itemKey: PropTypes.string,
  alt: PropTypes.string,
  onOpen: PropTypes.func,
  onEdit: PropTypes.func,
};
