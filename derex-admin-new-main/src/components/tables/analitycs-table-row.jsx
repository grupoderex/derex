import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

export default function AnalitycsTableRow({ name, value }) {
  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{name}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography fontWeight="bold">{value}</Typography>
      </TableCell>
    </TableRow>
  );
}

AnalitycsTableRow.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};
