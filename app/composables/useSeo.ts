// Centralized SEO composable for consistent metadata across pages
export interface SeoConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noIndex?: boolean
  canonical?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export const useSeo = () => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const baseUrl = config.public.siteUrl || 'https://miromiro.app'

  const defaultImage = `${baseUrl}/og-image.png`
  const siteName = 'MiroMiro'
  const twitterHandle = '@SoraiaDev'

  // Set page-specific SEO meta
  const setSeoMeta = (seoConfig: SeoConfig) => {
    const fullTitle = seoConfig.title.includes('MiroMiro')
      ? seoConfig.title
      : `${seoConfig.title} | MiroMiro`

    const pageUrl = seoConfig.url || `${baseUrl}${route.path}`
    const canonicalUrl = seoConfig.canonical || pageUrl

    useHead({
      title: fullTitle,
      link: [
        { rel: 'canonical', href: canonicalUrl }
      ],
      meta: [
        { name: 'robots', content: seoConfig.noIndex ? 'noindex, nofollow' : 'index, follow' }
      ]
    })

    useSeoMeta({
      title: fullTitle,
      description: seoConfig.description,
      keywords: seoConfig.keywords?.join(', '),
      ogTitle: fullTitle,
      ogDescription: seoConfig.description,
      ogImage: seoConfig.image || defaultImage,
      ogImageWidth: '1919',
      ogImageHeight: '957',
      ogImageType: 'image/png',
      ogUrl: pageUrl,
      ogType: seoConfig.type || 'website',
      ogSiteName: siteName,
      twitterCard: 'summary_large_image',
      twitterTitle: fullTitle,
      twitterDescription: seoConfig.description,
      twitterImage: seoConfig.image || defaultImage,
      twitterSite: twitterHandle,
      twitterCreator: twitterHandle
    })
  }

  // Generate breadcrumb structured data
  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(breadcrumbList)
        }
      ]
    })
  }

  // Generate FAQ structured data
  const setFaqSchema = (faqs: Array<{ question: string; answer: string }>) => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(faqSchema)
        }
      ]
    })
  }

  // Generate Product structured data
  const setProductSchema = (product: {
    name: string
    description: string
    image?: string
    offers: Array<{
      name: string
      price: number
      priceCurrency: string
      availability?: string
    }>
  }) => {
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'description': product.description,
      'image': product.image || defaultImage,
      'brand': {
        '@type': 'Brand',
        'name': 'MiroMiro'
      },
      'offers': product.offers.map(offer => ({
        '@type': 'Offer',
        'name': offer.name,
        'price': offer.price,
        'priceCurrency': offer.priceCurrency,
        'availability': offer.availability || 'https://schema.org/InStock',
        'url': `${baseUrl}/compare-plans`
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(productSchema)
        }
      ]
    })
  }

  // Generate HowTo structured data
  const setHowToSchema = (howTo: {
    name: string
    description: string
    steps: Array<{
      name: string
      text: string
      image?: string
    }>
  }) => {
    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': howTo.name,
      'description': howTo.description,
      'step': howTo.steps.map((step, index) => ({
        '@type': 'HowToStep',
        'position': index + 1,
        'name': step.name,
        'text': step.text,
        ...(step.image && { 'image': step.image })
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(howToSchema)
        }
      ]
    })
  }

  // Generate Article structured data
  const setArticleSchema = (article: {
    headline: string
    description: string
    image?: string
    datePublished: string
    dateModified?: string
    author?: string
  }) => {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.headline,
      'description': article.description,
      'image': article.image || defaultImage,
      'datePublished': article.datePublished,
      'dateModified': article.dateModified || article.datePublished,
      'author': {
        '@type': 'Person',
        'name': article.author || 'Soraia',
        'url': 'https://x.com/SoraiaDev'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'MiroMiro',
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/logo.png`
        }
      }
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(articleSchema)
        }
      ]
    })
  }

  return {
    setSeoMeta,
    setBreadcrumbs,
    setFaqSchema,
    setProductSchema,
    setHowToSchema,
    setArticleSchema,
    baseUrl,
    siteName,
    defaultImage
  }
}
