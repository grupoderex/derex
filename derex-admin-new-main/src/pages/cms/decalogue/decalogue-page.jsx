import { useState } from 'react';
import { toast } from 'react-toastify';
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
import {
  api_deleteDecalogue,
  api_deleteDecalogueSection,
  api_getAllDecalogueSections,
} from 'src/data/APICalls';

export function DecaloguePage() {
  const { dataAuth } = useAppContext();

  const { mutate: deleteDecalogue, isLoading } = useMutation('deleteDecalogue', {
    mutationFn: (id) => api_deleteDecalogue(id, dataAuth.token),
    onSuccess: () => {
      refetchSections();
      toast.success('Decálogo eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar decálogo');
    },
  });

  const [deleteId, setDeleteId] = useState(null);

  const { data: sections, refetch: refetchSections } = useQuery('decalogueSections', {
    queryFn: () => api_getAllDecalogueSections('decalogue', dataAuth.token),
  });

  const { mutate: deleteSection, isLoading: isDeletingSection } = useMutation(
    'deleteDecalogueSection',
    {
      mutationFn: (id) => api_deleteDecalogueSection(id, dataAuth.token),
      onSuccess: () => {
        refetchSections();
        toast.success('Seccion eliminada');
      },
      onError: () => {
        toast.error('Error al eliminar seccion. Asegurate de que no tenga decálogos asociados');
      },
    }
  );

  const [deleteSectionId, setDeleteSectionId] = useState(null);

  const decalogues = sections?.data?.flatMap((section) => section.decalogue);
  const decalogueSections = sections?.data;

  return (
    <Container>
      <Dialog open={deleteSectionId} onClose={() => setDeleteSectionId(null)}>
        <DialogTitle>¿Estás seguro de eliminar esta seccion?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteSectionId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteSection(deleteSectionId);
              setDeleteSectionId(null);
            }}
            disabled={isDeletingSection}
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
        <h1>Secciones del decálogo</h1>
        <Link to="/cms/decalogue-section/create">
          <Button variant="contained">Nueva seccion del decálogo</Button>
        </Link>
      </div>

      <Card>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: 'transparent' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                <Typography ml={1}>Secciones del decálogo</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                <Typography mr={5}>Accion</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(decalogueSections || []).map((item) => (
              <TableRow hover key={item.id}>
                <TableCell align="left">
                  <Typography sx={{ ml: '1em' }}>{item.name_es}</Typography>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Link to={`/cms/decalogue-section/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/decalogue-section/${item.id}`}>
                      <Button variant="contained" sx={{ marginRight: 1 }}>
                        Abrir
                      </Button>
                    </Link>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setDeleteSectionId(item.id)}
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
      <Dialog open={deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>¿Estás seguro de eliminar este decalogo?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteSectionId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteDecalogue(deleteId);
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
          marginTop: '3em',
        }}
      >
        <h1>Decálogo</h1>
        <Link to="/cms/decalogue/create">
          <Button variant="contained">Nuevo decálogo</Button>
        </Link>
      </div>

      <Card>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: 'transparent' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                <Typography ml={1}>Titulo</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                <Typography mr={5}>Accion</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(decalogues || []).map((item) => (
              <TableRow hover key={item.id}>
                <TableCell align="left">
                  <Typography sx={{ ml: '1em' }}>{item.title_es}</Typography>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Link to={`/cms/decalogue/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/decalogue/${item.id}`}>
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
