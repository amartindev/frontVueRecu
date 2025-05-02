<template>
    <div v-if="loading" class='pl-[22%] pt-4 text-gray-600'>Cargando estadísticas...</div>
    <div v-else-if="fetchError" class="pl-[22%] pt-4 text-red-600">Error al cargar estadísticas: {{ fetchError }}</div>
    <div v-else class='p-8 bg-gray-50 text-cyan-950 pl-[22%]'>
      <h1 class='text-2xl font-bold mb-6'>Estadísticas de Ventas</h1>
  
      <!-- Gráfico de Barras -->
      <div class='mb-12 min-h-[400px]'>
        <h2 class="text-xl font-semibold mb-4 text-center text-slate-700">Ventas por Producto</h2>
        <div v-if="!salesByProduct || salesByProduct.length === 0" class="text-center text-gray-500 pt-10">
          No hay datos disponibles para mostrar el gráfico de ventas por producto.
        </div>
        <div v-else class="h-[400px]">
           <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div>
  
      <!-- Gráfico de Líneas -->
       <div class='mb-12 min-h-[400px]'>
         <h2 class="text-xl font-semibold mb-4 text-center text-slate-700">Ventas por Mes</h2>
         <div v-if="!salesByMonth || salesByMonth.length === 0" class="text-center text-gray-500 pt-10">
           No hay datos disponibles para mostrar el gráfico de ventas por mes.
         </div>
         <div v-else class="h-[400px]">
           <Line :data="lineChartData" :options="lineChartOptions" />
         </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { Ref } from 'vue';
  import { ref, computed, onMounted } from 'vue';
  import { Bar, Line } from 'vue-chartjs';
  import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'; // Importar tipos de Chart.js
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from 'chart.js';
  import { formatCurrency } from '../utils/formatters';
  // Importa las interfaces necesarias
  import type { SaleByProduct, SalesByMonth, GraphQLResponse, StatisticsData } from '../types';
  
  
  // Registrar componentes de Chart.js
  ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler
  );
  
  // Estado reactivo tipado
  const salesByProduct: Ref<SaleByProduct[]> = ref([]);
  const salesByMonth: Ref<SalesByMonth[]> = ref([]);
  const loading: Ref<boolean> = ref(true);
  const fetchError: Ref<string | null> = ref(null);
  
  // --- Configuración Gráfico de Barras ---
  const barChartData = computed<ChartData<'bar'>>(() => ({
    labels: salesByProduct.value.map((item) => item.productName),
    datasets: [
      {
        label: 'Cantidad Vendida', // Label para tooltip/leyenda
        data: salesByProduct.value.map((item) => item.totalQuantity),
        backgroundColor: salesByProduct.value.map((_, index) =>
          index % 2 === 0 ? '#96008E' : '#FDD32D' // Rosa y Amarillo
        ),
        borderColor: salesByProduct.value.map((_, index) =>
           index % 2 === 0 ? '#7a0071' : '#cca723'
        ),
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 40, 
      },
    ],
  }));
  
  const barChartOptions = computed<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { 
        display: false,
      },
      legend: { display: false }, 
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          title: function(tooltipItems: TooltipItem<'bar'>[]) {
               return tooltipItems[0]?.label ?? '';
          },
          label: function (context: TooltipItem<'bar'>) {
            const quantity = context.parsed.y;
            return `${context.dataset.label}: ${quantity}`; 
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Productos', font: { size: 14 }, color: '#475569'},
        ticks: { color: '#475569', font: { size: 12 } },
        grid: { display: false }, 
      },
      y: {
        title: { display: true, text: 'Cantidad Vendida', font: { size: 14 }, color: '#475569'},
        beginAtZero: true, 
        ticks: { color: '#475569', font: { size: 12 }, precision: 0 }, 
        grid: { color: '#e2e8f0' }, 
      },
    },

    animation: {
        duration: 800,
        easing: 'easeOutQuart'
    }
  }));
  
  // --- Configuración Gráfico de Líneas ---
  const lineChartData = computed<ChartData<'line'>>(() => ({
      labels: salesByMonth.value
          .sort((a,b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime()) // Ordenar por fecha
          .map((item) => {
              try {
                  // Validar formato YYYY-MM y convertir a fecha
                  const date = new Date(item.month + '-01T00:00:00Z'); // Usar UTC para evitar problemas de zona horaria
                  if (isNaN(date.getTime())) return item.month; // Fallback
                  const label = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric', timeZone: 'UTC' });
                  return label.charAt(0).toUpperCase() + label.slice(1);
              } catch(e) {
                  console.warn("Error parsing month:", item.month, e);
                  return item.month; // Fallback
              }
          }),
    datasets: [
      {
        label: 'Ventas Totales (€)',
        data: salesByMonth.value
              .sort((a,b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime()) // Ordenar igual que labels
              .map((item) => item.totalSales),
        borderColor: '#1E1A54', 
        backgroundColor: 'rgba(30, 26, 84, 0.2)', 
        pointBackgroundColor: '#1E1A54', 
        pointBorderColor: '#ffffff', 
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#1E1A54',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }));
  
  const lineChartOptions = computed<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
     plugins: {
      title: {
        display: false,
      },
      legend: { display: false },
      tooltip: {
         backgroundColor: 'rgba(0, 0, 0, 0.7)',
         titleFont: { size: 14, weight: 'bold' },
         bodyFont: { size: 12 },
         padding: 10,
         cornerRadius: 4,
         callbacks: {
          // Título (Mes y año)
           title: function(tooltipItems: TooltipItem<'line'>[]) {
               return tooltipItems[0]?.label ?? '';
           },
           // Label (formateado como moneda)
           label: function (context: TooltipItem<'line'>) {
             const value = context.parsed.y;
             return `${context.dataset.label}: ${formatCurrency(value)}`;
           },
         },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Mes', font: { size: 14 }, color: '#475569'},
        ticks: { color: '#475569', font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'Ventas Totales (€)', font: { size: 14 }, color: '#475569'},
        beginAtZero: true,
        ticks: {
           color: '#475569',
           font: { size: 12 },
           // Formatear ticks del eje Y como moneda
           callback: function(value) {
               if (typeof value === 'number') {
                   return formatCurrency(value);
               }
               return value;
           }
        },
        grid: { color: '#e2e8f0' },
      },
    },

     animation: {
        duration: 800,
        easing: 'easeOutQuart'
     }
  }));
  
  onMounted(async () => {
    loading.value = true;
    fetchError.value = null;
    try {
      const res = await fetch("http://localhost:8000/graphql/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `{
            salesByProductSummary { productName totalQuantity price totalSalesValue }
            salesByMonth { month totalSales }
          }`,
        }),
      });
  
       if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
       }
  
      const responseData: GraphQLResponse<StatisticsData> = await res.json();
  
       if (responseData.errors) {
           throw new Error(`GraphQL Error: ${responseData.errors.map(e => e.message).join(', ')}`);
       }
  
      if (responseData.data) {
          // Procesar salesByProductSummary
          if (responseData.data.salesByProductSummary) {
              salesByProduct.value = responseData.data.salesByProductSummary.map(item => ({
                  productName: item.productName || 'N/A',
                  totalQuantity: Number(item.totalQuantity) || 0,
                  price: Number(item.price) || 0,
                  totalSalesValue: Number(item.totalSalesValue) || 0,
              }));
          } else {
               console.warn("Sales by product data missing.");
               salesByProduct.value = [];
          }
  
          // Procesar salesByMonth
          if (responseData.data.salesByMonth) {
               salesByMonth.value = responseData.data.salesByMonth.map(item => ({
                  // Validar formato YYYY-MM si es posible
                  month: item.month,
                  totalSales: Number(item.totalSales) || 0,
              }));
          } else {
              console.warn("Sales by month data missing.");
              salesByMonth.value = [];
          }
  
      } else {
           console.warn("No data received in GraphQL response.");
           salesByProduct.value = [];
           salesByMonth.value = [];
      }
  
    } catch (error: any) {
      console.error("Error fetching statistics:", error);
      fetchError.value = error.message || 'Ocurrió un error desconocido';
      salesByProduct.value = []; 
      salesByMonth.value = [];
    } finally {
      loading.value = false;
    }
  });
  </script>
  
  <style scoped>

  </style>