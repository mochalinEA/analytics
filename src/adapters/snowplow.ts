import {
  IAdapterCreatorOptions,
  TAdapterCreator,
  TEvent,
} from '../types'

declare global {
  interface Window {
    snowplow: any
  }
}

let isInitialized = false

const initSnowplow = (
  appId: string,
  customConfig: Record<string, any> = {},
) => {
  isInitialized = true

  const urlToSpJs = 'https://oursite.com/sp.js'
  const collectorUrl = 'collectorUrl'

  /* eslint-disable */
  // @ts-ignore
  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[]; p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments) };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1; n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script",urlToSpJs,"snowplow"))
  /* eslint-enable */

  window.snowplow('newTracker', 'sp', collectorUrl, {
    appId,
    platform: 'web',
    cookieDomain: null,
    discoverRootDomain: true,
    cookieName: '_sp_',
    cookieSameSite: 'Lax', // Recommended
    cookieSecure: true,
    encodeBase64: true,
    respectDoNotTrack: false,
    eventMethod: 'post',
    bufferSize: 1,
    maxPostBytes: 40000,
    postPath: '/custom/path', // Collector must be configured
    crossDomainLinker(linkElement: HTMLAnchorElement) {
      return linkElement.href === 'http://acme.de' || linkElement.id === 'crossDomainLink'
    },
    cookieLifetime: 63072000,
    stateStorageStrategy: 'cookieAndLocalStorage',
    maxLocalStorageQueueSize: 1000,
    resetActivityTrackingOnPageView: true,
    connectionTimeout: 5000,
    anonymousTracking: false,
    // anonymousTracking: { withSessionTracking: true },
    // anonymousTracking: { withSessionTracking: true, withServerAnonymisation: true },
    customHeaders: {}, // Use with caution. Available from v3.2.0+
    withCredentials: true, // Available from v3.2.0+
    contexts: {
      webPage: true, // Default
      performanceTiming: true,
      gaCookies: true,
      geolocation: false,
      clientHints: true,
      // clientHints: { includeHighEntropy: true }, // Optional
    },
    ...customConfig,
  })
}

const lazyInit = (id: string, customConfig?: Record<string, any>) => {
  if (!isInitialized) {
    initSnowplow(id, customConfig)
  }
}

const pushEvent = (event: TEvent) => {
  const attributes = Object.entries(event.attributes).reduce<Record<string, any>>(
    (acc, [key, value]) => {
      acc[key] = value.value

      return acc
    },
    {},
  )

  window.snowplow('trackStructEvent', {
    category: event.category,
    action: event.action,
    context: [
      {
        schema: 'iglu:com.snowplowanalytics.iglu/anything-a/jsonschema/1-0-0',
        data: attributes,
      },
    ],
  })
}

const setUserId = (userId: string) => {
  window.snowplow('setUserId', userId)
}

interface ISnowplowAdapterCreatorOptions extends IAdapterCreatorOptions {
  customConfig?: Record<string, any>
}

const createAdapter: TAdapterCreator<ISnowplowAdapterCreatorOptions> = (
  id,
  { lazy, customConfig } = {},
) => ({
  init: () => {
    if (!lazy) {
      initSnowplow(id, customConfig)
    }
  },

  pushEvent: (event: TEvent) => {
    lazyInit(id, customConfig)

    pushEvent(event)
  },

  setUserId: (userId: string) => {
    lazyInit(id, customConfig)

    setUserId(userId)
  },
})

export default createAdapter
