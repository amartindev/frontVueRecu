<template>
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
      class="w-full min-h-screen bg-gray-50 pl-[22%] flex flex-col items-center justify-center px-6 text-center"
    >
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
        class="text-5xl font-extrabold mb-2 flex items-center justify-center"
        style="color: #1E1A54"
      >
        <ChartColumn class="w-14 h-14 inline-block mr-2" />
        VentaStats
      </h1>
  
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
        class="text-lg text-gray-600 mb-10"
      >
        Prueba técnica para
        <span class="font-semibold" style="color: #96008E">Recu</span>
      </p>
  
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 600 } }"
        class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl"
      >
        <router-link
          to="/dashboard"
          class="px-6 py-4 text-white rounded-2xl shadow hover:shadow-lg transition text-lg font-medium text-center"
          style="background-color: #96008E"
        >
          Ver Resumen de Ventas
        </router-link>
        <router-link
          to="/ventas"
          class="px-6 py-4 text-white rounded-2xl shadow hover:shadow-lg transition text-lg font-medium text-center"
          style="background-color: #1E1A54"
        >
          Ver Ventas Detalladas
        </router-link>
        <router-link
          to="/estadisticas"
          class="px-6 py-4 text-white rounded-2xl shadow hover:shadow-lg transition text-lg font-medium text-center"
          style="background-color: #FDD32D; color: #1E1A54"
        >
          Ver Estadísticas
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ChartColumn } from 'lucide-vue-next';
  </script>