import { useEntrolyticsInstance } from '../plugin.js';

/**
 * Composable for tracking custom events
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTrackEvent } from '@entrolytics/vue';
 *
 * const { track } = useTrackEvent();
 *
 * function handlePurchase() {
 *   track('purchase', { revenue: 99.99, currency: 'USD' });
 * }
 * </script>
 * ```
 */
export function useTrackEvent() {
  const { track } = useEntrolyticsInstance();

  return {
    track,
  };
}
