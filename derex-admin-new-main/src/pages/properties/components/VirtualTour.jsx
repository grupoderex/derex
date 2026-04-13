import PropTypes from 'prop-types';

import { Grid, TextField, Typography } from '@mui/material';

export const VirtualTour = ({ dataProperty, setDataProperty }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setDataProperty((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Grid item container columnSpacing={4} rowSpacing={2} xs={12}>
      <Grid item xs={12} display="flex" alignItems="center">
        <Typography variant="h5">Tour virtual (iframe)</Typography>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center">
        <TextField
          fullWidth
          multiline
          name="virtual_tour_iframe"
          value={dataProperty?.virtual_tour_iframe}
          onChange={handleInputChange}
          label="Tour virtual"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

VirtualTour.propTypes = {
  setDataProperty: PropTypes.func.isRequired,
  dataProperty: PropTypes.object.isRequired,
};
