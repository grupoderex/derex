import { useRef } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
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
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_updateStyle, api_getAllStyles } from 'src/data/APICalls';

import LoadingSpiner from 'src/components/loading';
import DocumentsTableRow from 'src/components/tables/documents-table-row';

const enabledMedia = ['home_video', 'lotes_image', 'reservas_image', 'blog_image'];

export default function DocumentsPage() {
  const { data, isLoading, refetch } = useQuery('styles', api_getAllStyles);
  const { setMediaForID, dataAuth } = useAppContext();

  const fileRef = useRef();

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo Documento');
      if (!fRef.files[0]) onCancel();
      else setMediaForID('file', fRef.files[0]).then(onChange).catch(onCancel);
    };
    fRef.oncancel = onCancel;
    fRef.click();
  };

  const updateMedia = (key) => {
    const toastId = toast.loading('Esperando por la seleccion del Archivo');
    UseFileRefForUpload(
      (fileUrl) => {
        api_updateStyle(key, { value: fileUrl }, dataAuth.token)
          .then(() => {
            toast.update(toastId, {
              data,
              render: 'Media subida correctamente',
              type: 'warning',
              isLoading: false,
              autoClose: 5000,
            });
            refetch();
          })
          .catch(() =>
            toast.update(toastId, {
              render: 'Error al subir la Media',
              type: 'error',
              isLoading: false,
              autoClose: 5000,
            })
          );
      },
      () => {
        toast.update(toastId, {
          render: 'Error al subir la Media',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
      }
    );
  };

  return (
    <>
      <Helmet>
        <title> Website Media | Javer </title>
      </Helmet>

      <input className="hidden-file" type="file" ref={fileRef} />
      {isLoading ? (
        <LoadingSpiner />
      ) : (
        <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Administrar Media
          </Typography>
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
                {(data || [])
                  .filter((item) => enabledMedia.includes(item.key))
                  .map((item) => (
                    <DocumentsTableRow
                      key={item.id}
                      name={item.name}
                      itemKey={item.key}
                      alt={item.alt_text}
                      onOpen={() => window.open(item.value)}
                      onEdit={() => updateMedia(item.key)}
                    />
                  ))}
              </TableBody>
            </Table>
          </Card>
        </Container>
      )}
    </>
  );
}
