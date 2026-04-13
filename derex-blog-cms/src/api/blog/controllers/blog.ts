import { factories } from '@strapi/strapi';

const blogPopulate = {
  category: true,
  tags: true,
  thumbnail: true,
  cover: true,
  localizations: true,
  content: {
    on: {
      'blog.content': true,
      'blog.carousel': { populate: { media: true } },
      'blog.image': { populate: { image: true } },
      'blog.i-frame': true,
    },
  },
};

export default factories.createCoreController('api::blog.blog', () => ({
  async find(ctx) {
    delete ctx.query.pLevel;

    const locale = typeof ctx.query.locale === 'string' ? ctx.query.locale : undefined;
    const status = (typeof ctx.query.status === 'string' ? ctx.query.status : 'published') as 'published' | 'draft';
    const filters = typeof ctx.query.filters === 'object' && ctx.query.filters !== null
      ? ctx.query.filters
      : undefined;
    const sort = Array.isArray(ctx.query.sort)
      ? ctx.query.sort
      : typeof ctx.query.sort === 'string'
        ? [ctx.query.sort]
        : ['publishedAt:desc'];

    const nestedPagination = typeof ctx.query.pagination === 'object' && ctx.query.pagination !== null
      ? (ctx.query.pagination as Record<string, unknown>)
      : undefined;
    const page = Number.parseInt(
      String((ctx.query.page as string | undefined) ?? nestedPagination?.page ?? '1'),
      10
    );
    const pageSize = Number.parseInt(
      String((ctx.query.pageSize as string | undefined) ?? nestedPagination?.pageSize ?? '12'),
      10
    );

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 12 : pageSize;

    const [data, allRows] = await Promise.all([
      strapi.documents('api::blog.blog').findMany({
        locale,
        status,
        filters,
        sort,
        populate: blogPopulate,
        pagination: {
          page: safePage,
          pageSize: safePageSize,
        },
      }),
      strapi.documents('api::blog.blog').findMany({
        locale,
        status,
        filters,
        sort,
        pagination: {
          page: 1,
          pageSize: 1000,
        },
      }),
    ]);

    const total = allRows.length;
    const pageCount = Math.max(1, Math.ceil(total / safePageSize));

    return {
      data,
      meta: {
        pagination: {
          page: safePage,
          pageSize: safePageSize,
          pageCount,
          total,
        },
      },
    };
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: blogPopulate,
    };

    return await super.findOne(ctx);
  },

  async findByName(ctx) {
    const name = typeof ctx.query.name === 'string' ? ctx.query.name.trim() : '';
    const locale = typeof ctx.query.locale === 'string' ? ctx.query.locale : undefined;
    const status = typeof ctx.query.status === 'string' ? ctx.query.status : 'published';
    const page = Number.parseInt(String(ctx.query.page ?? '1'), 10);
    const pageSize = Number.parseInt(String(ctx.query.pageSize ?? '12'), 10);

    ctx.query = {
      filters: {
        title: {
          $containsi: name,
        },
      },
      locale,
      status,
      pagination: {
        page: Number.isNaN(page) ? 1 : page,
        pageSize: Number.isNaN(pageSize) ? 12 : pageSize,
      },
      sort: ['publishedAt:desc'],
      populate: blogPopulate,
    };

    return await super.find(ctx);
  },

  async findByCategory(ctx) {
    const category = typeof ctx.query.category === 'string' ? ctx.query.category.trim() : '';
    const locale = typeof ctx.query.locale === 'string' ? ctx.query.locale : undefined;
    const status = (typeof ctx.query.status === 'string' ? ctx.query.status : 'published') as 'published' | 'draft';
    const nestedPagination = typeof ctx.query.pagination === 'object' && ctx.query.pagination !== null
      ? (ctx.query.pagination as Record<string, unknown>)
      : undefined;
    const page = Number.parseInt(
      String((ctx.query.page as string | undefined) ?? nestedPagination?.page ?? '1'),
      10
    );
    const pageSize = Number.parseInt(
      String((ctx.query.pageSize as string | undefined) ?? nestedPagination?.pageSize ?? '12'),
      10
    );
    const omitArticlesRaw = typeof ctx.query.omitArticles === 'string' ? ctx.query.omitArticles : '';
    const omitArticles = omitArticlesRaw
      .split(',')
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => !Number.isNaN(value));

    const allBlogs = await strapi.documents('api::blog.blog').findMany({
      locale,
      status,
      sort: ['publishedAt:desc'],
      populate: blogPopulate,
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });

    const normalizedCategory = category.toLowerCase();
    const filteredBlogs = allBlogs.filter((blog: any) => {
      const inCategory =
        !normalizedCategory ||
        (typeof blog?.category?.name === 'string' &&
          blog.category.name.toLowerCase().includes(normalizedCategory));

      const notOmitted = omitArticles.length === 0 || !omitArticles.includes(blog.id);

      return inCategory && notOmitted;
    });

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 12 : pageSize;
    const total = filteredBlogs.length;
    const pageCount = Math.max(1, Math.ceil(total / safePageSize));
    const start = (safePage - 1) * safePageSize;
    const end = start + safePageSize;

    return {
      data: filteredBlogs.slice(start, end),
      meta: {
        pagination: {
          page: safePage,
          pageSize: safePageSize,
          pageCount,
          total,
        },
      },
    };
  },

  async findBySlug(ctx) {
    const slug = typeof ctx.query.slug === 'string' ? ctx.query.slug.trim() : '';
    const locale = typeof ctx.query.locale === 'string' ? ctx.query.locale : undefined;
    const status = (typeof ctx.query.status === 'string' ? ctx.query.status : 'published') as 'published' | 'draft';

    const results = await strapi.documents('api::blog.blog').findMany({
      filters: {
        slug: { $eq: slug },
      },
      status,
      locale,
      populate: blogPopulate,
    });

    if (results && results.length > 0) {
      return results[0];
    }

    return null;
  },
}));
