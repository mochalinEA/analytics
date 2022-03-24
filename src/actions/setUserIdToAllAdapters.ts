import { IAdapter } from '../types'

export const setUserIdToAllAdapters = (adapters: IAdapter[], userId: string) => {
  adapters.forEach(({ setUserId }) => {
    if (setUserId !== undefined) {
      setTimeout(() => {
        setUserId(userId)
      }, 0)
    }
  })
}
