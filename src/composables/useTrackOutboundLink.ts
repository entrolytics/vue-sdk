import type { EventData } from '../plugin.js';
import { useEntrolyticsInstance } from '../plugin.js';

/**
 * Composable for tracking outbound link clicks
 *
 * @example
 * ```vue
 * <script setup>
 * import { useTrackOutboundLink } from '@entrolytics/vue';
 *
 * const trackOutboundLink = useTrackOutboundLink();
 *
 * const handleExternalClick = (url: string) => {
 *   trackOutboundLink(url, { placement: 'footer' });
 * };
 * </script>
 * ```
 */
export function useTrackOutboundLink() {
  const { trackOutboundLink } = useEntrolyticsInstance();
  return (url: string, data?: EventData) => {
    trackOutboundLink(url, data);
  };
}
