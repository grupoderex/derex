import PropTypes from 'prop-types';

import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';

export function TitleInput ({
  label,
  titleEs,
  setTitleEs,
  titleEn,
  setTitleEn,
  isEnglishEnabled = true,
  style,
  setStyle,
  isStyleEnabled = true,
  errors,
  orientation = 'row',
  minRows = 1,
  disabled = false,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: orientation,
        gap: '16px',
      }}
    >
      <TextField
        label={`${label} (Español)`}
        type="text"
        style={{
          flexGrow: 1,
        }}
        multiline={minRows > 1}
        minRows={minRows}
        value={titleEs?.trim() ? titleEs : label ?? ''}
        onChange={(e) => setTitleEs(e.target.value)}
        error={!!errors?.value}
        helperText={errors?.value}
        disabled={disabled}
      />
      {isEnglishEnabled && (
        <TextField
          label={`${label} (Inglés)`}
          type="text"
          style={{
            flexGrow: 1,
          }}
          minRows={minRows}
          multiline={minRows > 1}
          value={titleEn?.trim() ? titleEn : label ?? ''}
          onChange={(e) => setTitleEn(e.target.value)}
          error={!!errors?.value_en}
          helperText={errors?.value_en}
          disabled={disabled}
        />
      )}
      <RadioGroup
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
        }}
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      >
        {isStyleEnabled && (
          <>
            <FormControlLabel
              control={<Radio />}
              label="Borde"
              value="border"
              checked={style === 'border'}
              disabled={disabled}
            />
            <FormControlLabel
              control={<Radio />}
              label="Negritas"
              value="bold"
              checked={style === 'bold'}
              disabled={disabled}
            />
            <FormControlLabel
              control={<Radio />}
              label="Color"
              value="color"
              checked={style === 'color'}
              disabled={disabled}
            />
          </>
        )}
      </RadioGroup>
    </div>
  );
}

TitleInput.propTypes = {
  label: PropTypes.string,
  titleEs: PropTypes.string,
  setTitleEs: PropTypes.func,
  titleEn: PropTypes.string,
  setTitleEn: PropTypes.func,
  style: PropTypes.string,
  setStyle: PropTypes.func,
  errors: PropTypes.object,
  isStyleEnabled: PropTypes.bool,
  isEnglishEnabled: PropTypes.bool,
  orientation: PropTypes.string,
  minRows: PropTypes.number,
  disabled: PropTypes.bool,
};
