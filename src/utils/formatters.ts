/**
 * Formatea un número como moneda EUR.
 * @param {number | undefined | null} value El valor numérico a formatear.
 * @returns {string} El valor formateado como string o 'N/A'.
 */
export function formatCurrency(value: number | undefined | null): string {
    if (typeof value !== 'number' || isNaN(value)) {
      return 'N/A';
    }
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    });
    return formatter.format(value);
  }