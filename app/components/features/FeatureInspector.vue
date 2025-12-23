<script setup lang="ts">
const hoveredCard = defineModel<string | null>('hoveredCard')
</script>

<template>
  <div 
    class="md:col-span-7 bg-zinc-50 border border-zinc-200 rounded-2xl p-8 flex flex-col justify-between group relative transition-all duration-300 hover:border-zinc-300 hover:shadow-lg"
    @mouseenter="hoveredCard = 'inspector'"
    @mouseleave="hoveredCard = null"
  >
    <div>
      <div class="flex justify-between items-start">
        <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-300 px-2 py-0.5 rounded bg-white">
          Inspect
        </span>
      </div>
      <h3 class="text-2xl md:text-3xl font-extrabold mt-6 mb-3 tracking-tight group-hover:translate-x-1 transition-transform text-zinc-900">
        Surgical Inspector Mode
      </h3>
      <p class="text-sm text-zinc-500 leading-relaxed font-light">
        Point, hover, and reveal. Get an instant style breakdown, colors, typography, and spacing, without ever opening the inspector panel.
      </p>
    </div>

    <!-- Inspector Content - Interactive SVG -->
    <div class="relative bg-white border border-zinc-200 rounded-xl p-6 overflow-hidden mt-6 group-hover:border-zinc-300 transition-colors shadow-sm">
      <svg viewBox="0 0 400 200" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <!-- Background mock webpage -->
        <rect x="0" y="0" width="400" height="200" fill="#fafafa"/>
        
        <!-- Nav bar -->
        <rect x="20" y="15" width="360" height="8" rx="2" fill="#e4e4e7"/>
        
        <!-- Hero text lines -->
        <rect x="20" y="45" width="180" height="12" rx="2" fill="#d4d4d8"/>
        <rect x="20" y="62" width="140" height="8" rx="2" fill="#e4e4e7"/>
        
        <!-- The inspected element (button) -->
        <g class="inspected-element">
          <!-- Button background -->
          <rect x="20" y="85" width="100" height="32" rx="6" fill="#18181b" class="transition-all duration-300"/>
          <text x="70" y="106" text-anchor="middle" fill="white" font-size="11" font-weight="600">Get Started</text>
          
          <!-- Hover bounding box - appears on hover -->
          <rect 
            x="17" y="82" width="106" height="38" rx="8" 
            fill="none" 
            stroke="#8b5cf6" 
            stroke-width="2"
            stroke-dasharray="4 2"
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          <!-- Corner handles -->
          <circle cx="17" cy="82" r="3" fill="#8b5cf6" class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
          <circle cx="123" cy="82" r="3" fill="#8b5cf6" class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
          <circle cx="17" cy="120" r="3" fill="#8b5cf6" class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
          <circle cx="123" cy="120" r="3" fill="#8b5cf6" class="opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        </g>
        
        <!-- Spacing indicators - appear on hover -->
        <g class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <!-- Top spacing line -->
          <line x1="70" y1="62" x2="70" y2="85" stroke="#f97316" stroke-width="1" stroke-dasharray="3 2"/>
          <rect x="58" y="68" width="24" height="12" rx="2" fill="#f97316"/>
          <text x="70" y="77" text-anchor="middle" fill="white" font-size="8" font-weight="600">23px</text>
          
          <!-- Left spacing line -->
          <line x1="0" y1="101" x2="20" y2="101" stroke="#f97316" stroke-width="1" stroke-dasharray="3 2"/>
          <rect x="2" y="95" width="16" height="12" rx="2" fill="#f97316"/>
          <text x="10" y="104" text-anchor="middle" fill="white" font-size="7" font-weight="600">20px</text>
        </g>
        
        <!-- Popover panel - appears on hover -->
        <g class="opacity-0 group-hover:opacity-100 transition-all duration-300" style="transform: translateY(5px);" >
          <!-- Popover background with shadow -->
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
            </filter>
          </defs>
          
          <!-- Connector line -->
          <line x1="123" y1="101" x2="145" y2="101" stroke="#8b5cf6" stroke-width="2"/>
          
          <!-- Main popover -->
          <rect x="145" y="35" width="150" height="130" rx="8" fill="white" filter="url(#shadow)" stroke="#e4e4e7"/>
          
          <!-- Header -->
          <rect x="145" y="35" width="150" height="28" rx="8" fill="#18181b"/>
          <rect x="145" y="55" width="150" height="8" fill="#18181b"/>
          <text x="157" y="54" fill="white" font-size="9" font-weight="700">BUTTON.CTA_PRIMARY</text>
          
          <!-- Properties -->
          <!-- Font -->
          <text x="157" y="80" fill="#a1a1aa" font-size="8" font-weight="600">FONT</text>
          <text x="157" y="92" fill="#3f3f46" font-size="9" font-weight="500">Inter · 14px · 600</text>
          
          <!-- Color -->
          <text x="157" y="108" fill="#a1a1aa" font-size="8" font-weight="600">BACKGROUND</text>
          <rect x="157" y="112" width="12" height="12" rx="2" fill="#18181b" stroke="#d4d4d8"/>
          <text x="173" y="122" fill="#3f3f46" font-size="9" font-weight="500">#18181B</text>
          
          <!-- Padding -->
          <text x="157" y="138" fill="#a1a1aa" font-size="8" font-weight="600">PADDING</text>
          <text x="157" y="150" fill="#3f3f46" font-size="9" font-weight="500">12px 24px</text>
          
          <!-- Border radius -->
          <text x="230" y="138" fill="#a1a1aa" font-size="8" font-weight="600">RADIUS</text>
          <text x="230" y="150" fill="#3f3f46" font-size="9" font-weight="500">6px</text>
        </g>
        
        <!-- Sidebar placeholder -->
        <rect x="300" y="45" width="80" height="80" rx="4" fill="#f4f4f5" stroke="#e4e4e7"/>
        <rect x="310" y="55" width="60" height="8" rx="2" fill="#e4e4e7"/>
        <rect x="310" y="68" width="40" height="6" rx="2" fill="#e4e4e7"/>
        <rect x="310" y="80" width="50" height="6" rx="2" fill="#e4e4e7"/>
        
        <!-- Cursor icon - moves on hover -->
        <g class="transition-transform duration-500 group-hover:translate-x-[-180px] group-hover:translate-y-[-20px]" style="transform-origin: center;">
          <path 
            d="M320 160 L320 175 L325 171 L329 180 L332 179 L328 170 L334 170 Z" 
            fill="#18181b" 
            stroke="white" 
            stroke-width="1.5"
            class="transition-all duration-500"
          />
        </g>
      </svg>
      
      <!-- Hover instruction -->
      <div class="absolute bottom-3 right-3 text-[10px] text-zinc-400 font-mono opacity-60 group-hover:opacity-0 transition-opacity">
        Hover to inspect →
      </div>
    </div>
  </div>
</template>
