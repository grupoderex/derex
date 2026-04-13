import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

export default function ProjectTableRow({ item, onClickDelete }) {
  const router = useRouter();
  return (
    <TableRow hover>
      <TableCell align="left">
        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
        <img
          src={item.logo_color}
          className="props-img"
          style={{ height: 'auto', width: '33%', maxWidth: '250px' }}
          alt="Project Image"
        />
      </TableCell>

      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{item.name}</Typography>
      </TableCell>
      <TableCell align="right">
        <Button
          sx={{ marginRight: 1 }}
          onClick={() => {
            router.push(`/project?id=${item.id}`, item);
          }}
        >
          Editar
        </Button>
        <Button variant="contained" color="error" onClick={() => onClickDelete(item)}>
          Eliminar
        </Button>
      </TableCell>
    </TableRow>
  );
}

ProjectTableRow.propTypes = {
  item: PropTypes.any,
  onClickDelete: PropTypes.func,
};
