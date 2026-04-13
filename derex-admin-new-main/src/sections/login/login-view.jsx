import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import useAppContext from 'src/data/DataProvider';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const [trying, setTrying] = useState(false);
  const [error, setError] = useState(false);

  const { login } = useAppContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/'); 
    }
  }, [router]);

  const handleClick = () => {
    setTrying(true);
    setError(null);
    login({ email: user, password: pass })
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setTrying(false);
          setUser('');
          setPass('');
        } else {
          localStorage.setItem('token', response.token);
          router.replace('/');
        }
      })
      .catch(() => {
        setError('Error desconocido');
        setTrying(false);
      });
  };

  const renderForm = (
    <Stack spacing={3}>
      <TextField
        name="email"
        label="Email address"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <TextField
        name="password"
        label="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          margin: '2rem',
          maxWidth: '100px',
          justifyContent: 'start',
          width: '100%',
          display: 'flex',
        }}
      >
        <img src="/assets/bar-logo.png" alt="" />
      </Box>

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Javer Admin</Typography>

          <Divider sx={{ my: 3 }} />

          {!trying && renderForm}

          {trying && <CircularProgress />}

          {error && (
            <Typography justifyContent="center" textAlign="center" paddingTop="2em">
              {error}
            </Typography>
          )}
        </Card>
      </Stack>
    </Box>
  );
}
