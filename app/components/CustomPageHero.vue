<script setup lang="ts">
const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
  reverse?: boolean
}>(), {
  orientation: 'vertical',
  reverse: false
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
  const classes = ['text-lg', 'sm:text-xl/8', 'text-muted']

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
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
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
</style>

<template>
  <div class="relative isolate overflow-hidden">
    <!-- Dot background pattern with radial fade -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.35)_1.5px,transparent_1.5px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"></div>
    </div>

    <div class="hidden lg:flex floating-element border-2 border-white bg-muted rounded-xl absolute w-15 h-15 lg:top-20 lg:left-20 2xl:top-20 2xl:left-60 items-center justify-center shadow-lg animate-float">
      <div class="tooltip">Extract SVG's</div>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="#71767B" stroke="null" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" stroke-dashoffset="0px" opacity="1" fill-opacity="1" stroke-opacity="1" font-family="TwitterChirp, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif" font-size="15px" font-weight="400" text-anchor="start" dominant-baseline="auto" stop-color="#000000" stop-opacity="1" width="32" height="32"><g fill="#71767B" stroke="null" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" stroke-dashoffset="0px" opacity="1" fill-opacity="1" stroke-opacity="1" font-family="TwitterChirp, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif" font-size="15px" font-weight="400" text-anchor="start" dominant-baseline="auto" stop-color="#000000" stop-opacity="1"><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z" fill="#71767B" stroke="null" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" stroke-dashoffset="0px" opacity="1" fill-opacity="1" stroke-opacity="1" font-family="TwitterChirp, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif" font-size="15px" font-weight="400" text-anchor="start" dominant-baseline="auto" stop-color="#000000" stop-opacity="1"></path></g></svg>
    </div>

    <div class="hidden lg:flex floating-element border-2 border-white bg-muted rounded-xl absolute w-15 h-15 lg:bottom-30 lg:left-20 2xl:bottom-36 2xl:left-65 items-center justify-center shadow-lg animate-float">
      <div class="tooltip">Extract fonts</div>
      <div class="flex items-center justify-center w-[80%] h-[80%] rounded-lg text-black font-bold text-xl">Aa</div>
    </div>

    <div class="hidden lg:flex floating-element border-2 border-white bg-muted rounded-xl absolute w-15 h-15 lg:top-36 lg:right-28 2xl:top-35 2xl:right-40 items-center justify-center shadow-lg animate-float-delayed">
      <div class="tooltip">Extract images</div>
      <NuxtImg src="/exlanding.png" width="45" alt="tomato"/>
    </div>

    <div class="hidden lg:flex floating-element border-2 border-white bg-muted rounded-xl absolute w-15 h-15 lg:bottom-25 lg:right-40 2xl:bottom-15 2xl:right-68 items-center justify-center shadow-lg animate-float-slow">
      <div class="tooltip">Extract colors</div>
      <div class="w-[80%] h-[80%] rounded-lg bg-primary"></div>
    </div>

    <div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-10">
      <div :class="['flex flex-col lg:grid py-24 sm:py-32 lg:py-40 gap-16 sm:gap-y-24', orientationClasses]">

        <!-- Main content wrapper -->
        <div :class="wrapperClasses">
          <!-- Header slot -->
          <div v-if="$slots.header">
            <slot name="header" />
          </div>

          <!-- Headline slot -->
          <div v-if="$slots.headline" :class="headlineClasses" class="flex gap-2 w-fit mx-auto rounded-full pr-2.5 pl-1 py-1 border border-white text-black bg-muted shadow-lg">
            <div class="flex text-success-700 border border-white items-center gap-2 rounded-full px-2.5 py-1 bg-muted shadow-sm">
              <span class="relative flex size-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-700 opacity-75"></span>
                <span class="relative inline-flex size-2 rounded-full bg-success-700"></span>
              </span>
              <span class="text-sm">Now</span>
            </div>
            <slot name="headline"/>
          </div>

          <!-- Title slot -->
          <h1 v-if="$slots.title" class="text-5xl sm:text-7xl text-pretty tracking-tight font-bold text-highlighted">
            <slot name="title" />
          </h1>

          <!-- Description slot -->
          <p v-if="$slots.description" :class="['mt-6', descriptionClasses]">
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
        </div>

        <!-- Side content (for horizontal orientation) -->
        <div v-if="$slots.default">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
