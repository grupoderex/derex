import PropTypes from 'prop-types';

import { Grid, Switch, Typography, FormControlLabel } from '@mui/material';

export const Outstanding = ({ dataProperty, setDataProperty }) => (
  <Grid container rowSpacing={2} justifyContent="flex-end">
    <Grid
      item
      container
      direction="row"
      gap={3}
      alignItems="center"
      justifyContent="flex-end"
      xs={12}
    >
      <Typography variant="h7">Hacer propiedad destacada</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={dataProperty.outstanding === 1}
            onChange={(e) =>
              setDataProperty((prevState) => ({
                ...prevState,
                outstanding: e.target.checked ? 1 : 0,
              }))
            }
          />
        }
      />
    </Grid>
  </Grid>
);

Outstanding.propTypes = {
  dataProperty: PropTypes.object.isRequired,
  setDataProperty: PropTypes.func.isRequired,
};
