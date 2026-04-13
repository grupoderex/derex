import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::blog.blog', {
  only: ['find', 'findOne'],
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
