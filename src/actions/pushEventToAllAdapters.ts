import { IAdapter, TEvent } from '../types'

export const pushEventToAllAdapters = (adapters: IAdapter[], event: TEvent) => {
  adapters.forEach(({ pushEvent }) => {
    setTimeout(() => {
      pushEvent(event)
    }, 0)
  })
}
