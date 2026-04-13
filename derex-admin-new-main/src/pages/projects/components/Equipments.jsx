import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import { Box, Grid, Button, TextField, Typography } from '@mui/material';

import Iconify from 'src/components/iconify/iconify';

export const Equipments = ({ equipmentInitialData, onEquipmentChange }) => {
  const [saving, setSaving] = useState(false);
  const [equipment, setNewEquipment] = useState({
    name: '',
    name_eng: '',
  });
  const [equipmentsArray, setEquipmentsArray] = useState([]);

  useEffect(() => {
    onEquipmentChange(equipmentsArray);
  }, [equipmentsArray]);

  useEffect(() => {
    if (
      equipmentInitialData?.equipment &&
      equipmentInitialData?.equipment?.sp &&
      equipmentInitialData?.equipment?.sp.length
    ) {
      const equipArrays = [];
      const objectToIterate = equipmentInitialData.equipment;
      for (let idx = 0; idx < objectToIterate.sp.length; idx += 1) {
        equipArrays.push({
          name: objectToIterate.sp[idx],
          name_eng: objectToIterate.en[idx],
        });
      }
      setEquipmentsArray(equipArrays);
    }
  }, [equipmentInitialData]);

  const saveEquipment = async () => {
    setSaving(true);

    try {
      toast.success('Nuevo equipamento agregado exitosamente');

      setNewEquipment({ name: '', image: '', name_eng: '' });

      setEquipmentsArray((prevState) => [
        ...prevState,
        {
          name: equipment.name,
          name_eng: equipment.name_eng,
        },
      ]);

      setSaving(false);
    } catch (error) {
      toast.error('Error al agregar un nuevo equipamento');
      setSaving(false);
    }
  };

  const onDeleteEquipment = (index) => {
    const equipmentUpdated = equipmentsArray.filter((_, idx) => idx !== index);

    setEquipmentsArray(equipmentUpdated);

    toast.success('El equipamento ha sido eliminada exitosamente');
  };

  return (
    <Grid container columnSpacing={2} rowSpacing={2} height="max-content">
      <Grid item xs={12} display="flex" alignItems="center">
        <Typography variant="h5">Equipamiento</Typography>
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
            value={equipment.name}
            label="Nombre de equipamiento"
            onChange={(e) => {
              setNewEquipment((prevState) => ({
                ...prevState,
                name: e.target.value,
              }));
            }}
            variant="outlined"
          />

          <TextField
            fullWidth
            value={equipment.name_eng}
            label="Nombre de equipamiento en ingles"
            onChange={(e) => {
              setNewEquipment((prevState) => ({
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
            disabled={equipment.name.length < 3 || equipment.name_eng.length < 3 || saving}
            onClick={saveEquipment}
          >
            Guardar
          </Button>
        </Box>
      </Grid>

      {equipmentsArray.map((item, idx) => (
        <Grid item xs={3} key={idx} height="max-content">
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
            <Button onClick={() => onDeleteEquipment(idx)}>
              <Iconify width={24} icon="mdi:bin" />
            </Button>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

Equipments.propTypes = {
  equipmentInitialData: PropTypes.object.isRequired,
  onEquipmentChange: PropTypes.func.isRequired,
};
