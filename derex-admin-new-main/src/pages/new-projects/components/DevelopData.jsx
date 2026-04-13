import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Grid, Button, TextField } from '@mui/material';

import { envProject } from 'src/config';
import useAppContext from 'src/data/DataProvider';
import { api_validateUniqueUrl } from 'src/data/APICalls';

import SvgColor from 'src/components/svg-color';

export const DevelopmentData = ({ dataProject, setDataProject }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const { dataAuth } = useAppContext();

  const [unique_url, setUniqueUrl] = useState(dataProject.unique_url);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'unique_url') {
      setUniqueUrl(value);
      setIsValidUrl(false);
      return;
    }

    if (name === 'contact_phone') {
      if (value.length <= 10) {
        setDataProject((prev) => ({ ...prev, [name]: value }));
      }

      return;
    }

    setDataProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateUniqueUrl = async () => {
    const body = {
      unique_url,
      project_id: dataProject.id ?? undefined,
    };

    const toastId = toast.loading('Validando url...');

    api_validateUniqueUrl(body, dataAuth.token)
      .then(({ isUnique }) => {
        setIsValidUrl(isUnique);
        setDataProject((prevState) => ({
          ...prevState,
          unique_url,
        }));

        toast.update(toastId, {
          render: isUnique
            ? 'La url que has ingresado es valida'
            : 'La url que has ingresado es invalida, por favor revisa que no sea utilizada',
          type: isUnique ? 'success' : 'error',
          isLoading: false,
          autoClose: 5000,
        });
      })
      .catch(() => {
        setIsValidUrl(false);
      });
  };

  useEffect(() => {
    if (!dataProject.unique_url && dataProject.id) return;

    const body = {
      unique_url: dataProject.unique_url,
      project_id: dataProject.id ?? undefined,
    };

    api_validateUniqueUrl(body, dataAuth.token)
      .then(({ isUnique }) => {
        setIsValidUrl(isUnique);
      })
      .catch(() => {
        setIsValidUrl(false);
      });
  }, [dataProject.unique_url]);

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
        <Grid
          container
          item
          xs={12}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={10}>
            <TextField
              fullWidth
              name="unique_url"
              value={unique_url}
              onChange={handleInputChange}
              label="Url unica"
              variant="outlined"
              required
              inputProps={{ maxLength: 50 }}
            />
          </Grid>

          {!isValidUrl && (
            <Grid item xs={1}>
              <Button
                variant="contained"
                color="error"
                sx={{ marginRight: 1 }}
                onClick={() => {
                  validateUniqueUrl();
                }}
              >
                Verificar
              </Button>
            </Grid>
          )}
        </Grid>

        {isValidUrl ? (
          <Grid container item xs={12} justifyContent="space-between" alignItems="center">
            <Grid item xs={6}>
              <Box fontSize="0.8em" marginBottom={2} marginTop={1}>
                {`Se verá reflejado como ${envProject.frontendUrl}/gracias?${dataProject?.unique_url}`}
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Tooltip title={copied ? 'Elemento copiado' : 'Copiar al portapapeles'}>
                <Box
                  component="span"
                  sx={{ width: 24, height: 24, mr: 2, cursor: 'pointer' }}
                  onClick={() => {
                    handleCopy(`${envProject.frontendUrl}/gracias?${dataProject?.unique_url}`);
                  }}
                >
                  <SvgColor src="/assets/icons/ic_copy.svg" sx={{ width: 20, height: 20 }} />
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        ) : (
          <p>La url que has ingresado es invalida, por favor revisa que no sea utilizada</p>
        )}
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="contact_email"
          value={dataProject?.contact_email}
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
          name="contact_phone"
          value={dataProject?.contact_phone}
          label="Teléfono de contacto"
          onChange={handleInputChange}
          variant="outlined"
          type="number"
          required
        />
      </Grid>
    </Grid>
  );
};

DevelopmentData.propTypes = {
  dataProject: PropTypes.object.isRequired,
  setDataProject: PropTypes.func.isRequired,
};
