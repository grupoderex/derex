import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import {
  Card,
  Table,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TablePagination,
} from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import useAppContext from 'src/data/DataProvider';
import { api_getAllAdminLogs } from 'src/data/APICalls';

import LogsTableRow from 'src/components/tables/logs-table-row';
import PropertyTableToolbar from 'src/components/tables/property-table-toolbar';

const rx = [/á/g, /é/g, /í/g, /ó/g, /ú/g, /ü/g];
const nx = 'aeiouu';
const ACC_L = rx.length;

const stripAccents = (str) => {
  str = str.toLowerCase();
  for (let i = 0; i < ACC_L; i += 1) str = str.replace(rx[i], nx[i]);
  return str;
};

export default function LogsPage() {
  const [data, setData] = useState([]);
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

  useEffect(() => {
    if (dataAuth.token) {
      api_getAllAdminLogs(dataAuth.token)
        .then((dataApi) => setData(dataApi.activities))
        .catch(() => toast.error('Error al obtener los logs'));
    }
  }, [dataAuth]);

  const fArray = data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  let filteredStates = [];
  const s = stripAccents(filterName);
  if (filterName.length > 0) {
    for (let i = 0; i < data?.length; i += 1) {
      if (!data) break;
      const item = data[i];
      if (stripAccents(item.activity).indexOf(s) !== -1) filteredStates.push(item);
    }
  } else {
    filteredStates = fArray || [];
  }

  return (
    <>
      <Helmet>
        <title> Logs | Javer </title>
      </Helmet>

      <Container>
        <Card>
          <PropertyTableToolbar filterName={filterName} onFilterName={handleFilterByName} />

          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ backgroundColor: 'transparent' }}>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography>Admin</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                  <Typography>Activity</Typography>
                </TableCell>
                <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                  <Typography>Fecha (UTC)</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStates.map((item) => (
                <LogsTableRow
                  key={item.id}
                  email={item.email}
                  activity={item.activity}
                  date={fDateTime(item.created_at)}
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
    </>
  );
}
