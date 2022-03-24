import {
  IAdapterCreatorOptions,
  TAdapterCreator,
  TDimensionsObject,
  TEvent,
} from '../types'

declare global {
  interface Window {
    ga: any
  }
}

let isInitialized = false

const initGA = (id: string, dimensions?: TDimensionsObject) => {
  isInitialized = true

  /* eslint-disable */
  // @ts-ignore
  !(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  /* eslint-enable */

  window.ga('create', id, 'auto')
  window.ga('send', 'pageview')

  if (dimensions !== undefined) {
    Object.entries<any>(dimensions).forEach(([name, value]) => {
      window.ga('set', name, value)
    })
  }
}

const lazyInit = (id: string, dimensions?: TDimensionsObject) => {
  if (!isInitialized) {
    initGA(id, dimensions)
  }
}

const pushEvent = (event: TEvent) => {
  if (typeof window === 'undefined' || window.ga === undefined) {
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

  window.ga('send', {
    hitType: 'event',
    eventCategory: event.category,
    eventAction: event.action,
    ...attributes,
  })
}

const setUserId = (userId: string) => {
  window.ga('set', 'userId', userId)
}

interface IGAAdapterCreatorOptions extends IAdapterCreatorOptions {
  dimensions?: TDimensionsObject
}

const createAdapter: TAdapterCreator<IGAAdapterCreatorOptions> = (
  id,
  { lazy, dimensions } = {},
) => ({
  init: () => {
    if (!lazy) {
      initGA(id, dimensions)
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
