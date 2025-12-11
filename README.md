# @entrolytics/vue

Vue SDK for [Entrolytics](https://ng.entrolytics.click) - First-party growth analytics for the edge.

## Installation

```bash
npm install @entrolytics/vue
# or
pnpm add @entrolytics/vue
```

## Quick Start

```ts
// main.ts
import { createApp } from 'vue';
import { createEntrolytics } from '@entrolytics/vue';
import App from './App.vue';

const app = createApp(App);

// Zero-config: automatically reads from .env
app.use(createEntrolytics());

app.mount('#app');
```

Add to your `.env` file:

```bash
VITE_ENTROLYTICS_NG_WEBSITE_ID=your-website-id
VITE_ENTROLYTICS_HOST=https://ng.entrolytics.click
```

## Configuration Options

### Zero-Config (Recommended)

```ts
// Reads from VITE_ENTROLYTICS_NG_WEBSITE_ID and VITE_ENTROLYTICS_HOST
app.use(createEntrolytics());
```

### Explicit Configuration

```ts
createEntrolytics({
  // Required: Your Entrolytics website ID
  websiteId: 'your-website-id',

  // Optional: Custom host (for self-hosted)
  host: 'https://ng.entrolytics.click',

  // Optional: Auto-track page views (default: true)
  autoTrack: true,

  // Optional: Use edge-optimized endpoints (default: true)
  useEdgeRuntime: true,

  // Optional: Respect Do Not Track (default: false)
  respectDnt: false,

  // Optional: Cross-domain tracking
  domains: ['example.com', 'blog.example.com'],
});
```

### Runtime Configuration

The `useEdgeRuntime` option controls which collection endpoint is used:

**Edge Runtime (default)** - Optimized for speed and global distribution:

```ts
createEntrolytics({
  websiteId: 'your-website-id',
  useEdgeRuntime: true // or omit (default)
});
```

- **Latency**: Sub-50ms response times globally
- **Best for**: Production Vue applications, globally distributed users
- **Endpoint**: Uses `/api/send-native` for edge-to-edge communication
- **Limitations**: No ClickHouse export, basic geo data

**Node.js Runtime** - Full-featured with advanced capabilities:

```ts
createEntrolytics({
  websiteId: 'your-website-id',
  useEdgeRuntime: false
});
```

- **Features**: ClickHouse export, MaxMind GeoIP (city-level accuracy)
- **Best for**: Self-hosted deployments, advanced analytics requirements
- **Endpoint**: Uses `/api/send` for Node.js runtime
- **Latency**: 50-150ms (regional)

**When to use Node.js runtime**:
- Self-hosted Vue deployments without edge runtime support
- Applications requiring ClickHouse data export
- Need for advanced geo-targeting with MaxMind
- Custom server-side analytics workflows

## Composables

### useEntrolytics

Main composable for accessing all functionality.

```vue
<script setup>
import { useEntrolytics } from '@entrolytics/vue';

const { track, identify, isLoaded, config } = useEntrolytics();

function handleClick() {
  track('button_click', { variant: 'primary' });
}
</script>

<template>
  <button @click="handleClick">Click me</button>
</template>
```

### useTrackEvent

Track custom events.

```vue
<script setup>
import { useTrackEvent } from '@entrolytics/vue';

const { track } = useTrackEvent();

function handlePurchase() {
  track('purchase', {
    revenue: 99.99,
    currency: 'USD',
    product_id: 'pro-plan'
  });
}
</script>
```

### useTrackPageView

Track page views with vue-router.

```vue
<script setup>
import { useRoute } from 'vue-router';
import { useTrackPageView } from '@entrolytics/vue';

const route = useRoute();
useTrackPageView(() => route.path);
</script>
```

### useIdentify

Identify users for logged-in tracking.

```vue
<script setup>
import { watch } from 'vue';
import { useIdentify } from '@entrolytics/vue';

const { identify } = useIdentify();

// When user logs in
watch(user, (newUser) => {
  if (newUser) {
    identify(newUser.id, {
      email: newUser.email,
      plan: newUser.subscription
    });
  }
});
</script>
```

## Global Property

The plugin also adds a global property accessible in templates and options API:

```vue
<script>
export default {
  methods: {
    trackClick() {
      this.$entrolytics.track('button_click');
    }
  }
}
</script>
```

## TypeScript Support

Full TypeScript support with exported types:

```ts
import type {
  EntrolyticsOptions,
  EntrolyticsInstance
} from '@entrolytics/vue';
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
