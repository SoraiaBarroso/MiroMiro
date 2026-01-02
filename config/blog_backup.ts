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
      <p>If you struggle with finding design inspiration and references, you're not alone. Hours spent browsing sites like Pinterest and competitor portfolios often lead to a common roadblock: you find a perfect asset, but you can't easily save it for your reference library. MiroMiro is designed to simplify that workflow.</p>

      <p>In this guide, I’ll show you how to quickly gather visual references from a live Framer website—like a beautiful iPhone wireframe mockup—without the need to dig through code or inspect elements. Let's get started.</p>

      <h2>The Challenge with Modern Web Assets</h2>
      <p>We've all been there: you see a stunning mockup on a Framer site, but grabbing it for your swipe file isn't straightforward because:</p>
      <ul>
        <li><strong>Right-click is limited:</strong> Some layouts make it hard to select the specific image you want.</li>
        <li><strong>Layering:</strong> Framer uses complex layering for animations, which often puts invisible elements on top of the images you want to save.</li>
      </ul>
      <p>Instead of opening DevTools and hunting through the "Network" or "Application" tabs for 20 minutes, MiroMiro brings every asset to the surface for you.</p>

      <h2 class="text-xl">Real Example: Extracting an iPhone Mockup</h2>
      <p>Let’s say you found a portfolio site with a device mockup that fits the vibe of your next project. Here is how you get it in seconds:</p>

      <h3>Step 1: Open MiroMiro</h3>
      <p>Navigate to the Framer site and click the <a href="https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl" target="_blank">MiroMiro extension</a> icon. There's no need to search through the site's source code.</p>

      <h3>Step 2: Preview the Assets</h3>
      <p>The extension panel will automatically populate with every image found on the page—including those tricky background images and optimized assets.</p>

      <h3>Step 3: Save for Reference</h3>
      <p>Find the mockup in the gallery, preview it to ensure it's the right resolution, and hit download. You now have a high-quality reference ready for your mood board.</p>

      <h2>Video Walkthrough</h2>
      <p>Watch how I use MiroMiro to grab a premium wireframe from a live site in under 20 seconds. No DevTools required.</p>
      <div class="video-embed" style="margin: 2rem 0;">
        <iframe 
          width="100%" 
          height="400" 
          src="https://www.youtube.com/embed/gSf-PhTplJ0" 
          title="How to Download Images from Framer Websites" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>

      <h2>Why This Helps Your Workflow</h2>
      <p>Framer builds highly optimized sites. While this is great for performance, it makes it tedious for designers and developers to collect references. MiroMiro simplifies this by:</p>
      <ul>
        <li><strong>Finding CSS Backgrounds:</strong> It automatically detects images that aren't technically "img" tags.</li>
        <li><strong>Handling WebP/AVIF:</strong> It identifies the optimized formats Framer uses so you can see exactly what's being served.</li>
        <li><strong>Saving Time:</strong> It eliminates the "Right-click > Inspect > Search for URL" cycle.</li>
      </ul>

      <h2>Build a Better Inspiration Library</h2>
      <p>The best designers maintain extensive folders for <strong>/mockups</strong>, <strong>/ui-patterns</strong>, and <strong>/hero-sections</strong>. Every time you see a great execution on a Framer site, you can now add it to your library instantly.</p>

      <p>Ready to stop digging through code? <a href="https://chromewebstore.google.com/detail/miromiro/kpmkikjpclolhodgckeogmiiaehpfjhl" target="_blank">Add MiroMiro to Chrome</a> and start building your reference collection the easy way.</p>

      <p>Happy designing! ✨</p>
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
