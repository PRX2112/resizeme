/** @type {import('next-sitemap').IConfig} */

const HIGH_VALUE_PATHS = new Set([
    '/',
    // 12 Core Tool Pages
    '/tools/resize',
    '/tools/resize/bulk',
    '/tools/compress',
    '/tools/convert',
    '/tools/crop',
    '/tools/enlarge',
    '/tools/background-remover',
    '/tools/watermark',
    '/tools/meme-generator',
    '/tools/color-picker',
    '/tools/rotate',
    '/tools/flip',
    // Blog Index & 12 Blog Posts
    '/blog',
    '/blog/advanced-crop-techniques',
    '/blog/avif-vs-webp-vs-jpeg-comparison',
    '/blog/complete-guide-to-image-resampling-algorithms',
    '/blog/ecommerce-product-image-optimization-guide',
    '/blog/how-to-remove-image-backgrounds-in-browser',
    '/blog/how-to-resize-images-for-all-social-media-platforms',
    '/blog/how-to-resize-images-without-losing-quality',
    '/blog/image-compression-formats',
    '/blog/lossless-vs-lossy-compression-explained',
    '/blog/modern-browser-image-editing-tools',
    '/blog/optimizing-image-performance-for-web',
    '/blog/understanding-dpi-and-ppi-in-digital-images',
    // Static & Legal Pages
    '/about',
    '/privacy',
    '/terms',
    '/disclaimer',
    '/cookie-policy',
    '/contact',
]);

const EXCLUDE_PATHS = [
    '/debug',
    '/debug/*',
    '/compress-image-online',
    '/compress-image-to-200kb',
    '/compress-image-to-50kb',
    '/compress-images-without-losing-quality',
    '/compress-jpg-online',
    '/compress-png-online',
    '/convert-image-format',
    '/convert-jpg-to-png',
    '/convert-png-to-webp',
    '/crop-image-online',
    '/image-format-guide',
    '/instagram-story-resize',
    '/passport-photo-resizer',
    '/png-to-jpg',
    '/reduce-image-size-online',
    '/resize-image-for-instagram',
    '/resize-image-for-passport',
    '/resize-image-for-whatsapp',
    '/resize-image-for-youtube',
    '/resize-image-online',
    '/resize-image-to-100kb',
    '/resize-image-to-1920x1080',
    '/resize-image-to-50kb',
    '/social-media-image-sizes',
    '/webp-to-png',
    '/what-is-image-resizing',
    '/why-image-optimization-matters',
    '/youtube-thumbnail-compressor',
    '/tools/resize/jpg',
    '/tools/resize/png',
    '/tools/resize/webp',
    '/tools/compress/*',
    '/tools/crop/*',
    '/tools/convert/*',
];

module.exports = {
    siteUrl: process.env.SITE_URL || 'https://resizeme.in',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    exclude: EXCLUDE_PATHS,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/debug', '/debug/*'],
            },
        ],
    },
    transform: async (config, path) => {
        // Only include verified high-value pages in sitemap
        if (!HIGH_VALUE_PATHS.has(path)) {
            return null;
        }

        let priority = 0.7;
        if (path === '/') {
            priority = 1.0;
        } else if (path.startsWith('/tools/')) {
            priority = 0.9;
        } else if (path === '/blog') {
            priority = 0.8;
        }

        return {
            loc: path,
            changefreq: 'daily',
            priority,
            lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
        };
    },
};

