import PropTypes from 'prop-types';
import { useState } from 'react';

import { Grid, TextField, Typography } from '@mui/material';

export const ContactForm = ({ setDataProject, dataProject }) => {
  const [contactForm, setContactForm] = useState(dataProject.contact_form);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedFormState = { ...contactForm };

    if (name === 'opening_hours_es') {
      updatedFormState = {
        ...contactForm,
        opening_hours: {
          ...contactForm.opening_hours,
          es: value,
        },
      };
    }

    if (name === 'opening_hours_en') {
      updatedFormState = {
        ...contactForm,
        opening_hours: {
          ...contactForm.opening_hours,
          en: value,
        },
      };
    }

    if (name === 'phone_number') {
      updatedFormState = {
        ...contactForm,
        phone_number: value,
      };
    }

    setContactForm(updatedFormState);
    setDataProject({
      ...dataProject,
      contact_form: updatedFormState,
    });
  };

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12} display="flex" alignItems="center" mt={2}>
        <Typography variant="h4">Formulario de contacto</Typography>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="phone_number"
            value={contactForm?.phone_number}
            onChange={handleInputChange}
            label="Teléfono de contacto"
            variant="outlined"
            required
          />
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          name="opening_hours_es"
          value={contactForm?.opening_hours?.es}
          onChange={handleInputChange}
          label="Horarios de casetas en español"
          variant="outlined"
          required
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          name="opening_hours_en"
          value={contactForm?.opening_hours?.en}
          onChange={handleInputChange}
          label="Horarios de casetas en inglés"
          variant="outlined"
          required
        />
      </Grid>
    </Grid>
  );
};

ContactForm.propTypes = {
  setDataProject: PropTypes.func.isRequired,
  dataProject: PropTypes.object.isRequired,
};
