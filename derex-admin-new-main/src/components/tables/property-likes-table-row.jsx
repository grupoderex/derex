import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function PropertyLikesTableRow({ item }) {
  return (
    <TableRow hover>
      <TableCell align="left">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={item.main_image} height={window.innerHeight / 10} className="props-img" />
      </TableCell>

      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{item.name}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{item.project_name}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography fontWeight="bold" sx={{ ml: '1em' }}>
          {item.likes}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

PropertyLikesTableRow.propTypes = {
  item: PropTypes.any,
};
