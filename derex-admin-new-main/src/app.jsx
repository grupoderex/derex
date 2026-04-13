import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { QueryClientProvider } from 'react-query';
import { HelmetProvider } from 'react-helmet-async';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import 'src/global.css';
import Router from 'src/routes';
import ThemeProvider from 'src/theme';

import { queryClient } from './data/APICalls';
import { DataProvider } from './data/DataProvider';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <HelmetProvider>
      <DataProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Router />
            <ToastContainer
              position="top-center"
              autoClose={5000}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </QueryClientProvider>
        </ThemeProvider>
      </DataProvider>
    </HelmetProvider>
  );
}
