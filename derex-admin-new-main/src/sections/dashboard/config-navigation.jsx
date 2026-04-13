import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  // {
  //   title: 'Analytics',
  //   path: '/',
  //   icon: icon('ic_analytics'),
  // },
  {
    title: 'Administradores',
    path: '/admin',
    icon: icon('ic_user'),
  },
  {
    title: 'Desarrollos',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Próximos Lanzamientos',
    path: '/developments',
    icon: icon('ic_analytics'),
  },
   {
    title: 'Progamación de Precios',
    path: '/price-scheduled',
        icon: <Iconify icon="ic:baseline-calendar-month" />,
  },
  {
    title: 'Analiticas',
    path: '/stats',
    icon: <Iconify icon="tabler:numbers" />,
  },
  {
    title: 'Estados',
    path: '/states',
    icon: <Iconify icon="mingcute:location-3-fill" />,
  },
  {
    title: 'Ciudades',
    path: '/cities',
    icon: <Iconify icon="mingcute:location-3-line" />,
  },
  {
    title: 'Documentos',
    path: '/documents',
    icon: <Iconify icon="mingcute:document-fill" />,
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'CMS',
    children: [
      {
        title: 'Titulos',
        path: '/cms/titles',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Conoce Javer',
        path: '/cms/know-javer',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Acerca de nosotros',
        path: '/cms/about',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Experiencia de clientes',
        path: '/cms/client-experience',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Preguntas frecuentes',
        path: '/cms/faq',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Contacto inicio',
        path: '/cms/home-contact',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Certificaciones y premios',
        path: '/cms/certifications-and-awards',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Tipos de credito',
        path: '/cms/credits',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Decalogos',
        path: '/cms/decalogue',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Redes sociales',
        path: '/cms/social',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Pie de pagina',
        path: '/cms/footer',
        icon: <Iconify icon="solar:text-bold" />,
      },
      {
        title: 'Avisos de privacidad',
        path: '/cms/privacy',
        icon: <Iconify icon="solar:text-bold" />,
      },
    ].sort((a, b) => a.title.localeCompare(b.title)),
    icon: <Iconify icon="solar:alt-arrow-down-outline" />,
  },
  {
    title: 'Website Media',
    path: '/styling',
    icon: <Iconify icon="pajamas:media" />,
  },
  {
    title: 'Navigation links',
    path: '/navbar-footer',
    icon: <Iconify icon="cil:list" />,
  },
  {
    title: 'Log de Actividades',
    path: '/logs',
    icon: <Iconify icon="solar:list-outline" />,
  },
];

export default navConfig;
