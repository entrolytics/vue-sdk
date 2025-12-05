import { useEntrolyticsInstance } from '../plugin.js';

/**
 * Main composable for accessing Entrolytics functionality
 *
 * @example
 * ```vue
 * <script setup>
 * import { useEntrolytics } from '@entrolytics/vue';
 *
 * const { track, identify, isLoaded } = useEntrolytics();
 *
 * function handleClick() {
 *   track('button_click', { variant: 'primary' });
 * }
 * </script>
 * ```
 */
export function useEntrolytics() {
  return useEntrolyticsInstance();
}
