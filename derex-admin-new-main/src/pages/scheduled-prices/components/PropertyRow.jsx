import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useState, useEffect, useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Grid, Button, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { ActionDialogComponent } from '../../../components/Dialogs/ActionDialog';

const deleteDialogContent = {
  title: '¿Estás seguro que quieres eliminar la programación actual?',
  text: 'Remover la programación evitará que cuando el plazo se cumpla se actualice la información',
  btnTitle: 'Eliminar',
};

dayjs.extend(utc);
dayjs.extend(timezone);

export function PropertyRow({ property, setPropertyPrice }) {
  const [dataProperty] = useState(property);

  const {
    id,
    name,
    price_base = 0,
    price_m2_ext = 0,
    new_price_base = 0,
    new_price_m2_ext = 0,
    effective_datetime,
  } = dataProperty;

  const [editBaseValue, setEditBaseValue] = useState(new_price_base);
  const [editFloorValue, setEditFloorValue] = useState(new_price_m2_ext);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Inicializar fecha/hora si ya existe
  useEffect(() => {
    if (effective_datetime) {
      const dt = dayjs(effective_datetime);
      setSelectedDate(dt);
      setSelectedTime(dt);
    }
  }, [effective_datetime]);

  const combineDateTime = useCallback((date, time) => {
    if (!date || !time) return null;

    // Creamos un objeto dayjs con la fecha seleccionada, en la zona local
    const localDate = dayjs(date).local();

    // Luego le ponemos la hora seleccionada
    const combined = localDate.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);

    // Retorna formato YYYY-MM-DD HH:mm:ss (hora local, sin conversión a UTC)
    return combined.format('YYYY-MM-DD HH:mm:ss');
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleNewPrice = (e) => {
    setEditBaseValue(e);
  };

  const handleNewFloor = (e) => {
    setEditFloorValue(e);
  };

  const openDeleteDialog = () => setShowDeleteDialog(true);
  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const confirmDelete = () => {
    const combined = combineDateTime(selectedDate, selectedTime);
    const bodySchedule = {
      prices_list_property_id: id,
      new_price_base: Number(editBaseValue),
      new_price_m2_ext: Number(editFloorValue),
      effective_datetime: combined ?? null,
    };
    setPropertyPrice(bodySchedule, 'delete');
    setEditBaseValue(0);
    setEditFloorValue(0);
    setSelectedDate(null);
    setSelectedTime(null);

    closeDeleteDialog();
  };

  const handleConfirmNewScheduled = () => {
    const combined = combineDateTime(selectedDate, selectedTime);
    const bodySchedule = {
      prices_list_property_id: id,
      new_price_base: Number(editBaseValue),
      new_price_m2_ext: Number(editFloorValue),
      effective_datetime: combined ?? null,
    };
    setPropertyPrice(bodySchedule, 'edit');
  };

  return (
    <div>
      <Grid container flexDirection="column" gap={2} width={300}>
        <Grid item sx={{ width: 300 }}>
          <Typography fontSize={18} fontWeight={700}>
            {name ?? 'Sin nombre'}
          </Typography>
        </Grid>
        <Grid container sx={{ width: 300 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <p>Precio base actual: {price_base}</p>
            <p>Precio base m2: {price_m2_ext}</p>
          </Box>
        </Grid>

        <Grid container sx={{ width: 300 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
            }}
          >
            <TextField
              label="Próximo precio"
              type="number"
              value={editBaseValue}
              onChange={(e) => handleNewPrice(e.target.value)}
              inputProps={{ min: 0 }}
              autoFocus
            />

            <TextField
              label="Próximo precio m2"
              type="number"
              value={editFloorValue}
              onChange={(e) => handleNewFloor(e.target.value)}
              inputProps={{ min: 0 }}
              autoFocus
            />
          </Box>
        </Grid>

        <Grid item sx={{ width: 300 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Fecha" value={selectedDate} onChange={handleDateChange} />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker label="Hora" value={selectedTime} onChange={handleTimeChange} />
            </LocalizationProvider>
          </Box>
        </Grid>

        <Grid item sx={{ width: 300 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
            }}
          >
            <Button
              sx={{ width: 150 }}
              color="error"
              onClick={(ev) => {
                ev.stopPropagation();
                openDeleteDialog();
              }}
            >
              Remover
            </Button>

            <Button
              sx={{ width: 150 }}
              variant="contained"
              onClick={(ev) => {
                ev.stopPropagation();
                handleConfirmNewScheduled();
              }}
            >
              Guardar
            </Button>
          </Box>
        </Grid>
      </Grid>

      <ActionDialogComponent
        open={showDeleteDialog}
        content={deleteDialogContent}
        setOpen={closeDeleteDialog}
        setConfirm={confirmDelete}
        element={property}
      />
    </div>
  );
}

PropertyRow.propTypes = {
  property: PropTypes.object.isRequired,
  setPropertyPrice: PropTypes.func.isRequired,
};
