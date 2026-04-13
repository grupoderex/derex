import PropTypes from 'prop-types';

import { Grid, Switch, Typography, FormControlLabel } from '@mui/material';

export const EdgeCertified = ({ dataProperty, setDataProperty }) => (
  <Grid container rowSpacing={2}>
    <Grid
      item
      container
      direction="row"
      gap={3}
      alignItems="center"
      justifyContent="flex-end"
      xs={12}
    >
      <Typography variant="h7">Habilita o deshabilita el certificado edge</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={dataProperty.isEdgeCertified === 1}
            onChange={(e) =>
              setDataProperty((prevState) => ({
                ...prevState,
                isEdgeCertified: e.target.checked ? 1 : 0,
              }))
            }
          />
        }
      />
    </Grid>
  </Grid>
);

EdgeCertified.propTypes = {
  dataProperty: PropTypes.object.isRequired,
  setDataProperty: PropTypes.func.isRequired,
};
