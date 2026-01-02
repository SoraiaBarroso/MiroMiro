<script setup lang="ts">
const hoveredCard = defineModel<string | null>('hoveredCard')
</script>

<template>
  <div 
    class="md:col-span-5 bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col group relative transition-all duration-300 hover:border-zinc-300 hover:shadow-lg"
    @mouseenter="hoveredCard = 'snatcher'"
    @mouseleave="hoveredCard = null"
  >
    <div>
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-300 px-2 py-0.5 rounded bg-zinc-50">
          All Media	
        </span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold mt-6 mb-3 tracking-tight group-hover:translate-x-1 transition-transform text-zinc-900">
        Save Images Instantly
      </h3>
      <p class="text-sm text-zinc-500 leading-relaxed font-light">
        Instantly isolate and grab SVGs, PNGs, and background videos hidden in the DOM.
      </p>
    </div>

    <!-- Snatcher Content -->
    <div class="mt-6 h-full">
      <video
        src="/landing/AssetExtractDemo.mp4"
        autoplay
        loop
        muted
        playsinline
        class="w-full border h-full border-zinc-200 rounded-lg object-cover"
      >
        Your browser doesn't support video.
      </video>
    </div>
  </div>
</template>
