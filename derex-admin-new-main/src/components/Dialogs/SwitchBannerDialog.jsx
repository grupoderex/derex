import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import utc from 'dayjs/plugin/utc';
import { toast } from 'react-toastify';
import timezone from 'dayjs/plugin/timezone';
import { useRef, useState, useEffect, useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_getBannerScheduled } from 'src/data/APICalls';

dayjs.extend(utc);
dayjs.extend(timezone);

export function SwitchBannerDialogComponent({ open, content, setOpen, setConfirm }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { dataAuth, setMediaForID } = useAppContext();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data } = await api_getBannerScheduled(content.data.project_id, dataAuth.token);

      if (data.effective_datetime !== null) {
        const dt = dayjs(data.effective_datetime);
        setSelectedDate(dt);
        setSelectedTime(dt);
      }

      if (data.new_banner_url !== null) {
        setSelectedFile(data.new_banner_url);
        setPreviewUrl(data.new_banner_url);
      }
    }

    if (open) {
      fetchData();
    }
  }, [content, open, dataAuth]);

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato no permitido. Usa jpg, jpeg, png o webp');
      return;
    }

    // Llamada a helper/context para subir y obtener URL (si existe)
    setMediaForID('file', file)
      .then((data) => {
        setPreviewUrl(data);
        setSelectedFile(data);
      })
      .catch(() => {
        toast.error('Error al subir la imagen del banner');
      });
  };

  const handleConfirm = () => {
    const combined = combineDateTime(selectedDate, selectedTime);
    const elementChanged = {
      project_id: content.data.project_id,
      new_banner_url: selectedFile,
      effective_datetime: combined,
    };
    setConfirm({ elementChanged });
    setOpen(false);
  };

  const handlingClearData = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setSelectedDate(null);
    setSelectedTime(null);

    const elementChanged = {
      project_id: content.data.project_id,
      new_banner_url: null,
      effective_datetime: null,
    };
    setConfirm({ elementChanged });
    setOpen(false);
  };

  const combineDateTime = useCallback((date, time) => {
    if (!date || !time) return null;

    // Creamos un objeto dayjs con la fecha seleccionada, en la zona local
    const localDate = dayjs(date).local();

    // Luego le ponemos la hora seleccionada
    const combined = localDate.hour(time.hour()).minute(time.minute()).second(0).millisecond(0);

    // Convertimos a ISO string (manteniendo la zona local)
    return combined.toISOString();
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography textAlign="center" fontSize={28} fontWeight={700}>
          {content.title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography textAlign="center" mb={2} fontSize={16} fontWeight={600}>
          {content.text}
        </Typography>

        {previewUrl && (
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src={previewUrl}
              alt="Previsualización"
              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="center" height={50} gap={1} mb={2}>
          <Button variant="outlined" onClick={() => fileInputRef.current.click()}>
            Cambiar imagen
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            hidden
            onChange={handleImageChange}
          />
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width={300}
          margin="auto"
          height={100}
          gap={1}
          tabIndex={0}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Fecha" value={selectedDate} onChange={(ev) => setSelectedDate(ev)} />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker label="Hora" value={selectedTime} onChange={(ev) => setSelectedTime(ev)} />
          </LocalizationProvider>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="text"
          color="error"
          onClick={() => {
            handlingClearData();
          }}
        >
          Eliminar
        </Button>
        <Button onClick={() => setOpen(false)}>Cancelar</Button>
        <Button color="error" onClick={handleConfirm} disabled={!selectedFile}>
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SwitchBannerDialogComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  content: PropTypes.shape({
    title: PropTypes.string,
    text: PropTypes.string,
    data: PropTypes.any,
  }),
  setConfirm: PropTypes.func.isRequired,
};
