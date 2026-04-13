import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

export default function CitiesTableRow({ nameCity, nameState, onEdit }) {
  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography>{nameCity}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography>{nameState}</Typography>
      </TableCell>
      <TableCell align="right">
        <Button sx={{ marginRight: 1 }} onClick={onEdit}>
          Editar
        </Button>
      </TableCell>
    </TableRow>
  );
}

CitiesTableRow.propTypes = {
  nameState: PropTypes.string,
  nameCity: PropTypes.string,
  onEdit: PropTypes.func,
};
