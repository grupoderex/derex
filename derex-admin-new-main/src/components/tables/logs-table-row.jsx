import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

export default function LogsTableRow({ email, date, activity }) {
  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography>{email}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography>{activity}</Typography>
      </TableCell>
      <TableCell align="right">
        <Typography>{date}</Typography>
      </TableCell>
    </TableRow>
  );
}

LogsTableRow.propTypes = {
  email: PropTypes.string,
  date: PropTypes.string,
  activity: PropTypes.string,
};
