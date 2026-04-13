import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  Grid,
  Select,
  Checkbox,
  MenuItem,
  InputLabel,
  Typography,
  ListItemText,
} from '@mui/material';

import { useCreditType } from '../Hooks/useCreditTypes';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const CreditTypes = ({ creditInitialData, onFormChange }) => {
  const [selectedCredits, setSelectedCredit] = useState([]);
  const { credits } = useCreditType(1, 100);

  useEffect(() => {
    if (
      creditInitialData.credit_types &&
      creditInitialData.credit_types.length &&
      credits &&
      credits.length
    ) {
      const initialsIds = creditInitialData.credit_types
        .map((namesCredits) => credits.find((creditsArray) => creditsArray.name === namesCredits))
        .filter((id) => id);

      setSelectedCredit([...initialsIds]);

      onFormChange({ cat_credits_id: initialsIds });
    }
  }, [creditInitialData, credits]);

  const handleInputChange = (e) => {
    const { value } = e.target;

    setSelectedCredit(value);

    onFormChange({ cat_credits_id: value });
  };

  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Tipos de crédito</Typography>
      </Grid>

      <Grid item xs={12}>
        <InputLabel sx={{ mb: 1 }}>Selecciona los tipos de crédito:</InputLabel>

        <Select
          key={selectedCredits}
          multiple
          name="cat_credits_id"
          fullWidth
          MenuProps={MenuProps}
          value={selectedCredits || ''}
          onChange={handleInputChange}
          renderValue={(selected) => selected.map(({ name }) => name).join(', ')}
          required
        >
          {credits.map((item) => (
            <MenuItem key={item.id} value={item}>
              <Checkbox checked={selectedCredits.map(({ id }) => id).indexOf(item.id) > -1} />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  );
};

CreditTypes.propTypes = {
  onFormChange: PropTypes.func.isRequired,
  creditInitialData: PropTypes.object.isRequired,
};
