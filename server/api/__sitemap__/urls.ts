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

const useCases = [
  'designers',
  'developers',
  'agencies',
  'no-code'
]

export default defineSitemapEventHandler(() => {
  const baseUrl = process.env.SITE_URL || 'https://miromiro.app'

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
    // Use cases index page
    asSitemapUrl({
      loc: '/use-cases',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    }),
    // Individual use case pages
    ...useCases.map(slug => asSitemapUrl({
      loc: `/use-cases/${slug}`,
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
