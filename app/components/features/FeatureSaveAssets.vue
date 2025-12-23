<script setup lang="ts">
const hoveredCard = defineModel<string | null>('hoveredCard')
</script>

<template>
  <div 
    class="md:col-span-6 bg-white border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between group relative transition-all duration-300 hover:border-zinc-300 hover:shadow-lg"
    @mouseenter="hoveredCard = 'favorites'"
    @mouseleave="hoveredCard = null"
  >
    <div>
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-300 px-2 py-0.5 rounded bg-zinc-50">
          Organize
        </span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold mt-6 mb-3 tracking-tight group-hover:translate-x-1 transition-transform text-zinc-900">
        Save Assets for Later
      </h3>
      <p class="text-sm text-zinc-500 leading-relaxed font-light">
        Heart any color, icon, or asset to build your personal library. Never lose that perfect shade again.
      </p>
    </div>

    <!-- Favorites Content -->
    <div class="mt-6 flex flex-col gap-3">
      <!-- Saved color item 1 -->
      <div class="flex items-center justify-between bg-zinc-50 rounded-xl p-4 border border-zinc-200 group/item hover:border-purple-300 transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-white border border-zinc-200 shadow-sm"></div>
          <div>
            <span class="text-sm font-bold text-zinc-800">#FFFFFF</span>
            <span class="text-[10px] text-zinc-400 block">118 instances</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover/item:bg-red-100 transition-colors">
          <UIcon name="i-heroicons-heart-solid" class="w-4 h-4 text-red-500" />
        </div>
      </div>
      
      <!-- Saved color item 2 -->
      <div class="flex items-center justify-between bg-purple-50 rounded-xl p-4 border border-purple-200 group/item hover:border-purple-400 transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg border border-purple-200 shadow-sm" style="background-color: #CAC0DE;"></div>
          <div>
            <span class="text-sm font-bold text-zinc-800">#CAC0DE</span>
            <span class="text-[10px] text-zinc-400 block">15 instances</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover/item:bg-red-100 transition-colors">
          <UIcon name="i-heroicons-heart-solid" class="w-4 h-4 text-red-500" />
        </div>
      </div>
      
      <!-- Saved color item 3 -->
      <div class="flex items-center justify-between bg-zinc-50 rounded-xl p-4 border border-zinc-200 group/item hover:border-purple-300 transition-all">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 shadow-sm"></div>
          <div>
            <span class="text-sm font-bold text-zinc-800">#18181B</span>
            <span class="text-[10px] text-zinc-400 block">42 instances</span>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover/item:bg-red-100 transition-colors">
          <UIcon name="i-heroicons-heart-solid" class="w-4 h-4 text-red-500" />
        </div>
      </div>
    </div>
  </div>
</template>
