import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import TableRow from '@mui/material/TableRow';
import { Button, Switch } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import useAppContext from 'src/data/DataProvider';
import { api_toggleUrgencyChip, api_getUrgencyChipByProperty } from 'src/data/APICalls';

// ----------------------------------------------------------------------

export default function PropertyTableRow({ item, onClickDelete }) {
  const [checked, setChecked] = useState(false);
  const [isChipExist, setChipExist] = useState(false);
  const [chipData, setChipData] = useState(null);

  const { dataAuth } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const state = event.target.checked ? true : false;

    const toastId = toast.loading('estado de la promoción');

    if (chipData !== null) {
      api_toggleUrgencyChip(chipData.id, { is_active: state }, dataAuth.token)
        .then(() => {
          setChecked(state);
          toast.update(toastId, {
            render: state ? 'Chip activada correctamente' : 'Chip desactivada correctamente',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
          });
        })
        .catch(() => {});
    } else {
      setChecked(state);
    }
  };

  useEffect(() => {
    api_getUrgencyChipByProperty(item.id)
      .then(({ chip }) => {
        setChipData(chip);
        setChipExist(true);
        setChecked(chip.is_active);
      })
      .catch(() => {
        setChecked(false);
        setChipExist(false);
      });
  }, [item]);

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
        <Typography sx={{ ml: '1em' }}>{item.project_order} / En carrusel</Typography>
      </TableCell>

      <TableCell align="center">
        {checked ? <p>Desactivar chip de urgencia</p> : <p>Activar chip de urgencia</p>}
        <Switch
          disabled={!isChipExist}
          checked={checked}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </TableCell>

      <TableCell align="right">
        <Button
          sx={{ marginRight: 1 }}
          onClick={() => {
            navigate(`/property?id=${item.id}`);
          }}
        >
          Editar
        </Button>
        <Button variant="contained" color="error" onClick={() => onClickDelete(item.id)}>
          Eliminar
        </Button>
      </TableCell>
    </TableRow>
  );
}

PropertyTableRow.propTypes = {
  item: PropTypes.any,
  onClickDelete: PropTypes.func,
};
