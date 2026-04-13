import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import { Box, Grid, Button, TextField, Typography } from '@mui/material';

import Iconify from 'src/components/iconify/iconify';

export const InterestsZones = ({ interestZoneInitialData, onInterestZoneChange }) => {
  const [saving, setSaving] = useState(false);
  const [interestZone, setNewInterestZone] = useState({
    name: '',
    name_eng: '',
  });
  const [interestArray, setInterestArray] = useState([]);

  useEffect(() => {
    onInterestZoneChange(interestArray);
  }, [interestArray]);

  useEffect(() => {
    if (
      interestZoneInitialData?.interest_area?.sp &&
      interestZoneInitialData?.interest_area?.sp.length
    ) {
      const interestArrays = [];
      const objectToIterate = interestZoneInitialData.interest_area;
      for (let idx = 0; idx < objectToIterate.sp.length; idx += 1) {
        interestArrays.push({
          name: objectToIterate.sp[idx],
          name_eng: objectToIterate.en[idx],
        });
      }
      setInterestArray(interestArrays);
    }
  }, [interestZoneInitialData]);

  const saveInterestZone = async () => {
    setSaving(true);

    try {
      toast.success('Nueva zona de interés agregada exitosamente');

      setNewInterestZone({ name: '', image: '', name_eng: '' });

      setInterestArray((prevState) => [
        ...prevState,
        {
          name: interestZone.name,
          name_eng: interestZone.name_eng,
        },
      ]);

      setSaving(false);
    } catch (error) {
      toast.error('Error al agregar una nueva zona de interés');
      setSaving(false);
    }
  };

  const onDeleteInterestZone = (index) => {
    const interesZoneUpdated = interestArray.filter((_, idx) => idx !== index);

    setInterestArray(interesZoneUpdated);

    toast.success('La zona de interés ha sido eliminada exitosamente');
  };

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={12} display="flex" alignItems="center">
        <Typography variant="h5">Zonas de interés</Typography>
      </Grid>

      <Grid item xs={3} minHeight={180}>
        <Box
          height="100%"
          minHeight={180}
          m={1}
          p={1}
          borderRadius="0.5rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            sx={{ mb: 1 }}
            fullWidth
            value={interestZone.name}
            label="Nombre de zona de interés"
            onChange={(e) => {
              setNewInterestZone((prevState) => ({
                ...prevState,
                name: e.target.value,
              }));
            }}
            variant="outlined"
          />

          <TextField
            fullWidth
            value={interestZone.name_eng}
            label="Nombre de zona de interés en ingles"
            onChange={(e) => {
              setNewInterestZone((prevState) => ({
                ...prevState,
                name_eng: e.target.value,
              }));
            }}
            variant="outlined"
          />

          <Button
            sx={{ my: 1 }}
            variant="contained"
            color="secondary"
            fullWidth
            disabled={interestZone.name.length < 3 || interestZone.name_eng.length < 3 || saving}
            onClick={saveInterestZone}
          >
            Guardar
          </Button>
        </Box>
      </Grid>

      {interestArray.map((item, idx) => (
        <Grid item xs={3} key={idx}>
          <Box
            minHeight={180}
            height="100%"
            m={1}
            p={1}
            sx={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
            borderRadius="0.5rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography textAlign="center">{item.name}</Typography>
            <Typography textAlign="center">{item.name_eng}</Typography>
            <Button onClick={() => onDeleteInterestZone(idx)}>
              <Iconify width={24} icon="mdi:bin" />
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

InterestsZones.propTypes = {
  interestZoneInitialData: PropTypes.object.isRequired,
  onInterestZoneChange: PropTypes.func.isRequired,
};
