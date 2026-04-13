import { useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

import {
  Box,
  Card,
  Table,
  Modal,
  Button,
  TableRow,
  Container,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  Typography,
  TablePagination,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_createState,
  api_getAllStates,
  api_updatedState,
} from 'src/data/statesApiCalls/states';

import Iconify from 'src/components/iconify/iconify';
import StatesTableRow from 'src/components/tables/states-table-row';
import PropertyTableToolbar from 'src/components/tables/property-table-toolbar';

import { Banner } from './components';

const rx = [/á/g, /é/g, /í/g, /ó/g, /ú/g, /ü/g];
const nx = 'aeiouu';
const ACC_L = rx.length;

const stripAccents = (str) => {
  str = str.toLowerCase();
  for (let i = 0; i < ACC_L; i += 1) str = str.replace(rx[i], nx[i]);
  return str;
};

export default function StatesPage() {
  const { data, refetch } = useQuery('states', api_getAllStates);
  const [editStateModal, setEditStateModal] = useState(null);
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

  const handleBannerChange = (bannerData) => {
    setEditStateModal((prevState) => ({
      ...prevState,
      ...bannerData,
    }));
  };

  const fArray = data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  let filteredStates = [];
  const s = stripAccents(filterName);
  if (filterName.length > 0) {
    for (let i = 0; i < data?.length; i += 1) {
      if (!data) break;
      const item = data[i];
      if (stripAccents(item.name).indexOf(s) !== -1) filteredStates.push(item);
    }
  } else {
    filteredStates = fArray || [];
  }

  return (
    <>
      <Helmet>
        <title> Estados | Javer </title>
      </Helmet>

      <Container>
        <Button
          onClick={() => {
            setEditStateModal({
              name: '',
              banner_url: '',
            });
          }}
          variant="contained"
          color="inherit"
          sx={{ mb: 3 }}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Nuevo Estado
        </Button>

        <Card>
          <PropertyTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: 'transparent' }}>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography ml={1}>Nombre</Typography>
                </TableCell>

                <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                  <Typography mr={5}>Accion</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStates.map((item) => (
                <StatesTableRow
                  key={item.id}
                  name={item.name}
                  onEdit={() =>
                    setEditStateModal((prevState) => ({
                      ...prevState,
                      ...item,
                      name: item.name,
                      banner_url: item.banner_url,
                    }))
                  }
                />
              ))}
            </TableBody>
          </Table>

          <TablePagination
            page={page}
            component="div"
            count={data?.length || 0}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Modal open={editStateModal !== null}>
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
            {editStateModal?.id ? 'Editar Estado' : 'Crear Estado'}
          </Typography>

          <Banner bannerInitialData={editStateModal} onFormChange={handleBannerChange} />

          <TextField
            sx={{ mt: 2 }}
            fullWidth
            value={editStateModal?.name}
            onChange={(e) =>
              setEditStateModal((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            label="Nombre"
            variant="outlined"
            required
          />

          <Box display="flex" sx={{ mt: 1 }} justifyContent="center">
            <Button
              sx={{ mt: 2, mr: 2 }}
              disabled={editStateModal?.name?.length < 3}
              onClick={async () => {
                if (editStateModal?.id) {
                  api_updatedState(editStateModal.id, editStateModal, dataAuth.token)
                    .then(() => {
                      toast.success('Estado actualizado');
                      refetch();
                      setEditStateModal(null);
                    })
                    .catch(() => toast.error('Error al actualizar el estado'));
                } else {
                  api_createState(editStateModal, dataAuth.token)
                    .then(() => {
                      toast.success('Estado actualizado');
                      refetch();
                      setEditStateModal(null);
                    })
                    .catch(() => toast.error('Error al crear el estado'));
                }
              }}
              variant="contained"
            >
              {editStateModal?.id ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              sx={{ mt: 2 }}
              color="error"
              onClick={() => {
                setEditStateModal(null);
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
