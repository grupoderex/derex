import { Box } from '@mui/material';

import { toUrlCase } from 'src/utils/format-url';

import { envProject } from 'src/config';

export const UrlPreview = ({ projectTitle, propertyTitle }) => {
  const url = `${envProject.frontendUrl}/desarrollos/${toUrlCase(projectTitle)}${
    propertyTitle ? `/propiedad/${toUrlCase(propertyTitle)}` : ''
  }`;

  return (
    <Box fontSize="0.8em" marginBottom={2} marginTop={1}>
      Se verá reflejado como {url}
    </Box>
  );
};
