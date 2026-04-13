import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Grid, Select, MenuItem, InputLabel } from '@mui/material';

import { api_getAllCities } from 'src/data/APICalls';
import { api_getAllStates } from 'src/data/statesApiCalls/states';

export const StatesAndCities = ({ initialCity, onFormChange, onLoaderChange }) => {
  const location = useLocation();
  const { data: statesList, isLoading: loadingStates } = useQuery('states', api_getAllStates);
  const { data: citiesList, isLoading: loadingCities } = useQuery('cities', api_getAllCities);
  const [selectedState, setSelectedState] = useState(undefined);
  const [selectedCity, setSelectedCity] = useState(location.state?.id_city);
  const handleInputChange = (e) => {
    const { value } = e.target;

    const updatedFormState = {
      id_city: value,
      ciudad: citiesList.find((item) => item.id === value)?.name,
    };

    setSelectedCity(e.target.value);

    onFormChange(updatedFormState);
  };

  /* TODO  useEffect(() => {
    onLoaderChange(loadingStates, loadingCities);
  }, [loadingStates, loadingCities]); */

  useEffect(() => {
    if (citiesList && statesList && initialCity) {
      const city = citiesList.find((item) => item.id === initialCity);
      setSelectedState(city.id_state);
      setSelectedCity(city.id);

      const updatedFormState = {
        id_city: city?.id,
        ciudad: city?.name,
      };

      onFormChange(updatedFormState);
    }
  }, [citiesList, statesList, initialCity]);

  return (
    <Grid container columnSpacing={4} rowSpacing={2}>
      {statesList && (
        <Grid item xs={6}>
          <InputLabel sx={{ mb: 1 }}>Estado:</InputLabel>
          <Select
            fullWidth
            name=""
            value={selectedState || ''}
            onChange={(e) => setSelectedState(e.target.value)}
            required
          >
            {statesList.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      )}
      {selectedState && citiesList && (
        <Grid item xs={6}>
          <InputLabel sx={{ mb: 1 }}>Ciudad:</InputLabel>
          <Select fullWidth value={selectedCity || ''} onChange={handleInputChange} required>
            {citiesList
              .filter((value) => value.id_state === selectedState)
              .map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </Grid>
      )}
    </Grid>
  );
};

StatesAndCities.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  onLoaderChange: PropTypes.func.isRequired,
  initialCity: PropTypes.number.isRequired,
};
