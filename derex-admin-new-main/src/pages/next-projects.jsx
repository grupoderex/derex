import { useState } from 'react';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';

import {
  Box,
  Card,
  Modal,
  Table,
  Button,
  TableRow,
  Container,
  TableCell,
  TableBody,
  TableHead,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import useAppContext from 'src/data/DataProvider';
import { api_getAllNewDevelopments, api_deleteNewDevelopment } from 'src/data/APICalls';

import Scrollbar from 'src/components/scrollbar';
import LoadingSpiner from 'src/components/loading';
import Iconify from 'src/components/iconify/iconify';

import DevelopmentTableRow from 'src/components/tables/new-development-table-row';
import PropertyTableToolbar from 'src/components/tables/property-table-toolbar';

const modalStyle = {
  position: 'absolute',
  display: 'flex',
  'flex-direction': 'column',
  'text-align': 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const rx = [/á/g, /é/g, /í/g, /ó/g, /ú/g, /ü/g];
const nx = 'aeiouu';
const ACC_L = rx.length;

const stripAccents = (str) => {
  str = str.toLowerCase();
  for (let i = 0; i < ACC_L; i += 1) str = str.replace(rx[i], nx[i]);
  return str;
};

export default function NextProjects() {
  const { data, isLoading } = useQuery('developments', api_getAllNewDevelopments);

  const projects = data;

  const [deleteModalObject, setDeleteModalObject] = useState(null);
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

  const fArray = projects?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  let filteredProjects = [];
  const s = stripAccents(filterName);
  if (filterName.length > 0) {
    for (let i = 0; i < projects?.length; i += 1) {
      if (!projects) break;
      const item = projects[i];
      if (stripAccents(item.name).indexOf(s) !== -1) filteredProjects.push(item);
    }
  } else {
    filteredProjects = fArray || [];
  }

  const onClickPropDelete = (id) => {
    setDeleteModalObject(id);
  };

  const router = useRouter();

  return (
    <>
      <Helmet>
        <title> Desarrollos | Javer </title>
      </Helmet>

      {isLoading ? (
        <LoadingSpiner />
      ) : (
        <Container>
          <Button
            onClick={() => {
              router.replace('/developments/create');
            }}
            variant="contained"
            color="inherit"
            sx={{ mb: 3 }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Crear próximo lanzamiento
          </Button>

          <Card>
            <PropertyTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead sx={{ backgroundColor: 'transparent' }}>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                        <Typography ml={5}>Logo</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                        <Typography ml={1}>Nombre</Typography>
                      </TableCell>
                      <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                        <Typography mr={5}>Accion</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProjects.map((item, index) => (
                      <DevelopmentTableRow
                        key={index}
                        item={item}
                        onClickDelete={onClickPropDelete}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              page={page}
              component="div"
              count={projects?.length || 0}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      )}

      <Modal open={deleteModalObject !== null}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Borrar nuevo desarrollo
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Está seguro de que desea borrar el desarrollo?
          </Typography>

          <Button
            sx={{ mt: 2 }}
            onClick={async () => {
              await api_deleteNewDevelopment(deleteModalObject.id, dataAuth.token);
              setDeleteModalObject(null);
              window.location.reload();
            }}
            variant="contained"
            color="error"
          >
            Si, Eliminar
          </Button>
          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              setDeleteModalObject(null);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
}
