import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import useAppContext from 'src/data/DataProvider';

import LoadingSpinner from 'src/components/loading';

import DashboardLayout from 'src/sections/dashboard';

import { mainRoutes } from '../pages/main.routes';
import AuthGuard from '../components/authComponent';

const LoginPage = lazy(() => import('src/pages/login'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

// const ProductsPage = lazy(() => import('src/pages/products'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const { dataAuth, loading } = useAppContext();

  const routes = useRoutes([
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthGuard>
      ),
      children: [...mainRoutes],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: dataAuth?.token ? <Navigate to="/404" replace /> : <Navigate to="/login" replace />,
    },
  ]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{routes}</>; // No need for Router here
}
