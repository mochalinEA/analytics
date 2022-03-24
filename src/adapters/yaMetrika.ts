import { TAdapterCreator, TEvent } from '../types'

declare global {
  interface Window {
    ym: any
  }
}

let isInitialized = false

const initYaMetrika = (id: string) => {
  isInitialized = true

  /* eslint-disable */
  // @ts-ignore
  !(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  /* eslint-enable */

  window.ym(id, 'init', {
    id,
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    childIframe: true,
  })
}

const lazyInit = (id: string) => {
  if (!isInitialized) {
    initYaMetrika(id)
  }
}

const reachGoal = (id: string, event: TEvent) => {
  if (typeof window === 'undefined' || window.ym === undefined || event.yaGoalName === undefined) {
    return
  }

  window.ym(id, 'reachGoal', event.yaGoalName)
}

const setUserId = (id: string, userId: string) => {
  window.ym(id, 'userParams', { UserId: userId })
}

const createAdapter: TAdapterCreator = (id, { lazy } = {}) => ({
  init: () => {
    if (!lazy) {
      initYaMetrika(id)
    }
  },

  pushEvent: (event: TEvent) => {
    lazyInit(id)

    reachGoal(id, event)
  },

  setUserId: (userId: string) => {
    lazyInit(id)

    setUserId(id, userId)
  },
})

export default createAdapter
