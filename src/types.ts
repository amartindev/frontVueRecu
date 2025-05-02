// src/types.ts

export interface Product {
    name: string;
    price: number;
  }
  
  export interface Sale {
    id: string;
    quantity: number;
    date: string;
    product: Product;
  }
  
  export interface SaleByProduct {
    productName: string;
    totalQuantity: number;
    price: number;
    totalSalesValue: number;
  }
  
  export interface SalesByMonth {
    month: string; // Formato YYYY-MM
    totalSales: number;
  }
  

  export interface SalesByProductSummaryData {
    salesByProductSummary: SaleByProduct[];
  }
  
  export interface AllSalesData {
    allSales: Sale[];
  }
  
  export interface SalesByMonthData {
     salesByMonth: SalesByMonth[];
  }
  

  export interface StatisticsData {
      salesByProductSummary: SaleByProduct[];
      salesByMonth: SalesByMonth[];
  }
  
  export interface GraphQLResponse<T> {
      data?: T; // data opcional por si hay errores
      errors?: any[]; // campo de errores
  }
  
  // Para NavItems en Navbar
  export interface NavItem {
    path: string;
    icon: any; 
    label: string;
    iconClass: string;
  }