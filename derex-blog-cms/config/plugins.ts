import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const hasR2Config =
    !!env('AWS_ACCESS_KEY_ID') &&
    !!env('AWS_SECRET_ACCESS_KEY') &&
    !!env('AWS_BUCKET_NAME') &&
    !!env('AWS_S3_ENDPOINT');

  if (!hasR2Config) {
    // Keep default local upload provider when R2/S3 credentials are not configured.
    return {};
  }

  return {
    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          baseUrl: env('AWS_CDN_URL', undefined),
          rootPath: env('AWS_BUCKET_ROOT_PATH', ''),
          s3Options: {
            credentials: {
              accessKeyId: env('AWS_ACCESS_KEY_ID'),
              secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
            },
            region: env('AWS_REGION', 'auto'),
            endpoint: env('AWS_S3_ENDPOINT'),
            s3ForcePathStyle: env.bool('AWS_S3_FORCE_PATH_STYLE', true),
            params: {
              Bucket: env('AWS_BUCKET_NAME'),
            },
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};

export default config;
