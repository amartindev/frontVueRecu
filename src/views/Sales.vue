<template>
    <div v-if="loading" class="pl-[22%] pt-4 text-gray-600">Cargando datos...</div>
     <div v-else-if="fetchError" class="pl-[22%] pt-4 text-red-600">Error al cargar datos: {{ fetchError }}</div>
    <div
      v-else
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
      class='w-full h-full bg-gray-50 text-cyan-950 pl-[22%]'
    >
      <h1 class='text-2xl font-bold mb-4 pl-4 pt-4'>Tabla de Ventas</h1>
      <h2 class='text-xl font-light mb-6 p-4'>
        Listado completo de productos vendidos y cantidad de veces vendidos
      </h2>
  
      <div v-if="sales.length === 0 && !loading" class="p-4 text-gray-500">
          No hay datos de ventas disponibles.
      </div>
      <div v-else class='overflow-x-auto p-4'>
        <div class='rounded-lg shadow-sm overflow-hidden border border-gray-200'>
          <table class='min-w-full'>
            <thead class='bg-gray-100 text-left text-gray-700 text-sm'>
              <tr>
                <th class='px-6 py-3'>Producto</th>
                <th class='px-6 py-3'>Cantidad</th>
                <th class='px-6 py-3'>Fecha</th>
                <th class='px-6 py-3'>Precio Unitario</th>
                <th class='px-6 py-3'>Total</th>
              </tr>
            </thead>
            <tbody class='divide-y divide-gray-200 text-sm text-gray-800'>
              <tr
                v-for="sale in sales"
                :key="sale.id"
                class='hover:bg-gray-50 transition-colors'
              >
                <td class='px-6 py-4'>{{ sale.product?.name ?? 'N/A' }}</td>
                <td class='px-6 py-4'>{{ sale.quantity }}</td>
                <td class='px-6 py-4'>{{ formatDate(sale.date) }}</td>
                <td class='px-6 py-4'>{{ formatCurrency(sale.product?.price) }}</td>
                <td class='px-6 py-4'>{{ formatCurrency(sale.quantity * (sale.product?.price ?? 0)) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Ref } from 'vue';
  import { ref, onMounted } from 'vue';
  import { formatCurrency } from '../utils/formatters';
  import type { Sale, GraphQLResponse, AllSalesData } from '../types';
  
  const sales: Ref<Sale[]> = ref([]);
  const loading: Ref<boolean> = ref(true);
  const fetchError: Ref<string | null> = ref(null);
  
  // Función para formatear fecha con tipo
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
          return 'Fecha inválida';
      }
      return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Fecha inválida';
    }
  };
  
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
              allSales {
                id
                quantity
                date
                product {
                  name
                  price
                }
              }
            }
          `,
        }),
      });
  
      if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
  
      const responseData: GraphQLResponse<AllSalesData> = await res.json();
  
      if (responseData.errors) {
           throw new Error(`GraphQL Error: ${responseData.errors.map(e => e.message).join(', ')}`);
      }
  
      if (responseData.data?.allSales) {
       // Mapear y asegurar tipos
       sales.value = responseData.data.allSales.map(s => ({
          id: s.id,
          quantity: Number(s.quantity) || 0,
          date: s.date,
          product: {
              name: s.product?.name || 'Producto Desconocido',
              price: Number(s.product?.price) || 0
          }
        }));
      } else {
        console.warn("No sales data received or in unexpected format.");
        sales.value = [];
      }
  
    } catch (error: any) {
      console.error("Error fetching sales:", error);
      fetchError.value = error.message || 'Ocurrió un error desconocido';
      sales.value = [];
    } finally {
      loading.value = false;
    }
  });
  </script>