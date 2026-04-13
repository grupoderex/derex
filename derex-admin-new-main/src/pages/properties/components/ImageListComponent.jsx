import PropTypes from 'prop-types';

import { Button, ImageListItem } from '@mui/material';

import Iconify from 'src/components/iconify/iconify';

export function ImageListComponent({ index, src, onDelete, onEdit }) {
  const style = {
    backgroundImage: `url(${src})`,
  };

  return (
    <ImageListItem>
      <div style={style} className="div-for-img">
        <Button
          onClick={() => {
            onDelete(index);
          }}
        >
          <Iconify width={24} icon="mdi:bin" />
        </Button>

        {onEdit && (
          <Button
            onClick={() => {
              onEdit(index);
            }}
          >
            <Iconify width={24} icon="mdi:square-edit-outline" />
          </Button>
        )}
      </div>
    </ImageListItem>
  );
}

ImageListComponent.propTypes = {
  index: PropTypes.any,
  src: PropTypes.string,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
