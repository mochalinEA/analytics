import {
  IAdapterCreatorOptions,
  TAdapterCreator,
  TDimensionsObject,
  TEvent,
} from '../types'

declare global {
  interface Window {
    dataLayer: any
  }
}

let isInitialized = false

const initGTM = (id: string, dimensions?: TDimensionsObject) => {
  isInitialized = true

  /* eslint-disable */
  // @ts-ignore
  !(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',id)
  /* eslint-enable */

  if (dimensions !== undefined) {
    window.dataLayer.push(dimensions)
  }
}

const lazyInit = (id: string, dimensions?: TDimensionsObject) => {
  if (!isInitialized) {
    initGTM(id, dimensions)
  }
}

const pushEvent = (event: TEvent) => {
  if (typeof window === undefined && !Array.isArray(window.dataLayer)) {
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

  window.dataLayer.push({
    event: 'DdTrackData',
    eventCategory: event.category,
    eventAction: event.action,
    ...attributes,
  })
}

const setUserId = (userId: string) => {
  window.dataLayer.push({ userId })
}

interface IGtmAdapterCreatorOptions extends IAdapterCreatorOptions {
  dimensions?: TDimensionsObject
}

const createAdapter: TAdapterCreator<IGtmAdapterCreatorOptions> = (
  id,
  { lazy, dimensions } = {},
) => ({
  init: () => {
    if (!lazy) {
      initGTM(id, dimensions)
    }
  },

  pushEvent: (event: TEvent) => {
    lazyInit(id, dimensions)

    pushEvent(event)
  },

  setUserId: (userId: string) => {
    lazyInit(id, dimensions)

    setUserId(userId)
  },
})

export default createAdapter
