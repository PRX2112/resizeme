/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://resizeme.in',
    generateRobotsTxt: true,
    exclude: ['/debug', '/debug/*'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/debug', '/debug/*'],
            },
        ],
    },
    // Generate an index sitemap and split by size
    sitemapSize: 7000,
}
