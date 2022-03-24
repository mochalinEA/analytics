import { TAdapterCreator, TEvent } from '../types'

declare global {
  interface Window {
    fbq: any
  }
}

let isInitialized = false

const initFB = (id: string) => {
  isInitialized = true

  /* eslint-disable */
  // @ts-ignore
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', id)
  window.fbq('track', 'PageView')
}

const lazyInit = (id: string) => {
  if (!isInitialized) {
    initFB(id)
  }
}

const pushEvent = (event: TEvent) => {
  if (
    typeof window === 'undefined' ||
    window.fbq === undefined ||
    !event.export?.facebook.enabled
  ) {
    return
  }

  window.fbq('track', event.export.facebook.renameTo)
}

const createAdapter: TAdapterCreator = (id, { lazy } = {}) => ({
  init: () => {
    if (!lazy) {
      initFB(id)
    }
  },

  pushEvent: (event: TEvent) => {
    lazyInit(id)

    pushEvent(event)
  },
})

export default createAdapter
