import { IAdapter } from '../types'

export const initAllAdapters = (adapters: IAdapter[]) => {
  adapters.forEach(({ init }) => {
    setTimeout(() => {
      init()
    }, 0)
  })
}
