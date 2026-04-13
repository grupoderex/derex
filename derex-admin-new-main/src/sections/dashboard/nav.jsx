import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import RouterLink from 'src/routes/router-link';

import { useResponsive } from 'src/hooks/use-responsive';

import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box display="flex" width="100%" justifyContent="start">
        <Link
          to="/"
          style={{
            margin: '2rem',
            maxWidth: '100px',
          }}
        >
          <img src="/assets/bar-logo.png" alt="" />
        </Link>
      </Box>

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  const [open, setOpen] = useState(false);

  return (
    <div>
      <ListItemButton
        component={RouterLink}
        href={item.path}
        onClick={
          item.children
            ? () => {
                setOpen((prev) => !prev);
              }
            : undefined
        }
        sx={{
          minHeight: 44,
          borderRadius: 0.75,
          typography: 'body2',
          color: 'text.secondary',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightMedium',
          ...(active && {
            color: '#cd1019',
            fontWeight: 'fontWeightSemiBold',
            bgcolor: alpha('#cd1019', 0.08),
            '&:hover': {
              bgcolor: alpha('#cd1019', 0.16),
            },
          }),
        }}
      >
        <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          {item.icon}
        </Box>

        <Box
          component="span"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}{' '}
        </Box>
      </ListItemButton>
      <div
        style={{
          maxHeight: open ? `${(item.children?.length ?? 0) * 48}px` : '0',
          overflow: 'hidden',
          transition: 'max-height 0.2s ease-out',
        }}
      >
        {item.children && (
          <Stack spacing={0.5} sx={{ pl: 2 }}>
            {item.children.map((subItem) => (
              <NavItem key={subItem.title} item={subItem} />
            ))}
          </Stack>
        )}
      </div>
    </div>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
