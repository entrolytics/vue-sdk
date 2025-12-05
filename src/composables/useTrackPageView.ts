import { type Ref, watch } from 'vue';
import { useEntrolyticsInstance } from '../plugin.js';

/**
 * Composable for tracking page views with vue-router
 *
 * @example
 * ```vue
 * <script setup>
 * import { useRoute } from 'vue-router';
 * import { useTrackPageView } from '@entrolytics/vue';
 *
 * const route = useRoute();
 * useTrackPageView(() => route.path);
 * </script>
 * ```
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue';
 * import { useTrackPageView } from '@entrolytics/vue';
 *
 * const currentPath = ref('/');
 * useTrackPageView(currentPath);
 * </script>
 * ```
 */
export function useTrackPageView(
  pathSource: Ref<string> | (() => string),
  options?: { immediate?: boolean },
) {
  const { track } = useEntrolyticsInstance();
  const { immediate = true } = options || {};

  watch(
    pathSource,
    (newPath, oldPath) => {
      if (newPath !== oldPath) {
        track('pageview', {
          url: newPath,
        });
      }
    },
    { immediate },
  );
}
