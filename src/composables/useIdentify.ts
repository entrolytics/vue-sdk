import { useEntrolyticsInstance } from '../plugin.js';

/**
 * Composable for identifying users
 *
 * @example
 * ```vue
 * <script setup>
 * import { watch } from 'vue';
 * import { useIdentify } from '@entrolytics/vue';
 *
 * const { identify } = useIdentify();
 * const user = useUser(); // Your auth composable
 *
 * watch(user, (newUser) => {
 *   if (newUser) {
 *     identify(newUser.id, {
 *       email: newUser.email,
 *       plan: newUser.subscription
 *     });
 *   }
 * });
 * </script>
 * ```
 */
export function useIdentify() {
  const { identify } = useEntrolyticsInstance();

  return {
    identify,
  };
}
