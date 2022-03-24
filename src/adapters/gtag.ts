import {
  IAdapterCreatorOptions,
  TAdapterCreator,
  TDimensionsObject,
  TEvent,
} from '../types'

declare global {
  interface Window {
    dataLayer: any
    gtag: any
  }
}

let isInitialized = false

const initGtag = (id: string, dimensions?: TDimensionsObject) => {
  isInitialized = true

  /* eslint-disable */
  // @ts-ignore
  !(function (w,d,u){const s = d.createElement('script');s.src=u;s.type='text/javascript';d.body.appendChild(s)})(window,document,`https://www.googletagmanager.com/gtag/js?id=${id}`)
  /* eslint-enable */

  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', id)

  if (dimensions !== undefined) {
    window.gtag('config', id, dimensions)
  }
}

const lazyInit = (id: string, dimensions?: TDimensionsObject) => {
  if (!isInitialized) {
    initGtag(id, dimensions)
  }
}

const pushEvent = (event: TEvent) => {
  if (typeof window === 'undefined' || window.gtag === undefined) {
    return
  }

  const attributes = Object.entries(event.attributes).reduce<Record<string, any>>(
    (acc, [key, value]) => {
      const newKey = value.ga || key
      acc[newKey] = value.value

      return acc
    },
    {},
  )

  window.gtag('event', event.action, {
    eventCategory: event.category,
    ...attributes,
  })
}

const setUserId = (id: string, userId: string) => {
  window.gtag('config', id, { userId })
}

interface IGtagAdapterCreatorOptions extends IAdapterCreatorOptions {
  dimensions?: TDimensionsObject
}

const createAdapter: TAdapterCreator<IGtagAdapterCreatorOptions> = (
  id,
  { lazy, dimensions } = {},
) => ({
  init: () => {
    if (!lazy) {
      initGtag(id, dimensions)
    }
  },

  pushEvent: (event: TEvent) => {
    lazyInit(id, dimensions)

    pushEvent(event)
  },

  setUserId: (userId: string) => {
    lazyInit(id, dimensions)

    setUserId(id, userId)
  },
})

export default createAdapter
