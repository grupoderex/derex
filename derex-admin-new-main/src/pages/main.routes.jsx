import { lazy } from 'react';

import { cmsRoutes } from './cms/cms.routes';

const NavigationLinksPage = lazy(() => import('src/pages/navigation-active'));
const AllProjects = lazy(() => import('src/pages/all-projects'));
const NextProjects = lazy(() => import('src/pages/next-projects'));
const Project = lazy(() => import('src/pages/projects/Project'));
const LogsPage = lazy(() => import('src/pages/logs'));
const Property = lazy(() => import('src/pages/properties/property'));
const StylingPage = lazy(() => import('src/pages/styling'));
const AnalitycsPage = lazy(() => import('src/pages/analitycs'));
const BlogPage = lazy(() => import('src/pages/blog'));
const StatesPage = lazy(() => import('src/pages/states/States'));
const CitiesPage = lazy(() => import('src/pages/cities'));
const DocumentsPage = lazy(() => import('src/pages/documents'));
const UserPage = lazy(() => import('src/pages/user'));
const NewNextProject = lazy(() => import('src/pages/new-projects/NewNextProject'));
const PriceScheduled = lazy(() => import('src/pages/scheduled-prices/ScheduledPrice'));


export const mainRoutes = [
  ...cmsRoutes,
  { element: <AllProjects />, index: true },
  { path: 'admin', element: <UserPage /> },
  { path: 'logs', element: <LogsPage /> },
  { path: 'project', element: <Project /> },
  { path: 'developments', element: <NextProjects /> },
  { path: 'developments/create', element: <NewNextProject /> },
  { path: 'developments/edit', element: <NewNextProject /> },
  { path: 'price-scheduled', element: <PriceScheduled /> },
  { path: 'property', element: <Property /> },
  { path: 'styling', element: <StylingPage /> },
  { path: 'stats', element: <AnalitycsPage /> },
  { path: 'states', element: <StatesPage /> },
  { path: 'cities', element: <CitiesPage /> },
  { path: 'documents', element: <DocumentsPage /> },
  { path: 'navbar-footer', element: <NavigationLinksPage /> },
  { path: 'blog', element: <BlogPage /> },
];
