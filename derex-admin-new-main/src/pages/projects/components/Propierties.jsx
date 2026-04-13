import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { Box, Grid, Table, Button, TableBody, Typography, TableContainer } from '@mui/material';

import Iconify from 'src/components/iconify/iconify';
import PropertyTableRow from 'src/components/tables/property-table-row';

export const Propierties = ({ id, projectProperties, onDeleteProperty }) => {
  const navigate = useNavigate();

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      {id !== 'new' && (
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5">Propiedades</Typography>

            <Button
              onClick={() => {
                navigate(`/property?idProject=${id}`);
              }}
              variant="contained"
              color="inherit"
              sx={{ mb: 3 }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Nueva Propiedad
            </Button>
          </Box>

          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableBody>
                {projectProperties.map((item) => (
                  <PropertyTableRow key={item.id} item={item} onClickDelete={onDeleteProperty} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </Grid>
  );
};

Propierties.propTypes = {
  onDeleteProperty: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  projectProperties: PropTypes.any.isRequired,
};
