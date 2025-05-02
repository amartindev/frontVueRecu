<template>
    <div v-if="loading" class="pl-[22%] pt-4 text-gray-600">Cargando datos...</div>
    <div v-else-if="fetchError" class="pl-[22%] pt-4 text-red-600">Error al cargar datos: {{ fetchError }}</div>
    <div
      v-else
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
      class="w-full h-full bg-gray-50 text-cyan-950 pl-[22%]"
    >
      <h1 class="text-2xl font-bold mb-4 pl-4 pt-4">Dashboard</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 mb-6 p-4">
        <!-- Card Total Ventas -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
          class="p-4 rounded-3xl bg-gray-100 shadow hover:shadow-lg hover:bg-gray-200 transition-shadow duration-300"
        >
          <div class="flex justify-between text-sm text-gray-500 pb-4">
            <p>Total de Ventas</p>
            <ShoppingCart class="w-5 h-5" />
          </div>
          <div class="text-xl font-semibold text-center">
            {{ formatCurrency(totalVentas) }}
          </div>
        </div>
  
        <!-- Card Media -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut', delay: 100 } }"
          class="p-4 rounded-3xl bg-gray-100 shadow hover:shadow-lg hover:bg-gray-200 transition-shadow duration-300"
        >
          <div class="flex justify-between text-sm text-gray-500 pb-4">
            <p>Media</p>
            <Calculator class="w-5 h-5" />
          </div>
          <div class="text-xl font-semibold text-center">{{ media.toFixed(2) }}</div>
        </div>
  
        <!-- Card Mediana -->
         <div
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut', delay: 200 } }"
          class="p-4 rounded-3xl bg-gray-100 shadow hover:shadow-lg hover:bg-gray-200 transition-shadow duration-300"
        >
          <div class="flex justify-between text-sm text-gray-500 pb-4">
            <p>Mediana</p>
            <ChartColumn class="w-5 h-5" />
          </div>
          <div class="text-xl font-semibold text-center">{{ mediana }}</div>
        </div>
  
         <!-- Card Moda -->
         <div
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut', delay: 300 } }"
          class="p-4 rounded-3xl bg-gray-100 shadow hover:shadow-lg hover:bg-gray-200 transition-shadow duration-300"
        >
          <div class="flex justify-between text-sm text-gray-500 pb-4">
            <p>Moda</p>
            <Package class="w-5 h-5" />
          </div>
          <div class="text-xl font-semibold text-center">{{ moda }}</div>
        </div>
      </div>
  
      <h2 class="text-xl font-bold mb-2 pl-4">Resumen de Ventas</h2>
  
      <div v-if="salesByProduct.length === 0 && !loading" class="p-4 text-gray-500">
          No hay datos de resumen de ventas disponibles.
      </div>
      <div v-else class="overflow-x-auto p-4">
        <div class="rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <table class="min-w-full">
            <thead class="bg-gray-100 text-left text-gray-700 text-sm">
              <tr>
                <th class="px-6 py-3">Producto</th>
                <th class="px-6 py-3">Cantidad Total</th>
                <th class="px-6 py-3">Precio Unitario</th>
                <th class="px-6 py-3">Ventas Totales</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-sm text-gray-800">
              <!-- Usar un ID si estuviera disponible en SaleByProduct para :key -->
              <tr
                v-for="(item, idx) in salesByProduct"
                :key="item.productName + '-' + idx"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4">{{ item.productName }}</td>
                <td class="px-6 py-4">{{ item.totalQuantity }}</td>
                <td class="px-6 py-4">{{ formatCurrency(item.price) }}</td>
                <td class="px-6 py-4">{{ formatCurrency(item.totalSalesValue) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Ref } from 'vue';
  import { ref, computed, onMounted } from 'vue';
  import { ShoppingCart, Calculator, ChartColumn, Package } from 'lucide-vue-next';
  import { formatCurrency } from '../utils/formatters';
  import type { SaleByProduct, GraphQLResponse, SalesByProductSummaryData } from '../types';
  
  const salesByProduct: Ref<SaleByProduct[]> = ref([]);
  const loading: Ref<boolean> = ref(true);
  const fetchError: Ref<string | null> = ref(null);
  
  const cantidades = computed<number[]>(() => salesByProduct.value.map((sale) => sale.totalQuantity));
  
  const totalVentas = computed<number>(() =>
    salesByProduct.value.reduce((sum, sale) => sum + (sale.totalSalesValue || 0), 0) // Añadir || 0 por seguridad
  );
  
  const media = computed<number>(() => {
      const nums = cantidades.value;
      if (nums.length === 0) return 0;
      const sum = nums.reduce((acc, quantity) => acc + (quantity || 0), 0);
      return sum / nums.length;
  });
  
  const mediana = computed<number>(() => {
    const nums = cantidades.value;
    if (nums.length === 0) return 0;
    const sorted = [...nums].sort((a, b) => (a || 0) - (b || 0));
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? (sorted[mid] || 0) : ((sorted[mid - 1] || 0) + (sorted[mid] || 0)) / 2;
  });
  
  const moda = computed<number>(() => {
    const nums = cantidades.value;
    if (nums.length === 0) return 0;
    const freq: Record<number, number> = {};
    let maxCount = 0;
    let modeValue = 0;
  
    nums.forEach((n) => {
        const num = n || 0;
        freq[num] = (freq[num] || 0) + 1;
    });
  
    for (const numStr in freq) {
        if (Object.prototype.hasOwnProperty.call(freq, numStr)){
            const currentNum = Number(numStr);
            if (freq[currentNum] > maxCount) {
                maxCount = freq[currentNum];
                modeValue = currentNum;
            }
        }
    }
    return modeValue;
  });
  
  
  // Hook del ciclo de vida para cargar datos
  onMounted(async () => {
    loading.value = true;
    fetchError.value = null;
    try {
      const res = await fetch("https://backrecupython.onrender.com/graphql/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            {
              salesByProductSummary {
                productName
                totalQuantity
                price
                totalSalesValue
              }
            }
          `,
        }),
      });
  
      if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
  
      const responseData: GraphQLResponse<SalesByProductSummaryData> = await res.json();
  
      if (responseData.errors) {
          throw new Error(`GraphQL Error: ${responseData.errors.map(e => e.message).join(', ')}`);
      }
  
      if (responseData.data?.salesByProductSummary) {
         salesByProduct.value = responseData.data.salesByProductSummary.map(item => ({
              productName: item.productName || 'N/A',
              totalQuantity: Number(item.totalQuantity) || 0,
              price: Number(item.price) || 0,
              totalSalesValue: Number(item.totalSalesValue) || 0,
          }));
      } else {
          console.warn("No sales data received or in unexpected format.");
          salesByProduct.value = [];
      }
  
    } catch (error: any) {
      console.error("Error fetching sales data:", error);
      fetchError.value = error.message || 'Ocurrió un error desconocido';
      salesByProduct.value = [];
    } finally {
      loading.value = false;
    }
  });
  </script>