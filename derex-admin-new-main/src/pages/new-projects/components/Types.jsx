import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Grid, Select, MenuItem, InputLabel } from '@mui/material';

const listTypes = [
  { id: 1, name: 'vertical', value: 'vertical' },
  { id: 2, name: 'horizontal', value: 'horizontal' },
  { id: 3, name: 'mixto', value: 'mixed' },
];

export const TypesProject = ({ onFormChange, initialType }) => {
  const [selectedType, setSelectedType] = useState(undefined);

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  const handleInputChange = (value) => {
    const updateFormType = {
      type: value,
    };

    setSelectedType(value);
    onFormChange(updateFormType);
  };

  return (
    <Grid container columnSpacing={4} rowSpacing={2}>
      {listTypes && (
        <Grid item xs={6}>
          <InputLabel sx={{ mb: 1 }}>Tipo de proyecto:</InputLabel>
          <Select
            fullWidth
            name=""
            value={selectedType || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            required
          >
            {listTypes.map((item) => (
              <MenuItem key={item.id} value={item.value}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      )}
    </Grid>
  );
};

TypesProject.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  initialType: PropTypes.number.isRequired,
};
