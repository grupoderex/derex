const siteUrl = process.env.SITE_URL || "https://example.com";

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  exclude: ["/developments-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/developments-sitemap.xml`],
  },
};
