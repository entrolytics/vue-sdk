import { type App, type InjectionKey, inject, type Ref, ref } from 'vue';

const DEFAULT_HOST = 'https://ng.entrolytics.click';
const SCRIPT_ID = 'entrolytics-script';

export interface EventData {
  [key: string]: string | number | boolean | EventData | string[] | number[] | EventData[];
}

export interface EntrolyticsOptions {
  websiteId: string;
  host?: string;
  autoTrack?: boolean;
  respectDnt?: boolean;
  domains?: string[];
  /** Use edge runtime endpoints for faster response times (default: true) */
  useEdgeRuntime?: boolean;
  /** Custom tag for A/B testing */
  tag?: string;
  /** Strip query parameters from URLs */
  excludeSearch?: boolean;
  /** Strip hash from URLs */
  excludeHash?: boolean;
  /** Callback before sending data */
  beforeSend?: (type: string, payload: unknown) => unknown | null;
}

export interface EntrolyticsInstance {
  track: (eventName: string, eventData?: EventData) => void;
  trackPageView: (url?: string, referrer?: string) => void;
  trackRevenue: (eventName: string, revenue: number, currency?: string, data?: EventData) => void;
  trackOutboundLink: (url: string, data?: EventData) => void;
  identify: (data: EventData) => void;
  identifyUser: (userId: string, traits?: EventData) => void;
  setTag: (tag: string) => void;
  config: EntrolyticsOptions;
  isLoaded: Ref<boolean>;
  isReady: Ref<boolean>;
}

declare global {
  interface Window {
    entrolytics?: {
      track: (eventName?: string | object, eventData?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
    };
  }
}

export const EntrolyticsKey: InjectionKey<EntrolyticsInstance> = Symbol('entrolytics');

function injectScript(options: EntrolyticsOptions, onLoad?: () => void): void {
  if (typeof window === 'undefined') return;
  if (document.getElementById(SCRIPT_ID)) {
    onLoad?.();
    return;
  }

  const {
    websiteId,
    host = DEFAULT_HOST,
    autoTrack = true,
    respectDnt = false,
    domains,
    useEdgeRuntime = true,
    tag,
    excludeSearch = false,
    excludeHash = false,
  } = options;

  const script = document.createElement('script');
  script.id = SCRIPT_ID;

  // Use edge runtime script if enabled
  const scriptPath = useEdgeRuntime ? '/script-edge.js' : '/script.js';
  script.src = `${host.replace(/\/$/, '')}${scriptPath}`;
  script.defer = true;
  script.dataset.websiteId = websiteId;

  if (!autoTrack) {
    script.dataset.autoTrack = 'false';
  }
  if (respectDnt) {
    script.dataset.doNotTrack = 'true';
  }
  if (domains && domains.length > 0) {
    script.dataset.domains = domains.join(',');
  }
  if (tag) {
    script.dataset.tag = tag;
  }
  if (excludeSearch) {
    script.dataset.excludeSearch = 'true';
  }
  if (excludeHash) {
    script.dataset.excludeHash = 'true';
  }

  script.onload = () => onLoad?.();
  document.head.appendChild(script);
}

/**
 * Create Entrolytics Vue plugin
 *
 * @example
 * Zero-config (reads from import.meta.env):
 * ```ts
 * import { createApp } from 'vue';
 * import { createEntrolytics } from '@entrolytics/vue';
 *
 * const app = createApp(App);
 * app.use(createEntrolytics());
 * app.mount('#app');
 * ```
 *
 * @example
 * Explicit config:
 * ```ts
 * const app = createApp(App);
 * app.use(createEntrolytics({ websiteId: 'your-website-id' }));
 * app.mount('#app');
 * ```
 */
export function createEntrolytics(options: Partial<EntrolyticsOptions> = {}) {
  // Auto-read from environment variables (Vite)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env || {};
  const websiteId =
    options.websiteId ||
    env.VITE_ENTROLYTICS_NG_WEBSITE_ID ||
    env.VITE_PUBLIC_ENTROLYTICS_NG_WEBSITE_ID;

  const host = options.host || env.VITE_ENTROLYTICS_HOST || env.VITE_PUBLIC_ENTROLYTICS_HOST;

  if (!websiteId) {
    if (env.DEV) {
      console.warn(
        '[@entrolytics/vue] Missing websiteId. Add VITE_ENTROLYTICS_NG_WEBSITE_ID to your .env file or pass as option.',
      );
    }
    throw new Error('[@entrolytics/vue] websiteId is required');
  }

  const finalOptions: EntrolyticsOptions = {
    ...options,
    websiteId,
    host: host || options.host,
  } as EntrolyticsOptions;

  const isLoaded = ref(false);
  const isReady = ref(false);
  let currentTag = finalOptions.tag;

  const waitForTracker = (callback: () => void) => {
    if (typeof window === 'undefined') return;

    const tryExecute = () => {
      if (window.entrolytics) {
        callback();
      } else {
        setTimeout(tryExecute, 100);
      }
    };

    tryExecute();
  };

  const track = (eventName: string, eventData?: EventData) => {
    waitForTracker(() => {
      let payload: unknown = { name: eventName, data: eventData };

      if (options.beforeSend) {
        payload = options.beforeSend('event', payload);
        if (payload === null) return;
      }

      if (currentTag) {
        (payload as Record<string, unknown>).tag = currentTag;
      }

      window.entrolytics?.track(eventName, eventData);
    });
  };

  const trackPageView = (url?: string, referrer?: string) => {
    waitForTracker(() => {
      const payload: Record<string, unknown> = {};
      if (url) payload.url = url;
      if (referrer) payload.referrer = referrer;
      if (currentTag) payload.tag = currentTag;

      window.entrolytics?.track(payload);
    });
  };

  const trackRevenue = (eventName: string, revenue: number, currency = 'USD', data?: EventData) => {
    waitForTracker(() => {
      const eventData: EventData = {
        ...data,
        revenue,
        currency,
      };

      if (currentTag) {
        eventData.tag = currentTag;
      }

      window.entrolytics?.track(eventName, eventData);
    });
  };

  const trackOutboundLink = (url: string, data?: EventData) => {
    waitForTracker(() => {
      window.entrolytics?.track('outbound-link-click', {
        ...data,
        url,
      });
    });
  };

  const identify = (data: EventData) => {
    waitForTracker(() => {
      window.entrolytics?.identify(data);
    });
  };

  const identifyUser = (userId: string, traits?: EventData) => {
    waitForTracker(() => {
      window.entrolytics?.identify({ id: userId, ...traits });
    });
  };

  const setTag = (tag: string) => {
    currentTag = tag;
  };

  const instance: EntrolyticsInstance = {
    track,
    trackPageView,
    trackRevenue,
    trackOutboundLink,
    identify,
    identifyUser,
    setTag,
    config: finalOptions,
    isLoaded,
    isReady,
  };

  return {
    install(app: App) {
      // Inject script on mount
      injectScript(finalOptions, () => {
        isLoaded.value = true;
        isReady.value = true;
      });

      // Provide instance
      app.provide(EntrolyticsKey, instance);

      // Add global property
      app.config.globalProperties.$entrolytics = instance;
    },
  };
}

/**
 * Use Entrolytics instance in composition API
 */
export function useEntrolyticsInstance(): EntrolyticsInstance {
  const instance = inject(EntrolyticsKey);
  if (!instance) {
    throw new Error('[@entrolytics/vue] Entrolytics plugin not installed');
  }
  return instance;
}
