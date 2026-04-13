import PropTypes from 'prop-types';

import { Grid, Switch, Typography, FormControlLabel } from '@mui/material';

export const Presale = ({ dataProject, setDataProject }) => (
  <Grid container rowSpacing={2} marginTop={3} justifyContent="flex-end">
    <Grid
      item
      container
      direction="row"
      gap={3}
      alignItems="center"
      justifyContent="flex-end"
      xs={12}
    >
      <Typography variant="h7">Hacer preventa</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={dataProject.is_presale}
            onChange={(e) =>
              setDataProject((prevState) => ({
                ...prevState,
                is_presale: e.target.checked,
              }))
            }
          />
        }
      />
    </Grid>
  </Grid>
);

Presale.propTypes = {
  dataProject: PropTypes.object.isRequired,
  setDataProject: PropTypes.func.isRequired,
};
