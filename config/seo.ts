// SEO Configuration for programmatic pages and metadata
export const SEO_CONFIG = {
  siteName: 'MiroMiro',
  siteUrl: 'https://miromiro.app',
  defaultImage: '/og-image.png',
  twitterHandle: '@SoraiaDev',
  author: 'Soraia'
}

// Feature pages for programmatic SEO
export const FEATURES = [
  {
    slug: 'css-inspector',
    title: 'CSS Inspector',
    shortTitle: 'CSS Inspector',
    description: 'Inspect any element and instantly copy its CSS properties. No DevTools needed - just hover and click to grab colors, fonts, spacing, and complete styles.',
    longDescription: 'MiroMiro\'s CSS Inspector lets you hover over any element on any website and instantly see its complete CSS properties. Copy colors, fonts, spacing, borders, shadows, and more with a single click. Perfect for developers and designers who want to learn from existing designs or quickly replicate styles.',
    keywords: ['css inspector', 'css viewer', 'inspect css', 'copy css', 'css extractor', 'web inspector', 'element inspector', 'css properties', 'style inspector'],
    icon: 'i-heroicons-cursor-arrow-rays',
    benefits: [
      'Instantly see any element\'s CSS properties',
      'Copy colors, fonts, and spacing with one click',
      'No DevTools knowledge required',
      'Works on any website'
    ],
    useCases: [
      'Learning how websites are built',
      'Quickly replicating design elements',
      'Debugging styling issues',
      'Design inspiration research'
    ]
  },
  {
    slug: 'asset-extractor',
    title: 'Asset Extractor',
    shortTitle: 'Assets',
    description: 'Download images, videos, SVGs, and all visual assets from any website. Bulk export entire asset libraries in seconds.',
    longDescription: 'Extract all visual assets from any webpage with MiroMiro\'s Asset Extractor. Download images, videos, SVGs, icons, and more individually or in bulk. Save hours of manual downloading and organize assets efficiently for your projects.',
    keywords: ['asset extractor', 'image downloader', 'download images', 'svg extractor', 'bulk download', 'video downloader', 'website assets', 'media extractor'],
    icon: 'i-heroicons-photo',
    benefits: [
      'Download all images from any page',
      'Extract SVGs and icons',
      'Bulk export entire asset libraries',
      'Organize downloads automatically'
    ],
    useCases: [
      'Building mood boards',
      'Competitor analysis',
      'Asset collection for projects',
      'Archiving website content'
    ]
  },
  {
    slug: 'svg-extractor',
    title: 'SVG Extractor',
    shortTitle: 'SVG',
    description: 'Extract SVG icons and graphics from any website. Download scalable vector graphics ready for your design projects.',
    longDescription: 'MiroMiro\'s SVG Extractor identifies and extracts all SVG graphics from any webpage. Download icons, illustrations, and vector graphics in their original quality. Perfect for designers who need scalable assets for their projects.',
    keywords: ['svg extractor', 'svg downloader', 'extract svg', 'icon extractor', 'vector graphics', 'svg icons', 'download svg', 'website svg'],
    icon: 'i-heroicons-code-bracket',
    benefits: [
      'Find all SVGs on any page',
      'Download in original quality',
      'Preserve scalability',
      'Ready for design tools'
    ],
    useCases: [
      'Icon collection',
      'Design system building',
      'Asset library creation',
      'Brand asset analysis'
    ]
  },
  {
    slug: 'lottie-extractor',
    title: 'Lottie Animation Extractor',
    shortTitle: 'Lottie',
    description: 'Extract Lottie animations from any website. Download JSON animation files ready for your web and mobile projects.',
    longDescription: 'Discover and extract Lottie animations from any website with MiroMiro. Download animation JSON files that work seamlessly with popular frameworks and design tools. Never recreate animations from scratch again.',
    keywords: ['lottie extractor', 'lottie downloader', 'extract lottie', 'animation extractor', 'lottie json', 'web animations', 'download animations'],
    icon: 'i-heroicons-play',
    benefits: [
      'Detect Lottie animations automatically',
      'Download ready-to-use JSON files',
      'Works with all major frameworks',
      'Preview animations before download'
    ],
    useCases: [
      'Animation inspiration',
      'Rapid prototyping',
      'Learning animation techniques',
      'Building animation libraries'
    ]
  },
  {
    slug: 'color-palette',
    title: 'Color Palette Extractor',
    shortTitle: 'Colors',
    description: 'Extract complete color palettes from any website. Get HEX, RGB, and HSL values for every color used in a design.',
    longDescription: 'MiroMiro analyzes any website and extracts its complete color palette. See primary, secondary, and accent colors with their exact values in HEX, RGB, and HSL formats. Perfect for design inspiration and brand analysis.',
    keywords: ['color palette extractor', 'extract colors', 'website colors', 'color picker', 'hex colors', 'rgb colors', 'color scheme', 'design colors'],
    icon: 'i-heroicons-swatch',
    benefits: [
      'Extract all colors from any site',
      'Get HEX, RGB, and HSL values',
      'Identify primary and accent colors',
      'Copy colors with one click'
    ],
    useCases: [
      'Brand color analysis',
      'Design inspiration',
      'Creating color schemes',
      'Matching existing designs'
    ]
  },
  {
    slug: 'contrast-checker',
    title: 'Contrast Checker',
    shortTitle: 'Contrast',
    description: 'Check color contrast ratios for WCAG accessibility compliance. Ensure your designs are readable and accessible to all users.',
    longDescription: 'MiroMiro\'s built-in Contrast Checker helps you verify that color combinations meet WCAG accessibility standards. Check contrast ratios between text and background colors to ensure your designs are readable for users with visual impairments.',
    keywords: ['contrast checker', 'wcag contrast', 'accessibility checker', 'color contrast', 'a11y', 'accessible design', 'contrast ratio', 'readability'],
    icon: 'i-heroicons-eye',
    benefits: [
      'Check WCAG compliance instantly',
      'AA and AAA level verification',
      'Real-time contrast ratios',
      'Improve accessibility'
    ],
    useCases: [
      'Accessibility audits',
      'Design review',
      'Compliance checking',
      'Inclusive design'
    ]
  },
  {
    slug: 'design-tokens',
    title: 'Design Token Extractor',
    shortTitle: 'Tokens',
    description: 'Extract design tokens from any website. Get CSS variables and Tailwind config for colors, typography, spacing, and more.',
    longDescription: 'Automatically extract design tokens from any website\'s CSS. MiroMiro identifies colors, typography, spacing, and other design decisions and exports them as CSS custom properties or Tailwind configuration. Build consistent design systems faster.',
    keywords: ['design tokens', 'css variables', 'tailwind config', 'design system', 'extract tokens', 'css custom properties', 'design extraction'],
    icon: 'i-heroicons-squares-2x2',
    benefits: [
      'Extract CSS variables automatically',
      'Export to Tailwind config',
      'Identify design patterns',
      'Build design systems faster'
    ],
    useCases: [
      'Design system creation',
      'Brand documentation',
      'Codebase analysis',
      'Style standardization'
    ]
  }
] as const

// Use case pages for programmatic SEO
export const USE_CASES = [
  {
    slug: 'designers',
    title: 'MiroMiro for Designers',
    description: 'Speed up your design workflow. Extract assets, colors, and styles from any website for mood boards, inspiration, and rapid prototyping.',
    keywords: ['design tools', 'ui design', 'web design', 'design inspiration', 'mood boards', 'asset extraction'],
    icon: 'i-heroicons-paint-brush',
    audience: 'Designers',
    benefits: [
      'Build mood boards in minutes',
      'Extract exact colors and fonts',
      'Download assets for reference',
      'Learn from great designs'
    ]
  },
  {
    slug: 'developers',
    title: 'MiroMiro for Developers',
    description: 'Copy CSS instantly, extract design tokens, and understand how any website is built. Save hours of reverse-engineering.',
    keywords: ['web development', 'frontend development', 'css tools', 'developer tools', 'code extraction'],
    icon: 'i-heroicons-code-bracket',
    audience: 'Developers',
    benefits: [
      'Copy CSS with one click',
      'Extract design tokens',
      'Understand website structure',
      'Speed up development'
    ]
  },
  {
    slug: 'agencies',
    title: 'MiroMiro for Agencies',
    description: 'Analyze competitor websites, extract brand assets, and speed up client projects. Built for agency workflows.',
    keywords: ['design agency', 'web agency', 'client projects', 'competitor analysis', 'brand extraction'],
    icon: 'i-heroicons-building-office',
    audience: 'Agencies',
    benefits: [
      'Analyze competitor designs',
      'Extract client brand assets',
      'Speed up project kickoffs',
      'Build asset libraries'
    ]
  },
  {
    slug: 'no-code',
    title: 'MiroMiro for No-Code Builders',
    description: 'Copy designs to Webflow, Framer, or any no-code tool. Extract styles without writing code.',
    keywords: ['no-code', 'webflow', 'framer', 'low-code', 'visual development', 'no-code design'],
    icon: 'i-heroicons-puzzle-piece',
    audience: 'No-Code Builders',
    benefits: [
      'Copy styles to any platform',
      'No coding required',
      'Match any design exactly',
      'Speed up builds'
    ]
  }
] as const

// FAQ content for structured data and FAQ pages
export const FAQS = [
  {
    question: 'What is MiroMiro?',
    answer: 'MiroMiro is a Chrome extension that helps designers and developers inspect any website\'s design system. You can extract CSS properties, colors, fonts, spacing, images, SVGs, Lottie animations, and more with just a few clicks - no DevTools required.'
  },
  {
    question: 'Is MiroMiro free to use?',
    answer: 'Yes! MiroMiro offers a free plan with 15 asset extractions and 3 contrast checks per month. For unlimited access and advanced features like bulk export and Lottie extraction, check out our Starter (€4/month) and Pro (€19/month) plans.'
  },
  {
    question: 'How do I install MiroMiro?',
    answer: 'Simply visit the Chrome Web Store, search for "MiroMiro", and click "Add to Chrome". The extension will be ready to use immediately on any website you visit.'
  },
  {
    question: 'Can I extract assets from any website?',
    answer: 'MiroMiro works on most public websites. You can extract images, videos, SVGs, Lottie animations, CSS properties, colors, fonts, and more. Some websites with strict security policies may limit certain extractions.'
  },
  {
    question: 'What browsers does MiroMiro support?',
    answer: 'MiroMiro is available on the Chrome Web Store for Chrome.'
  },
  {
    question: 'How do I export design tokens to Tailwind?',
    answer: 'With MiroMiro\'s Design Token Extractor, simply click the "Design System" button and choose "Tailwind". You\'ll get a ready-to-use tailwind.config.js file with all the colors, fonts, and spacing extracted from the website.'
  },
  {
    question: 'Is my data private when using MiroMiro?',
    answer: 'Yes, we take privacy seriously. MiroMiro processes most data locally in your browser. We only store usage metrics to enforce plan limits. We never sell your data or share it with third parties for advertising.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Absolutely. You can cancel your MiroMiro subscription at any time from your profile page. Your access continues until the end of your billing period, and you won\'t be charged again.'
  }
] as const

// Comparison pages for programmatic SEO
export const COMPARISONS = [
  {
    slug: 'miromiro-vs-devtools',
    title: 'MiroMiro vs Browser DevTools',
    competitor: 'Browser DevTools',
    description: 'Compare MiroMiro to browser DevTools. See why MiroMiro is faster and easier for extracting CSS, colors, and assets.',
    advantages: [
      'No technical knowledge required',
      'One-click CSS copying',
      'Bulk asset downloads',
      'Design token extraction'
    ]
  },
  {
    slug: 'miromiro-vs-colorpick',
    title: 'MiroMiro vs ColorPick Eyedropper',
    competitor: 'ColorPick Eyedropper',
    description: 'Compare MiroMiro to color picker extensions. MiroMiro offers complete design extraction, not just colors.',
    advantages: [
      'Full color palettes, not just single colors',
      'CSS properties included',
      'Asset extraction',
      'Contrast checking built-in'
    ]
  }
] as const

// Type exports for TypeScript
export type Feature = typeof FEATURES[number]
export type UseCase = typeof USE_CASES[number]
export type FAQ = typeof FAQS[number]
export type Comparison = typeof COMPARISONS[number]
