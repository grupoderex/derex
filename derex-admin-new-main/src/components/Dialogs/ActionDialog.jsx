import PropTypes from 'prop-types';

import {
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export function ActionDialogComponent({ open, content, setOpen, setConfirm, element }) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box display="flex" justifyContent="center" mt={2}>
        <Iconify icon="material-symbols:warning" color="#FFA726" width={48} height={48} />
      </Box>
      <DialogTitle textAlign="center">{content.title}</DialogTitle>

      <DialogContent>
        <Typography textAlign="center">{content.text}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button
          color="error"
          onClick={() => {
            setConfirm(element);
            setOpen(false);
          }}
        >
          {content.btnTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ActionDialogComponent.propTypes = {
  open: PropTypes.any,
  setOpen: PropTypes.any,
  content: PropTypes.any,
  setConfirm: PropTypes.any,
  element: PropTypes.any,
};
