import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import { Box, Grid, Button, TextField, Typography } from '@mui/material';

import Iconify from 'src/components/iconify/iconify';

export const Features = ({ propertyInitialData, onFeaturesChanges }) => {
  const [saving, setSaving] = useState(false);
  const [feature, setNewFeature] = useState({
    name: '',
    name_eng: '',
  });
  const [featuresArray, setFeaturesArray] = useState([]);

  useEffect(() => {
    onFeaturesChanges(featuresArray);
  }, [featuresArray]);

  useEffect(() => {
    if (
      propertyInitialData?.features &&
      propertyInitialData?.features?.es &&
      propertyInitialData?.features?.es.length
    ) {
      const featuresArraysToSet = [];
      const objectToIterate = propertyInitialData.features;
      for (let idx = 0; idx < objectToIterate.es.length; idx += 1) {
        featuresArraysToSet.push({
          name: objectToIterate.es[idx],
          name_eng: objectToIterate.en[idx],
        });
      }
      setFeaturesArray(featuresArraysToSet);
    }
  }, [propertyInitialData]);

  const saveFeature = async () => {
    setSaving(true);

    try {
      toast.success('Nueva característica agregada exitosamente');

      setNewFeature({ name: '', image: '', name_eng: '' });

      setFeaturesArray((prevState) => [
        ...prevState,
        {
          name: feature.name,
          name_eng: feature.name_eng,
        },
      ]);

      setSaving(false);
    } catch (error) {
      toast.error('Error al agregar una nueva característica');
      setSaving(false);
    }
  };

  const onDeleteFeature = (index) => {
    const featureUpdated = featuresArray.filter((_, idx) => idx !== index);

    setFeaturesArray(featureUpdated);

    toast.success('La característica ha sido eliminada exitosamente');
  };

  return (
    <Grid container rowSpacing={2} columnSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Características</Typography>
      </Grid>

      <Grid item xs={3}>
        <Box
          height="100%"
          minHeight={180}
          borderRadius="0.5rem"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <TextField
            fullWidth
            value={feature.name}
            label="Nombre de la característica"
            onChange={(e) => {
              setNewFeature((prevState) => ({
                ...prevState,
                name: e.target.value,
              }));
            }}
            variant="outlined"
          />

          <TextField
            fullWidth
            value={feature.name_eng}
            label="Nombre de la característica en ingles"
            onChange={(e) => {
              setNewFeature((prevState) => ({
                ...prevState,
                name_eng: e.target.value,
              }));
            }}
            variant="outlined"
          />

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            disabled={feature.name.length < 3 || feature.name_eng.length < 3 || saving}
            onClick={saveFeature}
          >
            Guardar
          </Button>
        </Box>
      </Grid>

      {featuresArray.map((item, idx) => (
        <Grid item xs={3} key={idx}>
          <Box
            height="100%"
            minHeight={180}
            sx={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
            borderRadius="0.5rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography textAlign="center">{item.name}</Typography>
            <Typography textAlign="center">{item.name_eng}</Typography>
            <Button onClick={() => onDeleteFeature(idx)}>
              <Iconify width={24} icon="mdi:bin" />
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

Features.propTypes = {
  propertyInitialData: PropTypes.object.isRequired,
  onFeaturesChanges: PropTypes.func.isRequired,
};
