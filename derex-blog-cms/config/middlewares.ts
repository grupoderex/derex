import type { Core } from '@strapi/strapi';

const getOrigin = (url?: string): string | null => {
  if (!url) {
    return null;
  }

  const originMatch = url.match(/^https?:\/\/[^/]+/i);
  return originMatch ? originMatch[0] : null;
};

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const cdnOrigin = getOrigin(env('AWS_CDN_URL'));
  const s3Origin = getOrigin(env('AWS_S3_ENDPOINT'));

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'img-src': [
              "'self'",
              'data:',
              'blob:',
              'https://market-assets.strapi.io',
              ...(cdnOrigin ? [cdnOrigin] : []),
              ...(s3Origin ? [s3Origin] : []),
            ],
            'media-src': [
              "'self'",
              'data:',
              'blob:',
              ...(cdnOrigin ? [cdnOrigin] : []),
              ...(s3Origin ? [s3Origin] : []),
            ],
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
