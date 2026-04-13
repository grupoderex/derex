import PropTypes from 'prop-types';

import { Grid, TextField } from '@mui/material';

import { UrlPreview } from 'src/components/urlPreview';

import { OrientationType } from './OrientationType';

export const ProjectData = ({ dataProject, setDataProject }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'short_name') {
      setDataProject((prevState) => ({
        ...prevState,
        [name]: value.toUpperCase(),
      }));
      return;
    }

    setDataProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Grid container columnSpacing={2} rowSpacing={4}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="name"
          value={dataProject?.name}
          onChange={handleInputChange}
          label="Nombre"
          variant="outlined"
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="short_name"
          value={dataProject?.short_name}
          onChange={handleInputChange}
          label="Nombre corto"
          variant="outlined"
          required
        />

        <UrlPreview projectTitle={dataProject?.short_name} />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="url_salesforce"
          value={dataProject?.url_salesforce}
          onChange={handleInputChange}
          label="Url salesforce"
          variant="outlined"
          required
        />

        {/* <UrlPreview projectTitle={dataProject?.short_name} /> */}
      </Grid>

      <Grid item xs={12}>
        <OrientationType
          orientationType={dataProject?.type_orientation}
          onOrientationTypeChange={(value) =>
            setDataProject((prevState) => ({
              ...prevState,
              type_orientation: value,
            }))
          }
          verticalData={dataProject?.vertical_data}
          onVerticalDataChange={(value) =>
            setDataProject((prevState) => ({
              ...prevState,
              vertical_data: value,
            }))
          }
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          name="description"
          value={dataProject?.description}
          onChange={handleInputChange}
          label="Descripción corta"
          variant="outlined"
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          name="description_eng"
          value={dataProject?.description_eng}
          onChange={handleInputChange}
          label="Descripción corta en inglés"
          variant="outlined"
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="long_description"
          value={dataProject?.long_description}
          onChange={handleInputChange}
          label="Descripción Larga"
          variant="outlined"
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          name="long_description_eng"
          value={dataProject?.long_description_eng}
          onChange={handleInputChange}
          label="Descripción larga en inglés"
          variant="outlined"
          required
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="featured"
          value={dataProject?.featured}
          onChange={handleInputChange}
          label="Característica principal"
          variant="outlined"
          required
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="email_contact"
          value={dataProject?.email_contact}
          label="Email de contacto"
          onChange={handleInputChange}
          variant="outlined"
          type="email"
          required
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="phone_contact"
          value={dataProject?.phone_contact}
          label="Teléfono de contacto"
          onChange={handleInputChange}
          variant="outlined"
          type="number"
          error={dataProject?.phone_contact?.length >= 12}
          required
        />
      </Grid>
    </Grid>
  );
};

ProjectData.propTypes = {
  dataProject: PropTypes.object.isRequired,
  setDataProject: PropTypes.func.isRequired,
};
