import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { Grid, Switch, Container, Typography, FormControlLabel } from '@mui/material';

import useAppContext from 'src/data/DataProvider';
import { api_getAllSections, api_setNavbarSection, api_setFooterSection } from 'src/data/APICalls';

import LoadingSpiner from 'src/components/loading';

export default function NavigationLinksPage() {
  const [footerSections, setFooterSections] = useState([]);
  const [navbarSections, setNavbarSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const { dataAuth } = useAppContext();

  useEffect(() => {
    api_getAllSections()
      .then((data) => {
        setFooterSections(data?.footer);
        setNavbarSections(data?.navbar);
      })
      .catch(() => toast.error('Error al cargar secciones'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title> Navigation | Javer </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Administrar enlaces activos
        </Typography>
        {loading ? (
          <LoadingSpiner />
        ) : (
          <Grid container>
            <Typography variant="h5" sx={{ mb: 5 }}>
              Navbar
            </Typography>
            {navbarSections.map((item) => (
              <Grid
                key={item.id}
                item
                xs={12}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>{item.name}</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={item.active === 1}
                      onChange={(e) => {
                        api_setNavbarSection(item.id, e.target.checked, dataAuth.token)
                          .then(() => {
                            if (e.target.checked) toast.success(`Seccion ${item.name} habilitada`);
                            else toast.warning(`Seccion ${item.name} desabilitada`);
                          })
                          .catch(() => toast.error('Error al actualizar la seccion'));
                      }}
                    />
                  }
                  label="Activo"
                />
              </Grid>
            ))}
            {/* ------------------------------- */}
            <Typography variant="h5" sx={{ my: 5 }}>
              Footer
            </Typography>
            {footerSections.map((item) => (
              <Grid
                key={item.id}
                item
                xs={12}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>{item.name}</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked={item.active === 1}
                      onChange={(e) => {
                        api_setFooterSection(item.id, e.target.checked, dataAuth.token)
                          .then(() => {
                            if (e.target.checked) toast.success(`Seccion ${item.name} habilitada`);
                            else toast.warning(`Seccion ${item.name} desabilitada`);
                          })
                          .catch(() => toast.error('Error al actualizar la seccion'));
                      }}
                    />
                  }
                  label="Activo"
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
