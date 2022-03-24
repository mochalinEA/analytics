import {
  IAdapterCreatorOptions,
  TAdapterCreator,
  TEvent,
} from '../types'

declare global {
  interface Window {
    _tmr: any
  }
}

let isInitialized = false

const initMyTarget = (id: string, userId: string) => {
  isInitialized = true

  /* eslint-disable */
  // @ts-ignore
  !(function (d, w, id) {if (d.getElementById(id)) return;var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;ts.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//top-fwz1.mail.ru/js/code.js";var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }})(document, window, "topmailru-code");
  /* eslint-enable */

  /* eslint-disable no-underscore-dangle */
  window._tmr.push({ id, type: 'pageView', start: new Date().getTime(), pid: userId })
}

const lazyInit = (id: string, userId: string) => {
  if (!isInitialized) {
    initMyTarget(id, userId)
  }
}

const pushEvent = (id: string, event: TEvent) => {
  if (
    typeof window === 'undefined' ||
    window._tmr === undefined ||
    !event.export?.myTarget.enabled
  ) {
    return
  }

  window._tmr.push({ id, type: 'reachGoal', goal: event.export.myTarget.renameTo })
}

interface IMyTargetAdapterCreatorOptions extends IAdapterCreatorOptions {
  userId?: string
}

const createAdapter: TAdapterCreator<IMyTargetAdapterCreatorOptions> = (
  id,
  { lazy, userId = '' } = {},
) => ({
  init: () => {
    if (!lazy) {
      initMyTarget(id, userId)
    }
  },

  pushEvent: (event: TEvent) => {
    lazyInit(id, userId)

    pushEvent(id, event)
  },
})

export default createAdapter
