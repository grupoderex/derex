import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Modal,
  Button,
  Select,
  TableRow,
  MenuItem,
  Checkbox,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  InputLabel,
  TablePagination,
  FormControlLabel,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import {
  api_updateAdmin,
  api_getAllAdmins,
  api_manageBanAdmin,
  api_resgiterNewAdmin,
} from 'src/data/APICalls';

import Iconify from 'src/components/iconify/iconify';
import AdminsTableRow from 'src/components/tables/admin-table-row';
import PropertyTableToolbar from 'src/components/tables/property-table-toolbar';

const rx = [/á/g, /é/g, /í/g, /ó/g, /ú/g, /ü/g];
const nx = 'aeiouu';
const ACC_L = rx.length;

const roles = ['owner', 'sales', 'marketing', 'IT'];

const stripAccents = (str) => {
  str = str.toLowerCase();
  for (let i = 0; i < ACC_L; i += 1) str = str.replace(rx[i], nx[i]);
  return str;
};

export default function StatesPage() {
  const [data, setData] = useState([]);
  const [editAdminModal, setEditAdminModal] = useState(null);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [changePassword, setChangePassword] = useState(false);

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

  const refetch = useCallback(() => {
    if (dataAuth.token) {
      api_getAllAdmins(dataAuth.token)
        .then(setData)
        .catch(() => toast.error('Error al obtener los admins'));
    }
  }, [dataAuth.token]);

  useEffect(() => {
    refetch();
  }, [dataAuth, refetch]);

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
        <title> Admins | Javer </title>
      </Helmet>

      <Container>
        {dataAuth.role === 'owner' ? (
          <Button
            onClick={() => {
              setEditAdminModal({
                name: '',
                phone: '',
                email: '',
                password: '',
                role: '',
              });
            }}
            variant="contained"
            color="inherit"
            sx={{ mb: 3 }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Nuevo Admin
          </Button>
        ) : null}
        <Card>
          <PropertyTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: 'transparent' }}>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography ml={1}>Nombre</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography ml={1}>Email</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography ml={1}>Status</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography ml={1}>Role</Typography>
                </TableCell>
                {dataAuth.role === 'owner' ? (
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                    <Typography mr={5}>Accion</Typography>
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStates.map((item) => (
                <AdminsTableRow
                  key={item.id}
                  name={item.name}
                  email={item.email}
                  role={item.role}
                  active={item.active === 1}
                  onEdit={() => setEditAdminModal(item)}
                  chnageActive={() =>
                    api_manageBanAdmin(item.id, dataAuth.token)
                      .then(() => refetch())
                      .catch(() => toast.error('Error al banear/desbanear admin'))
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
      <Modal open={editAdminModal !== null}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            borderRadius: '1rem',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editAdminModal?.id ? 'Editar Admin' : 'Nuevo Admin'}
          </Typography>
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            value={editAdminModal?.name}
            onChange={(e) =>
              setEditAdminModal((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
            label="Nombre"
            variant="outlined"
            required
          />
          <TextField
            sx={{ mt: 2 }}
            fullWidth
            value={editAdminModal?.email}
            onChange={(e) =>
              setEditAdminModal((prevState) => ({
                ...prevState,
                email: e.target.value,
              }))
            }
            label="Email"
            variant="outlined"
            required
          />
          {editAdminModal?.id ? (
            <FormControlLabel
              required
              control={<Checkbox onChange={(e) => setChangePassword(e.target.checked)} />}
              label="Cambiar Contraseña"
            />
          ) : null}

          {!editAdminModal?.id || (editAdminModal?.id && changePassword) ? (
            <TextField
              sx={{ mt: 1 }}
              fullWidth
              value={editAdminModal?.password}
              onChange={(e) =>
                setEditAdminModal((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
              label="Contraseña"
              type="password"
              variant="outlined"
              required
            />
          ) : null}
          <InputLabel sx={{ my: 1 }}>Roles:</InputLabel>
          <Select
            fullWidth
            value={editAdminModal?.role || ''}
            onChange={(e) => {
              setEditAdminModal((prevState) => ({
                ...prevState,
                role: e.target.value,
              }));
            }}
            required
          >
            {roles.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
          <Box display="flex" sx={{ mt: 1 }} justifyContent="center">
            <Button
              sx={{ mt: 2, mr: 2 }}
              disabled={
                editAdminModal?.name?.length < 3 || !editAdminModal?.email || !editAdminModal?.role
              }
              onClick={async () => {
                const regex =
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!regex.test(editAdminModal?.email)) {
                  toast.error('Email no valido');
                } else if (editAdminModal.id) {
                  if (changePassword && editAdminModal?.password?.length < 8) {
                    toast.error('Contraseña debe ser mayor a 8 caracteres');
                  } else {
                    const newPass =
                      editAdminModal?.password === '' ? undefined : editAdminModal?.password;
                    api_updateAdmin(
                      editAdminModal.id,
                      { ...editAdminModal, password: newPass },
                      dataAuth.token
                    )
                      .then(() => {
                        setEditAdminModal(null);
                        refetch();
                        toast.success('Admin actualizado');
                      })
                      .catch(() => toast.error('Error al actualizar al admin'));
                  }
                } else if (editAdminModal?.password?.length < 8) {
                  toast.error('Contraseña debe ser mayor a 8 caracteres');
                } else {
                  api_resgiterNewAdmin(editAdminModal, dataAuth.token)
                    .then(() => {
                      setEditAdminModal(null);
                      refetch();
                      toast.success('Admin creado');
                    })
                    .catch(() => toast.error('Error al crear el admin'));
                }
              }}
              variant="contained"
            >
              {editAdminModal?.id ? 'Actualizar' : 'Crear'}
            </Button>
            <Button
              sx={{ mt: 2 }}
              color="error"
              onClick={() => {
                setEditAdminModal(null);
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
