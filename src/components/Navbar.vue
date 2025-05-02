<template>
    <div
      v-motion
      :initial="{ x: -200, opacity: 0 }"
      :enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 70, damping: 12 } }"
      class="fixed z-20 left-0 top-0 h-screen w-1/5 bg-[#1E1A54] text-white flex flex-col items-left space-y-4 p-6"
    >
      <div class="flex flex-row gap-4 items-center">
        <ChartColumn class="w-8 h-8" />
        <span class="text-2xl font-bold">VentaStats</span>
      </div>
  
      <div class="flex flex-col gap-4 mt-10">
        <div
          v-for="(item, index) in navItems"
          :key="item.path"
          v-motion
          :initial="{ opacity: 0, y: -20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 200, ease: 'easeOut' } }"
        >
          <router-link
            :to="item.path"
            :class="[
              'flex flex-row gap-3.5 items-center cursor-pointer p-2 border-0 rounded-md',
              currentPath === item.path
                ? 'bg-fuchsia-900 text-white'
                : 'text-gray-300 hover:bg-indigo-900 hover:text-white'
            ]"
          >
            <component :is="item.icon" :class="item.iconClass" />
            <p>{{ item.label }}</p>
          </router-link>
        </div>
      </div>
  
      <router-link
        to="/"
        :class="[
          'flex flex-row gap-3.5 items-center cursor-pointer p-2 border-0 rounded-md absolute bottom-6 left-6',
          currentPath === '/' ? 'text-white font-semibold' : 'text-gray-300'
        ]"
      >
        <House class="text-green-600 w-7 h-7" />
        <p>Inicio</p>
      </router-link>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import type { RouteLocationNormalizedLoaded } from 'vue-router';
  import { useRoute } from 'vue-router';
  import { ChartColumn, LayoutDashboard, ShoppingBag, House } from 'lucide-vue-next';
  
  interface NavItem {
    path: string;
    icon: any;
    label: string;
    iconClass: string;
  }
  
  const route = useRoute() as RouteLocationNormalizedLoaded;
  const currentPath = computed<string>(() => route.path);
  
  const navItems: NavItem[] = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', iconClass: 'text-cyan-400 w-7 h-7' },
    { path: '/ventas', icon: ShoppingBag, label: 'Ventas', iconClass: 'text-purple-600 w-7 h-7' },
    { path: '/estadisticas', icon: ChartColumn, label: 'Estadísticas', iconClass: 'text-yellow-600 w-7 h-7' },
  ];
  </script>
  