import type { EventData } from '../plugin.js';
import { useEntrolyticsInstance } from '../plugin.js';

/**
 * Composable for tracking revenue events
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTrackRevenue } from '@entrolytics/vue';
 *
 * const trackRevenue = useTrackRevenue();
 *
 * const handlePurchase = async (product) => {
 *   await processPayment();
 *   trackRevenue('purchase', product.price, 'USD', {
 *     productId: product.id,
 *     productName: product.name
 *   });
 * };
 * </script>
 * ```
 */
export function useTrackRevenue() {
  const { trackRevenue } = useEntrolyticsInstance();
  return (eventName: string, revenue: number, currency = 'USD', data?: EventData) => {
    trackRevenue(eventName, revenue, currency, data);
  };
}
