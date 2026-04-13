import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { api_getAnalitycs } from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import LoadingSpiner from 'src/components/loading';
import AnalitycsTableRow from 'src/components/tables/analitycs-table-row';
import PropertyLikesTableRow from 'src/components/tables/property-likes-table-row';

export default function AnalitycsPage () {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { dataAuth } = useAppContext();

  useEffect(() => {
    api_getAnalitycs(dataAuth.token)
      .then(setData)
      .catch(() => {
        toast.error('Error al cargar analiticas');
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [dataAuth, navigate]);

  return (
    <>
      <Helmet>
        <title> Analitics | Derex </title>
      </Helmet>

      {loading ? (
        <LoadingSpiner />
      ) : (
        <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Datos Globales
          </Typography>
          <Card>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: 'transparent' }}>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                    <Typography ml={1}>Data</Typography>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                    <Typography fontWeight="bold">Valor</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.analytics || []).map((item) => (
                  <AnalitycsTableRow key={item.name} name={item.name} value={item.value} />
                ))}
              </TableBody>
            </Table>
          </Card>

          <Typography variant="h4" sx={{ my: 5 }}>
            Casas con mas likes
          </Typography>
          <Card>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: 'transparent' }}>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                    <Typography ml={1}>Imagen</Typography>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                    <Typography ml={1}>Nombre</Typography>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                    <Typography ml={1}>Desarrollo</Typography>
                  </TableCell>
                  <TableCell sx={{ backgroundColor: 'transparent' }} align="center">
                    <Typography>Likes</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.likedHouses || []).map((item) => (
                  <PropertyLikesTableRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </Card>
        </Container>
      )}
    </>
  );
}
