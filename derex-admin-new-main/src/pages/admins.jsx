import { useState } from 'react';
import { useQuery } from 'react-query';

import {
  Box,
  Card,
  Modal,
  Table,
  Button,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import useAppContext from 'src/data/DataProvider';
import { api_getAllProperties } from 'src/data/APICalls';

import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify/iconify';
import PropertyTableRow from 'src/components/tables/property-table-row';
import PropertyTableToolbar from 'src/components/tables/property-table-toolbar';

export const modalStyle = {
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

export default function Properties() {
  const { data } = useQuery('properties', api_getAllProperties);
  const [deleteModalObject, setDeleteModalObject] = useState(null);
  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { deleteProperty, projects } = useAppContext();
  const [props, setProps] = useState([]);

  const handleChangePage = (event, newPage) => {
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
  let filteredProps = [];
  const s = stripAccents(filterName);

  if (filterName.length > 0) {
    for (let i = 0; i < data?.length; i += 1) {
      if (!data) break;
      const item = data[i];
      const iN = stripAccents(item.name);
      const p = projects[+item.id_project];
      const pN = stripAccents(p ? p.name : '');
      if (iN.indexOf(s) !== -1 || pN.indexOf(s) !== -1) {
        filteredProps.push(item);
      }
    }
  } else {
    filteredProps = fArray || [];
  }

  const onClickPropDelete = (id) => {
    setDeleteModalObject(id);
  };
  const router = useRouter();

  return (
    <>
      <Container>
        <Button
          onClick={() => {
            router.push('/property?new=true');
          }}
          variant="contained"
          color="inherit"
          sx={{ mb: 3 }}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Nueva Propiedad
        </Button>

        <Card>
          <PropertyTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableBody>
                  {filteredProps.map((item, index) => (
                    <PropertyTableRow key={index} item={item} onClickDelete={onClickPropDelete} />
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

      <Modal open={deleteModalObject != null}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Borrar propiedad
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ¿Está seguro de que desea borrar la propiedad?
          </Typography>

          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              deleteProperty(deleteModalObject.id);
              // eslint-disable-next-line react/prop-types
              const p = props.concat();
              for (let i = 0; i < p.length; i += 1) {
                const prop = p[i];
                if (prop.id === deleteModalObject.id) {
                  p.splice(i, 1);
                  break;
                }
              }
              setProps(p);
              setDeleteModalObject(null);
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
