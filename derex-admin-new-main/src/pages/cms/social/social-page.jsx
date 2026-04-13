import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';

import {
  Card,
  Table,
  Button,
  Dialog,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  DialogActions,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_getAllSNS, api_deleteSNS } from 'src/data/APICalls';

export function SocialPage() {
  const { dataAuth } = useAppContext();

  const { data, refetch } = useQuery('sns', {
    queryFn: () => api_getAllSNS(dataAuth.token),
  });

  const { mutate: deleteSNS, isLoading } = useMutation('deleteSNS', {
    mutationFn: (id) => api_deleteSNS(id, dataAuth.token),
    onSuccess: () => {
      refetch();
    },
  });

  const [deleteId, setDeleteId] = useState(null);

  const sns = data?.data;

  return (
    <Container>
      <Dialog open={deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Estás seguro de eliminar esta red social?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteSNS(deleteId);
              setDeleteId(null);
            }}
            disabled={isLoading}
            color="error"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1em',
        }}
      >
        <h1>Redes sociales</h1>
        <Link to="/cms/social/create">
          <Button variant="contained">Nueva red social</Button>
        </Link>
      </div>

      <Card>
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
            {(sns || []).map((item) => (
              <TableRow hover key={item.id}>
                <TableCell align="left">
                  <Typography sx={{ ml: '1em' }}>{item.name}</Typography>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Link to={`/cms/social/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/social/${item.id}`}>
                      <Button variant="contained" sx={{ marginRight: 1 }}>
                        Abrir
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteId(item.id)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Container>
  );
}
