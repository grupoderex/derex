import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { Grid, Switch, TextField, Typography } from '@mui/material';

export const UrgencyChipForm = ({ urgencyChipData, setUrgencyChip }) => {
  const [isActive, setActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUrgencyChip((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const toastId = toast.loading('Estado de la chip de urgencia');

    const { checked } = e.target;
    setUrgencyChip((prevState) => ({
      ...prevState,
      is_active: checked,
    }));

    setActive(checked);

    toast.update(toastId, {
      render: checked ? 'Chip activada correctamente' : 'Chip desactivada correctamente',
      type: 'success',
      isLoading: false,
      autoClose: 5000,
    });
  };

  useEffect(() => {
    if (urgencyChipData !== null) {
      setActive(urgencyChipData.is_active);
    }
  }, [urgencyChipData]);

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Grid item xs={2} display="flex" alignItems="center">
          <Typography variant="h4">Chip</Typography>

          <Switch
            checked={isActive}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Grid>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="description_es"
            inputProps={{ maxLength: 30 }}
            value={urgencyChipData?.description_es}
            onChange={handleInputChange}
            label="Descripción en español"
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            inputProps={{ maxLength: 30 }}
            name="description_en"
            value={urgencyChipData?.description_en}
            onChange={handleInputChange}
            label="Descripción en inglés"
            variant="outlined"
            required
          />
        </Grid>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            inputProps={{ maxLength: 250 }}
            name="notification_text_es"
            value={urgencyChipData?.notification_text_es}
            onChange={handleInputChange}
            label="Notificación en español"
            variant="outlined"
            multiline
            rows={4}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            inputProps={{ maxLength: 250 }}
            name="notification_text_en"
            value={urgencyChipData?.notification_text_en}
            onChange={handleInputChange}
            label="Notificación en ingles"
            variant="outlined"
            multiline
            rows={4}
            required
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

UrgencyChipForm.propTypes = {
  urgencyChipData: PropTypes.object.isRequired,
  setUrgencyChip: PropTypes.func.isRequired,
};
