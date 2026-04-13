import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
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

import { api_getAllDocuments, api_setPdfForID, api_updateDocument } from 'src/data/APICalls';
import useAppContext from 'src/data/DataProvider';

import LoadingSpiner from 'src/components/loading';
import DocumentsTableRow from 'src/components/tables/documents-table-row';

export default function DocumentsPage () {
  const { data, isLoading, refetch } = useQuery('documents', api_getAllDocuments);
  const { dataAuth } = useAppContext();

  const fileRef = useRef();

  const UseFileRefForUpload = (onChange, onCancel) => {
    const fRef = fileRef.current;
    fRef.onchange = () => {
      toast.info('Subiendo Documento');
      if (!fRef.files[0]) onCancel();
      else api_setPdfForID(fRef.files[0], dataAuth.token).then(onChange).catch(onCancel);
    };
    fRef.oncancel = onCancel;
    fRef.click();
  };

  const updateDocument = (documentId) => {
    const toastId = toast.loading('Esperando por la seleccion del Archivo');
    UseFileRefForUpload(
      (fileUrl) => {
        api_updateDocument(documentId, { url: fileUrl }, dataAuth.token)
          .then(() => {
            toast.update(toastId, {
              render: 'Documento subido correctamente',
              type: 'warning',
              isLoading: false,
              autoClose: 5000,
            });
            refetch();
          })
          .catch(() =>
            toast.update(toastId, {
              render: 'Error al subir el Documento',
              type: 'error',
              isLoading: false,
              autoClose: 5000,
            })
          );
      },
      () => {
        toast.update(toastId, {
          render: 'Error al subir el Documento',
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
        <title> Documentos | Derex </title>
      </Helmet>

      <input className="hidden-file" type="file" ref={fileRef} />
      {isLoading ? (
        <LoadingSpiner />
      ) : (
        <Container>
          <Typography variant="h4" sx={{ my: 5 }}>
            Contratos de Adhesión
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
                {(data?.contratosAdhesion || []).map((item) => (
                  <DocumentsTableRow
                    key={item.id}
                    name={item.name}
                    onOpen={() => window.open(item.url)}
                    onEdit={() => updateDocument(item.id)}
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
