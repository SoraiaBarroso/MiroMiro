import { defineSitemapEventHandler, asSitemapUrl } from '#imports'

// Define all programmatic SEO pages for sitemap
const features = [
  'css-inspector',
  'asset-extractor',
  'svg-extractor',
  'lottie-extractor',
  'color-palette',
  'contrast-checker',
  'design-tokens'
]

export default defineSitemapEventHandler(() => {
  return [
    // Feature index page
    asSitemapUrl({
      loc: '/features',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    }),
    // Individual feature pages
    ...features.map(slug => asSitemapUrl({
      loc: `/features/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    })),
    // FAQ page
    asSitemapUrl({
      loc: '/faq',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6
    })
  ]
})
