import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';

import { Grid, Select, MenuItem, InputLabel } from '@mui/material';

import { api_getAllCities } from 'src/data/APICalls';
import { api_getAllStates } from 'src/data/statesApiCalls/states';

export const StatesAndCities = ({ dataProject, onFormChange, onLoaderChange }) => {
  // const location = useLocation();
  const { data: statesList } = useQuery('states', api_getAllStates);
  const { data: citiesList } = useQuery('cities', api_getAllCities);
  const [selectedState, setSelectedState] = useState(dataProject.state_id);
  const [selectedCity, setSelectedCity] = useState(dataProject.city_id);

  const handleInputChange = (e) => {
    const { value } = e.target;
    const updatedFormState = {
      city_id: value,
      state_id: selectedState,
    };
    setSelectedCity(e.target.value);
    onFormChange(updatedFormState);
  };

  const handleStateChange = (e) => {
    const { value } = e.target;

    const updatedFormState = {
      state_id: value,
      city_id: undefined,
    };
    setSelectedState(e.target.value);
    setSelectedCity(() => undefined);

    onFormChange(updatedFormState);
  };

  /* TODO  useEffect(() => {
    onLoaderChange(loadingStates, loadingCities);
  }, [loadingStates, loadingCities]); */

  useEffect(() => {
    if (citiesList && statesList && dataProject.city_id) {
      const city = citiesList.find((item) => item.id === dataProject.city_id);
      setSelectedState(city.id_state);
      setSelectedCity(city.id);

      const updatedFormState = {
        city_id: city?.id,
        state_id: city?.id_state,
      };

      onFormChange(updatedFormState);
    }
  }, [citiesList, statesList, dataProject, onFormChange]);

  return (
    <Grid container columnSpacing={4} rowSpacing={2}>
      {statesList && (
        <Grid item xs={6}>
          <InputLabel sx={{ mb: 1 }}>Estado:</InputLabel>
          <Select
            fullWidth
            name=""
            value={selectedState || ''}
            onChange={handleStateChange}
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
      {selectedState !== null && selectedState !== 0 && citiesList?.length > 0 && (
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
  dataProject: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onLoaderChange: PropTypes.func.isRequired,
};
