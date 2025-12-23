<script setup lang="ts">
const hoveredCard = defineModel<string | null>('hoveredCard')
</script>

<template>
  <div 
    class="md:col-span-4 bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between group relative transition-all duration-300 hover:border-zinc-300 hover:shadow-lg"
    @mouseenter="hoveredCard = 'lottie'"
    @mouseleave="hoveredCard = null"
  >
    <div>
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-300 px-2 py-0.5 rounded bg-zinc-50">
          Animations
        </span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold mt-6 mb-3 tracking-tight group-hover:translate-x-1 transition-transform text-zinc-900">
        Steal the Motion Magic
      </h3>
      <p class="text-sm text-zinc-500 leading-relaxed font-light">
        One-click Lottie export. Download motion data without touching the network tab.
      </p>
    </div>

    <!-- Lottie Content -->
    <div class="mt-6 flex flex-col items-center relative">
      <!-- Animation Preview Container -->
      <div class="relative w-full aspect-square max-w-50 flex items-center justify-center  bg-white/90 rounded-xl border border-zinc-200 overflow-hidden">
        <!-- GIF/Image Preview -->
        <img 
          src="/landing/lottie-demo.gif" 
          alt="Lottie animation preview"
          class="w-full h-full object-contain p-4 transition-all duration-300 group-hover:scale-105 group-hover:opacity-20"
        />
        
        <!-- Download overlay on hover -->
        <div class="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2 animate-bounce">
            <UIcon name="i-heroicons-arrow-down-tray" class="w-6 h-6 text-white" />
          </div>
          <span class="text-xs font-bold text-zinc-700">Click to Export</span>
          <span class="text-[10px] text-zinc-500">.json ready</span>
        </div>
      </div>
      
      <!-- File info badge -->
      <div class="mt-4 flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-full border border-zinc-200">
        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span class="text-[10px] text-zinc-600 font-mono tracking-tight">animation.json</span>
        <span class="text-[9px] text-zinc-400">• 4.2KB</span>
      </div>
    </div>
  </div>
</template>
