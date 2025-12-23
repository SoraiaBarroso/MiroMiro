<script setup lang="ts">
const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  reverse?: boolean
  headlineLink?: string
}>(), {
  orientation: 'vertical',
  reverse: false,
  headlineLink: 'https://x.com/SoraiaDev/status/2000625339068731586'
})

const orientationClasses = computed(() => {
  if (props.orientation === 'horizontal') {
    return 'lg:grid-cols-2 lg:items-center'
  }
  return ''
})

const wrapperClasses = computed(() => {
  const classes = []

  if (props.orientation === 'vertical') {
    classes.push('text-center')
  }

  if (props.reverse) {
    classes.push('order-last')
  }

  return classes.join(' ')
})

const headlineClasses = computed(() => {
  const classes = ['mb-8', 'font-medium', 'text-black', 'flex', 'items-center', 'gap-1.5', 'font-sans', 'text-sm', 'sm:text-base']

  if (props.orientation === 'vertical') {
    classes.push('justify-center')
  }

  return classes.join(' ')
})

const descriptionClasses = computed(() => {
  const classes = [ 'text-muted']

  if (props.orientation === 'horizontal') {
    classes.push('text-pretty')
  } else {
    classes.push('text-balance')
  }

  return classes.join(' ')
})

const linksClasses = computed(() => {
  const classes = ['flex', 'flex-wrap', 'gap-x-6', 'gap-y-3']

  if (props.orientation === 'vertical') {
    classes.push('justify-center')
  }

  return classes.join(' ')
})
</script>

<style scoped>
@keyframes slideArrow {
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(4px) translateY(-4px);
  }
}

.arrow-animate:hover .arrow-icon {
  animation: slideArrow 1.5s ease-in-out infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 3.5s ease-in-out infinite;
  animation-delay: 0.5s;
}

.animate-float-slow {
  animation: float 4s ease-in-out infinite;
  animation-delay: 1s;
}

.floating-element .tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: white;
  color: black;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.floating-element .tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid white;
}

.floating-element:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-12px);
}

.headline-badge {
  position: relative;
  background: #fafafa;
  border: 1px solid #e4e4e7;
}

.headline-badge::before {
  content: '';
  position: absolute;
  inset: -1px;
  padding: 1px;
  border-radius: 9999px;
  background: linear-gradient(to right, #a855f7, #7c3aed);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  opacity: 0.6;
}
</style>

<template>
  <div class="relative isolate overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
    <!-- Subtle grid background pattern -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"></div>
    </div>

    <div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-10">
      <div :class="['flex flex-col lg:grid py-24 sm:py-32 lg:py-32 gap-16 sm:gap-y-24', orientationClasses]">

        <!-- Main content wrapper -->
        <div :class="wrapperClasses">
          <!-- Header slot -->
          <div v-if="$slots.header">
            <slot name="header" />
          </div>

          <!-- Headline slot -->
          <div v-if="$slots.headline" :class="headlineClasses">
            <NuxtLink
              v-if="headlineLink"
              :to="headlineLink"
              target="_blank"
              rel="noopener noreferrer"
              class="headline-badge arrow-animate flex items-center gap-2 rounded-full px-4 py-1.5 w-fit mx-auto shadow-sm transition-all hover:shadow-md group"
            >
              <span class="text-xs font-bold uppercase tracking-widest text-zinc-600">
                <slot name="headline"/>
              </span>
              <UIcon name="i-heroicons:arrow-up-right-20-solid" class="arrow-icon w-3.5 h-3.5 transition-transform text-purple-500 group-hover:text-purple-600" />
            </NuxtLink>
            <div v-else class="flex gap-2 w-fit mx-auto rounded-full px-3 py-2 border border-white text-black bg-muted shadow-lg">
              <slot name="headline"/>
            </div>
          </div>

          <!-- Title slot -->
          <h1 v-if="$slots.title" class="text-4xl sm:text-6xl lg:text-7xl text-pretty tracking-tight font-black text-zinc-900">
            <slot name="title" />
          </h1>

          <!-- Description slot -->
          <p v-if="$slots.description" :class="['mt-6 text-base lg:text-lg text-zinc-500 font-light leading-relaxed max-w-2xl mx-auto', descriptionClasses]">
            <slot name="description" />
          </p>

          <!-- Body slot -->
          <div v-if="$slots.body" class="mt-10">
            <slot name="body" />
          </div>

          <!-- Links/Actions slot -->
          <div v-if="$slots.links" :class="['mt-10', linksClasses]">
            <slot name="links" />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="mt-10">
            <slot name="footer" />
          </div>

          <!-- Video demo slot -->
          <div v-if="$slots['video-demo']" class="mt-14 w-full max-w-4xl mx-auto">
            <div class="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-2xl bg-zinc-900 p-1">
              <div class="rounded-xl overflow-hidden">
                <slot name="video-demo" />
              </div>
            </div>
          </div>
        </div>

        <!-- Side content (for horizontal orientation) -->
        <div v-if="$slots.default">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
ss="t