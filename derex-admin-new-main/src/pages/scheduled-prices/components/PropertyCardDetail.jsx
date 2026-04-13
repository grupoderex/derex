import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import useAppContext from 'src/data/DataProvider';
import { api_editPropertiesPrices, api_getScheduledProjectsById } from 'src/data/APICalls';

import { PropertyRow } from './PropertyRow';
import { ActionDialogComponent } from '../../../components/Dialogs/ActionDialog';

const confirmDialogContent = {
  title: 'Deseas continuar',
  text: 'Si continúas, se aplicaran los cambios en la programación de precios',
  btnTitle: 'Continuar',
};

export function PropertyCardDetail({ idProperty, propertyName }) {
  const { dataAuth } = useAppContext();
  const [propertyPrices, setPropertyPrices] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [scheduledData, setScheduledData] = useState(null);

  useEffect(() => {
    async function fetchPropertyData() {
      try {
        const { data } = await api_getScheduledProjectsById(idProperty, dataAuth.token);

        console.log('veamos que show', data)

        setPropertyPrices(data);
      } catch (error) {
        toast.error('Error al obtener la información de los precios de la propiedad');
      }
    }

    fetchPropertyData();
  }, [dataAuth.token, idProperty]);

  const handlePropertyUpdate = (newData, kind) => {
    setScheduledData(newData);
    if (kind === 'edit') {
      onOpenDialog(true);
      return;
    }
    removePropertyScheduled(newData);
  };

  const savePropertyScheduled = async (ev) => {
    if (scheduledData === null) return;

    const body = {
      prices: [scheduledData],
    };

    try {
      const response = await api_editPropertiesPrices(dataAuth.token, body);
      toast.success('Cambios aplicados', response);
      setShowConfirmDialog(false);
      setScheduledData(null);
    } catch (error) {
      setShowConfirmDialog(false);
      if (error.response.data.error === 'Error en la validacion de campos') {
        toast.error('Revisa que todos los datos estén correctamente llenados');
        return;
      }

      toast.error('Error al aplicar los cambios');
    }
  };

  const removePropertyScheduled = async (ev) => {
    const property = {
      prices_list_property_id: ev.prices_list_property_id,
      new_price_base: null,
      new_price_m2_ext: null,
      effective_datetime: null,
    };
    const body = {
      prices: [property],
    };
    try {
      const response = await api_editPropertiesPrices(dataAuth.token, body);
      toast.success('Se ha removido la programación con éxtio', response);
      setShowConfirmDialog(false);
      setScheduledData(null);
      //   if (onDataUpdated) onDataUpdated(stateId, dataAuth.token);
    } catch (error) {
      setShowConfirmDialog(false);
      toast.error('Error al remover la programación actual');
    }
  };

  const onOpenDialog = (ev) => {
    setShowConfirmDialog(ev);
  };

  return (
    <>
      <div className="property-card">
        <p className="property-subtitle">Lista de precios del fraccionamiento:</p>
        <div className="property-list-container">
          {propertyPrices &&
            propertyPrices.map((price, index) => (
              <PropertyRow
                key={index}
                property={{
                  ...price,
                }}
                setPropertyPrice={(event, kind) => handlePropertyUpdate(event, kind)}
              />
            ))}
        </div>
      </div>

      <ActionDialogComponent
        open={showConfirmDialog}
        content={confirmDialogContent}
        setOpen={onOpenDialog}
        setConfirm={savePropertyScheduled}
        element={propertyPrices}
      />
    </>
  );
}

PropertyCardDetail.propTypes = {
  idProperty: PropTypes.number,
  propertyName: PropTypes.string
};
