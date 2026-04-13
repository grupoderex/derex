import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { memo, useRef, useState, useEffect, useCallback } from 'react';

import { Box, Grid, Stack, Button, Switch, TextField, Typography } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_togglePromotionsByProject } from 'src/data/APICalls';

const PromotionsComponent = ({ promotionData, setPromotion }) => {
  const [checked, setChecked] = useState(false);
  const fileRef = useRef();
  const { setMediaForID, dataAuth } = useAppContext();

  useEffect(() => {
    if (promotionData?.is_active !== undefined) {
      setChecked(promotionData.is_active);
    }
  }, [promotionData?.is_active]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setPromotion((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setPromotion]
  );

  const uploadImageDisplay = useCallback(async () => {
    const fileValue = fileRef.current.files[0];

    if (!fileValue) {
      toast.loading({
        render: 'Error al subir la imágen',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }

    const toastId = toast.loading('Subiendo imagen');

    try {
      const fileProcessed = await setMediaForID('file', fileValue);

      toast.update(toastId, {
        render: 'Imagen subida correctamente, recuerda guardar cambios para ligarla a la propiedad',
        type: 'warning',
        isLoading: false,
        autoClose: 5000,
      });

      setPromotion((prevState) => ({
        ...prevState,
        promo_image: fileProcessed,
      }));
    } catch (error) {
      toast.update(toastId, {
        render: 'Error al subir la imagen',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  }, [setMediaForID, setPromotion]);

  const handleChange = useCallback(
    (event) => {
      const state = event.target.checked;

      if (promotionData.id) {
        const toastId = toast.loading('estado de la promoción');

        api_togglePromotionsByProject(promotionData.id, { is_active: state }, dataAuth.token)
          .then((data) => {
            setChecked(state);
            setPromotion((prevState) => ({
              ...prevState,
              is_active: state,
            }));

            toast.update(toastId, {
              render: state
                ? 'Promoción activada correctamente'
                : 'Promoción desactivada correctamente',
              type: 'success',
              isLoading: false,
              autoClose: 5000,
            });
          })
          .catch(() => {});
      } else {
        setChecked(state);
        setPromotion((prevState) => ({
          ...prevState,
          is_active: state,
        }));
      }
    },
    [promotionData?.id, dataAuth.token, setPromotion]
  );

  const handleClick = useCallback((event) => {
    event.preventDefault();
    const fRef = fileRef.current;
    fRef.click();
  }, []);

  return (
    <Grid container columnSpacing={2} rowSpacing={2}>
      <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Grid item xs={2} display="flex" alignItems="center">
          <Typography variant="h4">Promocion</Typography>
        </Grid>

        <Grid container display="flex" alignItems="center">
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          {checked ? <p>Desactivar promoción</p> : <p>Activar promoción</p>}
        </Grid>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="title_es"
            inputProps={{ maxLength: 50 }}
            value={promotionData?.title_es || ''}
            onChange={handleInputChange}
            label="Título en español"
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            inputProps={{ maxLength: 50 }}
            name="title_en"
            value={promotionData?.title_en || ''}
            onChange={handleInputChange}
            label="Título en inglés"
            variant="outlined"
            required
          />
        </Grid>
      </Grid>

      <Grid item xs={12} display="flex" alignItems="center" gap={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            inputProps={{ maxLength: 400 }}
            name="description_es"
            value={promotionData?.description_es || ''}
            onChange={handleInputChange}
            label="Descripción en español"
            variant="outlined"
            multiline
            rows={4}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            inputProps={{ maxLength: 400 }}
            name="description_en"
            value={promotionData?.description_en || ''}
            onChange={handleInputChange}
            label="Descripción en inglés"
            variant="outlined"
            multiline
            rows={4}
            required
          />
        </Grid>
      </Grid>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ py: 3, mb: 3 }}
      >
        <input
          className="hidden-file"
          type="file"
          accept=".png, .jpg, .jpeg, .webp"
          ref={fileRef}
          onChange={uploadImageDisplay}
        />
        <Stack direction="column" mr={3}>
          <Button onClick={handleClick}>
            {promotionData?.promo_image
              ? 'Actualizar imagen promocional'
              : 'Subir imagen promocional'}
          </Button>
        </Stack>
        {promotionData?.promo_image ? (
          <Box py={2}>
            <img
              height="200"
              style={{
                height: 'auto',
                maxWidth: '300px',
              }}
              src={promotionData.promo_image}
              alt="Imagen de miniatura"
            />
          </Box>
        ) : null}
      </Stack>
    </Grid>
  );
};

PromotionsComponent.propTypes = {
  promotionData: PropTypes.object.isRequired,
  setPromotion: PropTypes.func.isRequired,
};

export const Promotions = memo(PromotionsComponent);
