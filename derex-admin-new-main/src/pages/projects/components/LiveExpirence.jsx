import PropTypes from 'prop-types';

import { Grid, TextField, Typography } from '@mui/material';

export const LiveExpirence = ({ dataProject, setDataProject }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setDataProject((prevState) => ({
      ...prevState,
      [name]: value === '' ? null : value,
    }));
  };

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Vive la experiencia</Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          name="live_the_experience_description"
          value={dataProject?.live_the_experience_description}
          onChange={handleInputChange}
          label="Descripción vive la experiencia"
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          name="live_the_experience_description_en"
          value={dataProject?.live_the_experience_description_en}
          onChange={handleInputChange}
          label="Descripción vive la experiencia en inglés"
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          name="live_the_experience_url"
          value={dataProject?.live_the_experience_url}
          onChange={handleInputChange}
          label="Iframe de Vive la experiencia"
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
};

LiveExpirence.propTypes = {
  dataProject: PropTypes.object.isRequired,
  setDataProject: PropTypes.func.isRequired,
};
