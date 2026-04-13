import { Box } from '@mui/material';

import './style.css';

export default function LoadingSpiner() {
  return (
    <Box
      sx={{
        minHeight: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    </Box>
  );
}
