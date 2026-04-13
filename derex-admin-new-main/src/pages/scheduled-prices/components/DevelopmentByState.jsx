import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

import { Box, Button } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_postNewBannerScheduled } from 'src/data/APICalls';

import { PropertyCardDetail } from './PropertyCardDetail';
import { SwitchBannerDialogComponent } from '../../../components/Dialogs/SwitchBannerDialog';

export default function DevelopmentsByState({ development, onDataUpdated }) {
  const { dataAuth } = useAppContext();
  const [showChangeBannerDialog, setShowChangeBannerDialog] = useState(false);

  const switchDialogContent = {
    title: 'Banner promocional',
    text: 'Elije una nueva imagen para cambiar el banner promocional',
    data: development,
  };

  const onUploadNewBanner = (ev) => {
    setShowChangeBannerDialog(ev);
  };

  const setNewUrlBanner = async (ev) => {
    const body = {
      ...ev.elementChanged,
    };

    try {
      await api_postNewBannerScheduled(body, dataAuth.token);
      toast.success('Banner programado correctamente');
    } catch {
      toast.error('Error al remover la programación actual');
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <p>Nombre del desarrollo: {development.project}</p>

        <Button
          variant="contained"
          onClick={(event) => {
            event.stopPropagation();
            onUploadNewBanner(event);
          }}
        >
          Programar banner
        </Button>
      </Box>

      <div className="project-property-prices">
        {development.properties.map((item) => (
          <div className="project-property-container" key={item.id}>
            <PropertyCardDetail idProperty={item.id} propertyName={item.name} />
          </div>
        ))}
      </div>

      <SwitchBannerDialogComponent
        open={showChangeBannerDialog}
        content={switchDialogContent}
        setOpen={onUploadNewBanner}
        setConfirm={setNewUrlBanner}
      />
    </div>
  );
}

DevelopmentsByState.propTypes = {
  development: PropTypes.any,
  onDataUpdated: PropTypes.func,
};
