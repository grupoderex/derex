import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::category.category', () => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        localizations: true,
      },
    };

    return await super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        localizations: true,
      },
    };

    return await super.findOne(ctx);
  },
}));
