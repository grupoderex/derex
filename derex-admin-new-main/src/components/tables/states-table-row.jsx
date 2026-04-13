import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

export default function StatesTableRow({ name, onEdit }) {
  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{name}</Typography>
      </TableCell>
      <TableCell align="right">
        <Button sx={{ marginRight: 1 }} onClick={onEdit}>
          Editar
        </Button>
      </TableCell>
    </TableRow>
  );
}

StatesTableRow.propTypes = {
  name: PropTypes.string,
  onEdit: PropTypes.func,
};
