// Blog posts configuration for SEO-focused content
export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  author: string
  readingTime: number
  image?: string
  content: string // HTML content
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-extract-images-from-framer-templates-easily',
    title: 'How to Easily Extract Images from Framer Templates (2026 Guide)',
    description: 'Stop struggling with DevTools. Learn how to quickly extract high-quality images, mockups, and assets from any Framer template or website for your design references.',
    date: '2026-01-02',
    category: 'Design Tools',
    tags: ['framer', 'chrome extension', 'extract images', 'design inspiration', 'web development', 'framer template'],
    author: 'Soraia',
    readingTime: 4,
    image: '/landing/download-framer-images.png',
    content: `
      <p class="text-xl leading-relaxed text-gray-700">If you struggle with finding design inspiration and references, you're not alone. <strong class="text-primary-600 font-extrabold border-b-2 border-muted">MiroMiro is designed to simplify that workflow.</strong></p>

      <p class="text-lg leading-relaxed mt-6">In this guide, I'll show you how to gather visual references from any live Framer website, <span class="bg-primary-50 px-2 py-1 rounded text-primary-700 font-bold italic">without digging through code</span>. Let's get started.</p>

      <h2 class="text-4xl font-black mt-16 mb-8 text-gray-900 tracking-tight">The Problem: Saving Images from Websites is a Pain</h2>

      <p class="text-lg leading-relaxed mb-6">You're browsing a beautifully designed Framer site and spot the perfect mockup for your reference folder. You right-click... and it doesn't work. Or you get a tiny thumbnail instead of the full image.</p>

      <div class="my-8 rounded-2xl overflow-hidden border border-muted shadow-sm">
        <img src="/landing/preview_framer.png" alt="Trying to save an image from a Framer website" class="w-full h-auto" />
        <p class="p-3 bg-gray-50 text-sm text-center text-gray-500 italic font-medium">Framer sites are full of stunning visuals, but saving them isn't always easy.</p>
      </div>

      <p class="text-lg leading-relaxed">Modern websites use layers and lazy loading that make simple "Save Image As" unreliable. You end up opening DevTools, hunting through elements, or just giving up. <span class="text-primary-600 font-bold">MiroMiro fixes this.</span> It sees every image on the page and lets you download them with a click.</p>

      <h2 class="text-4xl font-black mt-16 mb-8 text-gray-900 tracking-tight">Method 1: Point, Hover, and Download</h2>
      <p class="text-lg leading-relaxed mb-6">The fastest way to grab an image is to use the <strong>MiroMiro Inspector</strong>. It works just like a design tool.</p>
      
      <div class="my-8 rounded-2xl overflow-hidden border border-muted shadow-sm">
        <img src="/landing/miromiro-hover-inspector.png" alt="Hovering over an iPhone mockup with MiroMiro inspector" class="w-full h-auto" />
        <p class="p-3 bg-primary-50 text-sm text-center text-primary-700 italic font-bold">Just hover to see the resolution and format instantly.</p>
      </div>

      <h3 class="text-2xl font-bold mt-10 mb-4 text-gray-900">How to use the Inspector:</h3>
      <ol class="text-lg space-y-4 mb-8 ml-6 list-decimal text-gray-700">
        <li><strong>Activate the Tool:</strong> Open the extension and click the <span class="text-gray-900 font-bold">Inspector Mode</span> icon. MiroMiro will now highlight every image as you move your mouse.</li>
        <li><strong>Hover to Preview:</strong> Simply <span class="text-primary-600 font-bold underline decoration-primary-200">hover over any image</span> to see a high-quality preview, its size, and file type.</li>
        <li><strong>Download:</strong> Click the download button directly from the hover tooltip to save the asset immediately.</li>
      </ol>

      <h2 class="text-4xl font-black mt-16 mb-8 text-gray-900 tracking-tight">Method 2: The Asset Tab (Bulk Export)</h2>
      <p class="text-lg leading-relaxed mb-6">Don't feel like hunting for images on the page? Switch to the <strong>Assets Tab</strong> to see a clean gallery of everything MiroMiro found.</p>
      
      <div class="my-8 rounded-2xl overflow-hidden border border-muted shadow-sm">
        <img src="/landing/miromiro-asset-tab-gallery.png" alt="MiroMiro Assets Tab showing all images on the page" class="w-full max-h-96 object-contain bg-gray-100" />
        <p class="p-3 bg-gray-50 text-sm text-center text-gray-500 italic font-medium">View every image and icon in one organized list.</p>
      </div>

      <p class="text-lg text-gray-700 mb-6">The Assets Tab is perfect for a faster overview of the site’s contents:</p>
      <ul class="text-lg space-y-3 mb-10 ml-6 list-disc text-gray-700">
        <li><strong>Bulk Preview:</strong> See every image on the page in one organized gallery.</li>
        <li><strong>One-Click Save:</strong> Download any asset from the gallery without needing to scroll to its location on the page.</li>
      </ul>
    `
  }
];

// Helper to get all blog posts sorted by date
export function getBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

// Helper to get a single blog post by slug
export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.slug === slug)
}

// Helper to get related posts (excluding current)
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  return getBlogPosts()
    .filter(post => post.slug !== currentSlug)
    .slice(0, limit)
}
