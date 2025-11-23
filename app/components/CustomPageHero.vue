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

<template>
  <div class="relative isolate">
    <!-- Default slot for background elements like images -->
    <slot name="background" />

    <div class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8">
      <div :class="['flex flex-col lg:grid py-24 sm:py-32 lg:py-40 gap-16 sm:gap-y-24', orientationClasses]">

        <!-- Main content wrapper -->
        <div :class="wrapperClasses">
          <!-- Header slot -->
          <div v-if="$slots.header">
            <slot name="header" />
          </div>

          <!-- Headline slot -->
          <div v-if="$slots.headline" :class="headlineClasses" class="flex gap-2 w-fit mx-auto rounded-full pr-2.5 pl-1 py-1 border border-white text-black bg-muted shadow-lg">
            <div class="flex text-warning border border-white items-center gap-2 rounded-full px-2.5 py-1 bg-muted shadow-sm">
              <span class="relative flex size-2">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75"></span>
                <span class="relative inline-flex size-2 rounded-full bg-warning"></span>
              </span>
              <span class="text-sm">Coming Soon</span>
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
