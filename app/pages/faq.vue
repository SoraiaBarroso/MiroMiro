<script setup lang="ts">
import { FAQS } from '../../config/seo'

// SEO Meta with FAQ Schema
const { setSeoMeta, setBreadcrumbs, setFaqSchema } = useSeo()

setSeoMeta({
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about MiroMiro. Learn about features, pricing, installation, privacy, and more.',
  keywords: ['miromiro faq', 'frequently asked questions', 'help', 'support', 'how to use miromiro']
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'FAQ', url: '/faq' }
])

setFaqSchema(FAQS)

// Transform FAQs to UAccordion format
const faqItems = FAQS.map(faq => ({
  label: faq.question,
  content: faq.answer
}))

// CTA links
const ctaLinks = [
  {
    label: 'Contact Support',
    to: '/contact'
  },
  {
    label: 'Ask on ',
    to: 'https://x.com/SoraiaDev',
    target: '_blank',
    color: 'neutral',
    variant: 'outline',
    trailingIcon: 'i-simple-icons-x'
  }
]
</script>

<template>
  <UPage>
    <UPageSection
      title="Frequently Asked Questions"
      description="Everything you need to know about MiroMiro. Can't find an answer? Contact our support team."
    >
      <div class="mim-w-3xl mx-auto">
        <UAccordion :items="faqItems" />
      </div>
    </UPageSection>

    <!-- Still Have Questions -->
    <UPageSection
      title="Still have questions?"
      description="Can't find what you're looking for? We're here to help."
      :links="ctaLinks"
      class="bg-zinc-50"
    />

  </UPage>
</template>
