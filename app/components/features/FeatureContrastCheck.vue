<script setup lang="ts">
const hoveredCard = defineModel<string | null>('hoveredCard')
</script>

<template>
  <div 
    class="md:col-span-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between group relative transition-all duration-300 hover:border-zinc-300 hover:shadow-lg"
    @mouseenter="hoveredCard = 'contrast'"
    @mouseleave="hoveredCard = null"
  >
    <div>
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-300 px-2 py-0.5 rounded bg-white">
          Accessibility
        </span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold mt-6 mb-3 tracking-tight group-hover:translate-x-1 transition-transform text-zinc-900">
        WCAG Contrast Check
      </h3>
      <p class="text-sm text-zinc-500 leading-relaxed font-light">
        Instantly detect accessibility issues with WCAG 2.0 contrast analysis. Check entire pages or individual components while inspecting.
      </p>
    </div>

    <!-- Contrast Check Content -->
    <div class="mt-6 flex flex-col gap-3">
      <!-- General check result -->
      <div class="bg-white rounded-xl p-4 border border-zinc-200">
        <div class="flex items-center justify-between mb-3">
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Page Analysis</span>
          <span class="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">12 passed</span>
        </div>
        <div class="flex gap-2">
          <div class="flex-1 h-2 bg-emerald-500 rounded-full"></div>
          <div class="w-8 h-2 bg-amber-500 rounded-full"></div>
          <div class="w-4 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>
      
      <!-- Component check - Pass -->
      <div class="flex items-center justify-between bg-white  rounded-xl p-4 border border-zinc-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center">
            <span class="text-[10px] font-bold text-white">Aa</span>
          </div>
          <div>
            <span class="text-sm font-bold text-zinc-800">Text on Dark</span>
            <span class="text-[10px] text-zinc-500 block">Ratio: 15.8:1</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">AAA</span>
          <UIcon name="i-heroicons-check-circle-solid" class="w-5 h-5 text-emerald-500" />
        </div>
      </div>
      
      <!-- Component check - Fail -->
      <div class="flex items-center justify-between bg-white rounded-xl p-4 border border-zinc-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
            <span class="text-[10px] font-bold text-purple-400">Aa</span>
          </div>
          <div>
            <span class="text-sm font-bold text-zinc-800">Light on Light</span>
            <span class="text-[10px] text-zinc-500 block">Ratio: 1.4:1</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded">Fail</span>
          <UIcon name="i-heroicons-x-circle-solid" class="w-5 h-5 text-red-500" />
        </div>
      </div>
    </div>
  </div>
</template>
