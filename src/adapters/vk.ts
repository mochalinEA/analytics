import { TAdapterCreator, TEvent } from '../types'

declare global {
  interface Window {
    VKPromise: any
    VK: any
  }
}

let isInitialized = false

const initVK = (id: string) => {
  isInitialized = true

  /* eslint-disable */
  // @ts-ignore
  !function(){window.VKPromise = new Promise(function(resolve) {var t=document.createElement("script");t.type="text/javascript";t.src="https://vk.com/js/api/openapi.js?168";t.async=!0;t.onload=function(){window.VK.Retargeting.Init(id);window.VK.Retargeting.Hit();resolve()},document.head.appendChild(t);})}()
  /* eslint-enable */
}

const lazyInit = (id: string) => {
  if (!isInitialized) {
    initVK(id)
  }
}

const pushEvent = (event: TEvent) => {
  if (
    typeof window === 'undefined' ||
    window.VK === undefined ||
    window.VKPromise === undefined ||
    !event.export?.vk.enabled
  ) {
    return
  }

  const name = event.export.vk.renameTo
  const { value } = event.export.vk

  window.VKPromise.then(() => {
    window.VK.Goal(name, { value })
  })
}

const createAdapter: TAdapterCreator = (id, { lazy } = {}) => ({
  init: () => {
    if (!lazy) {
      initVK(id)
    }
  },

  pushEvent: (event: TEvent) => {
    lazyInit(id)

    pushEvent(event)
  },
})

export default createAdapter
