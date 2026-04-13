import PropTypes from 'prop-types';

import { Grid, Switch, Typography, FormControlLabel } from '@mui/material';

export const Outstanding = ({ dataProject, setDataProject }) => (
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
      <Typography variant="h7">Hacer desarrollo destacado</Typography>

      <FormControlLabel
        control={
          <Switch
            checked={dataProject.outstanding === 1}
            onChange={(e) =>
              setDataProject((prevState) => ({
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
  dataProject: PropTypes.object.isRequired,
  setDataProject: PropTypes.func.isRequired,
};
