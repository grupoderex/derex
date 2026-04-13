import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import {
  Box,
  Button,
  Card,
  Container,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { api_createCity, api_getAllCities, api_updatedCity } from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';
import { api_getAllStates } from 'src/data/statesApiCalls/states';

import Iconify from 'src/components/iconify/iconify';
import CitiesTableRow from 'src/components/tables/cities-table-row';
import PropertyTableToolbar from 'src/components/tables/property-table-toolbar';

const rx = [/á/g, /é/g, /í/g, /ó/g, /ú/g, /ü/g];
const nx = 'aeiouu';
const ACC_L = rx.length;

const stripAccents = (str) => {
  str = str.toLowerCase();
  for (let i = 0; i < ACC_L; i += 1) str = str.replace(rx[i], nx[i]);
  return str;
};

export default function CitiesPage () {
  const { data: allCities, refetch } = useQuery('states', api_getAllCities);
  const { data: allStates } = useQuery('cities', api_getAllStates);
  const [editCityModal, setEditCityModal] = useState(null);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { dataAuth } = useAppContext();

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const fArray = allCities?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  let filteredCities = [];
  const s = stripAccents(filterName);
  if (filterName.length > 0) {
    for (let i = 0; i < allCities?.length; i += 1) {
      if (!allCities) break;
      const item = allCities[i];
      if (stripAccents(item.name).indexOf(s) !== -1) filteredCities.push(item);
    }
  } else {
    filteredCities = fArray || [];
  }

  return (
    <>
      <Helmet>
        <title> Ciudades | Derex </title>
      </Helmet>

      <Container>
        <Button
          onClick={() => {
            setEditCityModal({
              name: '',
              state: '',
            });
          }}
          variant="contained"
          color="inherit"
          sx={{ mb: 3 }}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Nueva Ciudad
        </Button>
        <Card>
          <PropertyTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: 'transparent' }}>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography ml={1}>Nombre</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography ml={1}>Estado</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                  <Typography mr={5}>Accion</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCities.map((item) => (
                <CitiesTableRow
                  key={item.id}
                  nameCity={item.name}
                  nameState={
                    (allStates || []).find((v) => v.id === item?.id_state)?.name || 'Sin estado'
                  }
                  onEdit={() => setEditCityModal(item)}
                />
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={page}
            component="div"
            count={allCities?.length || 0}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Modal open={editCityModal !== null}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: '1rem',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editCityModal?.id ? 'Editar Ciudad' : 'Crear Ciudad'}
          </Typography>
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            value={editCityModal?.name}
            onChange={(e) =>
              setEditCityModal((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            label="Nombre"
            variant="outlined"
            required
          />
          <InputLabel sx={{ mb: 1, mt: 2 }}>Estado al que pertenece:</InputLabel>
          <Select
            fullWidth
            value={editCityModal?.id_state || ''}
            onChange={(e) => {
              setEditCityModal((prevState) => ({
                ...prevState,
                id_state: e.target.value,
              }));
            }}
            required
          >
            {allStates
              ? allStates.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))
              : null}
          </Select>
          <Box display="flex" sx={{ mt: 1 }} justifyContent="center">
            <Button
              sx={{ mt: 2, mr: 2 }}
              disabled={editCityModal?.name?.length < 3 || !editCityModal?.id_state}
              onClick={async () => {
                if (editCityModal?.id && editCityModal?.id_state) {
                  api_updatedCity(
                    editCityModal.id,
                    editCityModal.name,
                    editCityModal.id_state,
                    dataAuth.token
                  )
                    .then(() => {
                      toast.success('Ciudad actualizada');
                      refetch();
                      setEditCityModal(null);
                    })
                    .catch(() => toast.error('Error al actualizar el estado'));
                } else {
                  api_createCity(editCityModal?.name, editCityModal.id_state, dataAuth.token)
                    .then(() => {
                      toast.success('Ciudad creada');
                      refetch();
                      setEditCityModal(null);
                    })
                    .catch(() => toast.error('Error al crear el estado'));
                }
              }}
              variant="contained"
            >
              {editCityModal?.id ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              sx={{ mt: 2 }}
              color="error"
              onClick={() => {
                setEditCityModal(null);
              }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
