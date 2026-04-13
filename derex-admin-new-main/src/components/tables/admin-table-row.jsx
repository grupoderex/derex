import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import useAppContext from 'src/data/DataProvider';

import Label from 'src/components/label';

export default function AdminsTableRow({ name, email, active, role, onEdit, chnageActive }) {
  const { dataAuth } = useAppContext();

  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{name}</Typography>
      </TableCell>
      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{email}</Typography>
      </TableCell>
      <TableCell>
        <Label color={active ? 'success' : 'error'}>{active ? 'Activo' : 'Baneado'}</Label>
      </TableCell>
      <TableCell align="left">
        <Typography sx={{ ml: '1em' }}>{role}</Typography>
      </TableCell>
      {dataAuth.role === 'owner' ? (
        <TableCell align="right" sx={{ display: 'flex' }}>
          <Button variant="contained" color="error" onClick={chnageActive}>
            {active ? 'Dar de baja' : 'Activar'}
          </Button>
          <Button sx={{ marginRight: 1 }} onClick={onEdit}>
            Editar
          </Button>
        </TableCell>
      ) : null}
    </TableRow>
  );
}

AdminsTableRow.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
  active: PropTypes.bool,
  onEdit: PropTypes.func,
  chnageActive: PropTypes.func,
};
