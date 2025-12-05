// Plugin

// Composables
export { useEntrolytics } from './composables/useEntrolytics.js';
export { useIdentify } from './composables/useIdentify.js';
export { useTrackEvent } from './composables/useTrackEvent.js';
export { useTrackOutboundLink } from './composables/useTrackOutboundLink.js';
export { useTrackPageView } from './composables/useTrackPageView.js';
export { useTrackRevenue } from './composables/useTrackRevenue.js';
export type { EntrolyticsInstance, EntrolyticsOptions, EventData } from './plugin.js';
export { createEntrolytics, EntrolyticsKey, useEntrolyticsInstance } from './plugin.js';
