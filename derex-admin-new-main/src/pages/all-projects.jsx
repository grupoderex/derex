import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';

import {
  Box,
  Button,
  Card,
  Container,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { api_deleteProjectById, api_getAllProjects } from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import Iconify from 'src/components/iconify/iconify';
import LoadingSpiner from 'src/components/loading';
import Scrollbar from 'src/components/scrollbar';
import ProjectTableRow from 'src/components/tables/project-table-row';
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

export default function AllProjects () {
  const { data, isLoading } = useQuery('projects', api_getAllProjects);
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

  const fArray = data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  let filteredProjects = [];
  const s = stripAccents(filterName);
  if (filterName.length > 0) {
    for (let i = 0; i < data?.length; i += 1) {
      if (!data) break;
      const item = data[i];
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
        <title> Desarrollos | Derex </title>
      </Helmet>

      {isLoading ? (
        <LoadingSpiner />
      ) : (
        <Container>
          <Button
            onClick={() => {
              router.replace('/project?new=true');
            }}
            variant="contained"
            color="inherit"
            sx={{ mb: 3 }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Nuevo Desarrollo
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
                      <ProjectTableRow key={index} item={item} onClickDelete={onClickPropDelete} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

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
      )}

      <Modal open={deleteModalObject !== null}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Borrar desarrollo
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Está seguro de que desea borrar el desarrollo?
          </Typography>

          <Button
            sx={{ mt: 2 }}
            onClick={async () => {
              await api_deleteProjectById(deleteModalObject.id, dataAuth.token);
              setDeleteModalObject(null);
              window.location.reload();
            }}
            variant="contained"
            color="error"
          >
            Delete
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
