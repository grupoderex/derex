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

export function PrivacyPage() {
  const { dataAuth } = useAppContext();

  const { mutate: deleteNotice, isLoading } = useMutation('deleteNotice', {
    mutationFn: (id) => api_deleteDecalogue(id, dataAuth.token),
    onSuccess: () => {
      refetchSections();
      toast.success('Aviso de privacidad eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar aviso de privacidad');
    },
  });

  const [deleteId, setDeleteId] = useState(null);

  const { data: sections, refetch: refetchSections } = useQuery('noticeSection', {
    queryFn: () => api_getAllDecalogueSections('notice', dataAuth.token),
  });

  const { mutate: deleteSection, isLoading: isDeletingSection } = useMutation(
    'deleteNoticeSection',
    {
      mutationFn: (id) => api_deleteDecalogueSection(id, dataAuth.token),
      onSuccess: () => {
        refetchSections();
        toast.success('Seccion eliminada');
      },
      onError: () => {
        toast.error('Error al eliminar seccion. Asegurate de que no tenga avisos asociados');
      },
    }
  );

  const [deleteSectionId, setDeleteSectionId] = useState(null);

  const notices = sections?.data?.flatMap((section) => section.decalogue);
  const noticesSections = sections?.data;

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
        <h1>Secciones de avisos de privacidad</h1>
        <Link to="/cms/privacy-section/create">
          <Button variant="contained">Nueva seccion de avisos</Button>
        </Link>
      </div>

      <Card>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ backgroundColor: 'transparent' }}>
            <TableRow>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="left">
                <Typography ml={1}>Secciones de avisos</Typography>
              </TableCell>
              <TableCell sx={{ backgroundColor: 'transparent' }} align="right">
                <Typography mr={5}>Accion</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(noticesSections || []).map((item) => (
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
                    <Link to={`/cms/privacy-section/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/privacy-section/${item.id}`}>
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
        <DialogTitle>¿Estás seguro de eliminar este aviso?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteSectionId(null)}>Cancelar</Button>
          <Button
            onClick={() => {
              deleteNotice(deleteId);
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
        <h1>Avisos de privacidad</h1>
        <Link to="/cms/privacy/create">
          <Button variant="contained">Nuevo aviso</Button>
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
            {(notices || []).map((item) => (
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
                    <Link to={`/cms/privacy/${item.id}/edit`}>
                      <Button sx={{ marginRight: 1 }}>Editar</Button>
                    </Link>
                    <Link to={`/cms/privacy/${item.id}`}>
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
