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
import { api_deleteClientExperience, api_getAllClientExperiences } from 'src/data/APICalls';

export function ClientExperiencePage() {
  const { dataAuth } = useAppContext();

  const { data, refetch } = useQuery('experiences', {
    queryFn: () => api_getAllClientExperiences(dataAuth.token),
  });

  const { mutate: deleteExperience, isLoading } = useMutation('deleteExperience', {
    mutationFn: (id) => api_deleteClientExperience(id, dataAuth.token),
    onSuccess: () => {
      refetch();
    },
  });

  const [deleteId, setDeleteId] = useState(null);

  const experiences = data?.data;

  return (
    <Container>
      <Dialog open={deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Estás seguro de eliminar esta experiencia?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteExperience(deleteId);
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
        <h1>Experiencia de clientes</h1>
        <Link to="/cms/client-experience/create">
          <Button variant="contained">Nueva experiencia</Button>
        </Link>
      </div>

      <Card>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: 'transparent' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                <Typography ml={1}>Descripcion</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                <Typography ml={1}>Desarrollo</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                <Typography mr={5}>Accion</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(experiences || []).map((item) => (
              <TableRow hover key={item.id}>
                <TableCell align="left">
                  <Typography sx={{ ml: '1em' }}>
                    {item.description_es.length > 100
                      ? `${item.description_es.substring(0, 100)}...`
                      : item.description_es}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ ml: '1em' }}>{item.project_name}</Typography>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Link to={`/cms/client-experience/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/client-experience/${item.id}`}>
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
