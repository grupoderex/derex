import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

import { Box, Grid, Select, MenuItem, InputLabel, CircularProgress } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_getProjectsByState } from 'src/data/APICalls';
import { api_getAllStates } from 'src/data/statesApiCalls/states';

import DevelopmentsByState from './components/DevelopmentByState';

export default function PriceScheduled() {
  const { dataAuth } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const stateId = searchParams.get('stateId');
  const developmentId = searchParams.get('developmentId');

  const { data: statesList = [] } = useQuery('states', api_getAllStates, {
    onError: () => toast.error('Error al obtener los estados'),
  });

  const selectedState = stateId ? Number(stateId) : null;

  const {
    data: developments = [],
    isLoading,
    refetch,
  } = useQuery(
    ['developments', selectedState],
    () => api_getProjectsByState(selectedState, dataAuth.token).then((res) => res.data),
    {
      enabled: !!selectedState,
      onError: () => toast.error('Error al obtener datos de los desarrollos'),
    }
  );

  const selectedDevelopment = useMemo(() => {
    if (!developmentId) return null;
    return developments.find((d) => d.project_id === Number(developmentId)) || null;
  }, [developmentId, developments]);

  const handleStateChange = (newStateId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('stateId', String(newStateId));
    params.delete('developmentId'); // limpia selección previa
    setSearchParams(params);
  };

  const handleDevelopmentChange = (developmentId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('developmentId', String(developmentId));
    setSearchParams(params);
  };

  let content;
  if (isLoading) {
    content = (
      <Grid item>
        <CircularProgress />
      </Grid>
    );
  } else if (selectedDevelopment) {
    content = (
      <Grid item>
        <Box mt={2}>
          <DevelopmentsByState development={selectedDevelopment} onDataUpdated={() => refetch()} />
        </Box>
      </Grid>
    );
  } else {
    content = (
      <Grid item>
        <p>Selecciona un desarrollo</p>
      </Grid>
    );
  }

  return (
    <div>
      <h2 className="mb-8">Programar precios</h2>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <InputLabel sx={{ mb: 1 }}>Selecciona un estado:</InputLabel>
              <Select
                fullWidth
                value={selectedState || ''}
                onChange={(e) => handleStateChange(Number(e.target.value))}
              >
                {statesList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {selectedState && (
              <Grid item xs={6}>
                <InputLabel sx={{ mb: 1 }}>Selecciona un desarrollo:</InputLabel>
                <Select
                  fullWidth
                  value={selectedDevelopment?.project_id || ''}
                  onChange={(e) => handleDevelopmentChange(Number(e.target.value))}
                >
                  {developments.map((item) => (
                    <MenuItem key={item.project_id} value={item.project_id}>
                      {item.project}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
          </Grid>
        </Grid>

        {content}
      </Grid>
    </div>
  );
}
