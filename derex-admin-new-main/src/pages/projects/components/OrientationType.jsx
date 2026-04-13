import PropTypes from 'prop-types';

import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';

export function OrientationType ({
  orientationType = 'vertical',
  verticalData = { departments: 0, levels: 0 },
  onOrientationTypeChange,
  onVerticalDataChange,
}) {
  return (
    <div
      style={{
        marginBottom: '2rem',
      }}
    >
      <h4>Selecciona el tipo de desarrollo del proyecto</h4>
      <RadioGroup
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
        }}
        value={orientationType}
        onChange={(e) => {
          onOrientationTypeChange(e.target.value);
        }}
      >
        <FormControlLabel value="horizontal" control={<Radio />} label="Desarrollo Horizontal" />
        <FormControlLabel value="vertical" control={<Radio />} label="Desarrollo Vertical" />
        <FormControlLabel value="mixed" control={<Radio />} label="Desarrollo Mixto" />
        <FormControlLabel value="previous" control={<Radio />} label="Proyecto Anterior" />
      </RadioGroup>

      {(orientationType === 'vertical' || orientationType === 'mixed') && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            width: '100%',
            marginTop: '2rem',
          }}
        >
          <TextField
            label="No. de departamentos"
            type="number"
            variant="outlined"
            fullWidth
            value={verticalData?.departments}
            onChange={(e) => {
              onVerticalDataChange({
                ...verticalData,
                departments: e.target.value,
              });
            }}
          />
          <TextField
            label="Niveles (Pisos)"
            type="number"
            variant="outlined"
            fullWidth
            value={verticalData?.levels}
            onChange={(e) => {
              onVerticalDataChange({
                ...verticalData,
                levels: e.target.value,
              });
            }}
          />
        </div>
      )}
    </div>
  );
}

OrientationType.propTypes = {
  orientationType: PropTypes.string.isRequired,
  onOrientationTypeChange: PropTypes.func.isRequired,
  verticalData: PropTypes.shape({
    departments: PropTypes.number,
    levels: PropTypes.number,
  }),
  onVerticalDataChange: PropTypes.func,
};
