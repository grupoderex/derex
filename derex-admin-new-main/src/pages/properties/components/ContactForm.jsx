import PropTypes from 'prop-types';

import { Grid, TextField, Typography } from '@mui/material';

export const ContactForm = ({ dataProperty, setDataProperty }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let { contact_form } = dataProperty;
    if (contact_form == null) contact_form = {};

    contact_form[name] = value;

    setDataProperty((prevState) => ({
      ...prevState,
      contact_form,
    }));
  };

  return (
    <Grid item container columnSpacing={4} rowSpacing={2} xs={12}>
      <Grid item xs={12}>
        <Typography variant="h5">Formulario de contacto</Typography>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
        <Grid item xs={5.9}>
          <TextField
            fullWidth
            name="phone_number"
            value={dataProperty?.contact_form?.phone_number}
            onChange={handleInputChange}
            label="Teléfono de contacto"
            variant="outlined"
            required
          />
        </Grid>

        <Grid item xs={5.9}>
          <TextField
            fullWidth
            name="opening_hours"
            value={dataProperty?.contact_form?.opening_hours}
            onChange={handleInputChange}
            label="Horarios de casetas"
            variant="outlined"
            required
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

ContactForm.propTypes = {
  setDataProperty: PropTypes.func.isRequired,
  dataProperty: PropTypes.object.isRequired,
};
