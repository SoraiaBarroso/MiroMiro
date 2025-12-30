<script setup lang="ts">
const hoveredCard = defineModel<string | null>('hoveredCard')
</script>

<template>
  <div 
    class="md:col-span-12 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between group relative transition-all duration-300 hover:border-zinc-300 hover:shadow-lg"
    @mouseenter="hoveredCard = 'reverse'"
    @mouseleave="hoveredCard = null"
  >
    <div>
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-300 px-2 py-0.5 rounded bg-white">
          Design System
        </span>
        <span class="text-[10px] font-bold uppercase tracking-widest text-purple-600 border border-purple-300 px-2 py-0.5 rounded bg-purple-50">
          Pro Feature
        </span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold mt-6 mb-3 tracking-tight group-hover:translate-x-1 transition-transform text-zinc-900">
        Export Ready-to-Use Design Tokens
      </h3>
      <p class="text-sm text-zinc-500 leading-relaxed font-light">
        Extract complete color palettes from any website. Get organized tokens ready to paste into your codebase.
      </p>
    </div>

    <!-- Design System Content -->
    <div class="mt-8 flex flex-wrap gap-2">
      <div class="group/token relative flex-1 h-20 rounded-lg border border-purple-200 overflow-hidden bg-purple-50 hover:scale-105 transition-transform cursor-pointer">
        <div class="absolute inset-0 bg-purple-100"></div>
        <div class="absolute bottom-2 left-2 text-[9px] font-mono text-purple-400 group-hover/token:text-purple-600 transition-colors">purple-50</div>
      </div>
      <div class="group/token relative flex-1 h-20 rounded-lg border border-purple-300 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
        <div class="absolute inset-0 bg-purple-200"></div>
        <div class="absolute bottom-2 left-2 text-[9px] font-mono text-purple-500 group-hover/token:text-purple-700 transition-colors">purple-200</div>
      </div>
      <div class="group/token relative flex-1 h-20 rounded-lg border border-purple-400 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
        <div class="absolute inset-0 bg-purple-400"></div>
        <div class="absolute bottom-2 left-2 text-[9px] font-mono text-white/80 group-hover/token:text-white transition-colors">purple-400</div>
      </div>
      <div class="group/token relative flex-1 h-20 rounded-lg border border-purple-600 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
        <div class="absolute inset-0 bg-purple-600"></div>
        <div class="absolute bottom-2 left-2 text-[9px] font-mono text-white/80 group-hover/token:text-white transition-colors">purple-600</div>
      </div>
      <div class="group/token relative flex-1 h-20 rounded-lg border border-purple-900 overflow-hidden hover:scale-105 transition-transform cursor-pointer">
        <div class="absolute inset-0 bg-purple-900"></div>
        <div class="absolute bottom-2 left-2 text-[9px] font-mono text-white/70 group-hover/token:text-white transition-colors">purple-900</div>
      </div>
      <div class="flex-none w-36 flex flex-col justify-center px-4 border-l border-zinc-200 ml-4">
        <span class="text-[10px] text-zinc-400 uppercase font-bold">Format</span>
        <span class="text-sm font-bold text-zinc-900">Tailwind / CSS</span>
      </div>
    </div>
  </div>
</template>
