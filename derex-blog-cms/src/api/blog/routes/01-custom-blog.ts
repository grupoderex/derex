module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/blogs/findByName',
      handler: 'api::blog.blog.findByName',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/blogs/findByCategory',
      handler: 'api::blog.blog.findByCategory',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/blogs/findBySlug',
      handler: 'api::blog.blog.findBySlug',
      config: {
        auth: false,
      },
    },
  ],
};
