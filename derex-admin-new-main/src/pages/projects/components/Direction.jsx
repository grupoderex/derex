import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Grid, Input, Typography } from '@mui/material';

const initialState = {
  calle: '',
  colonia: '',
  cp: '',
  latitud: '19.5',
  longitud: '-99',
  link_map: '',
  wase_link_map: '',
};

export const Direction = ({ directionInitialData, onFormChange }) => {
  const [directionData, setDirectionData] = useState({
    ...initialState,
  });

  useEffect(() => {
    if (directionInitialData && directionInitialData.calle) {
      const { calle, colonia, cp, latitud, longitud, link_map, wase_link_map } =
        directionInitialData;
      setDirectionData({ calle, colonia, cp, latitud, longitud, link_map, wase_link_map });
    }
  }, [directionInitialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedFormState = {
      ...directionData,
      [name]: value,
    };

    setDirectionData(updatedFormState);

    onFormChange(updatedFormState);
  };

  return (
    <Grid container columnSpacing={4} rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Dirección</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography mr={2}>Calle</Typography>
        <Input
          fullWidth
          name="calle"
          value={directionData?.calle}
          onChange={handleInputChange}
          type="text"
          required
        />
      </Grid>
      <Grid item xs={3}>
        <Typography mr={2}>Colonia</Typography>
        <Input
          fullWidth
          name="colonia"
          value={String(directionData.colonia)}
          onChange={handleInputChange}
          type="text"
          required
        />
      </Grid>
      <Grid item xs={3}>
        <Typography mr={2}>Código postal</Typography>
        <Input
          fullWidth
          name="cp"
          value={directionData?.cp}
          onChange={handleInputChange}
          type="text"
          required
        />
      </Grid>
      <Grid item xs={3}>
        <Typography mr={2}>Latitud</Typography>
        <Input
          fullWidth
          name="latitud"
          value={directionData?.latitud}
          onChange={handleInputChange}
          type="number"
          required
        />
      </Grid>
      <Grid item xs={3}>
        <Typography mr={2}>Longitud</Typography>
        <Input
          fullWidth
          name="longitud"
          value={directionData?.longitud}
          onChange={handleInputChange}
          type="number"
          required
        />
      </Grid>
      <Grid item xs={6}>
        <Typography mr={2}>Link Google Maps</Typography>
        <Input
          fullWidth
          name="link_map"
          value={directionData?.link_map}
          onChange={handleInputChange}
          type="text"
          min={1}
          required
        />
      </Grid>
      <Grid item xs={6}>
        <Typography mr={2}>Link Waze</Typography>
        <Input
          fullWidth
          name="wase_link_map"
          value={directionData?.wase_link_map}
          onChange={handleInputChange}
          type="text"
          min={1}
          required
        />
      </Grid>
    </Grid>
  );
};

Direction.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  directionInitialData: PropTypes.object.isRequired,
};
