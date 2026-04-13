import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { InputLabel } from '@mui/material';

export const LaunchDate = ({ dataProject, onLaunchChange }) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (dataProject.launch_date) {
      setValue(dayjs(dataProject.launch_date));
    }
  }, [dataProject]);

  const handleDateEvent = (ev) => {
    const formateada = dayjs(ev).format('YYYY/MM/DD');
    setValue(ev);
    onLaunchChange({
      ...dataProject,
      launch_date: formateada,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <InputLabel sx={{ mb: 1 }}>Fecha de lanzamiento:</InputLabel>
      <DatePicker value={value} onChange={(e) => handleDateEvent(e)} />
    </LocalizationProvider>
  );
};

LaunchDate.propTypes = {
  dataProject: PropTypes.object.isRequired,
  onLaunchChange: PropTypes.func.isRequired,
};
