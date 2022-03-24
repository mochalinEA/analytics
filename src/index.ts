import { setUserIdToAllAdapters } from './actions/setUserIdToAllAdapters'
import { IAdapter, TEvent } from './types'

import { initAllAdapters } from './actions/initAllAdapters'
import { pushEventToAllAdapters } from './actions/pushEventToAllAdapters'

let allAdapters = [] as IAdapter[]

interface IInitProps {
  adapters: IAdapter[]
}

export const init = ({ adapters }: IInitProps) => {
  allAdapters = adapters

  initAllAdapters(adapters)
}

export const pushEvent = (event: TEvent) => {
  pushEventToAllAdapters(allAdapters, event)
}

export const setUserId = (userId: string) => {
  setUserIdToAllAdapters(allAdapters, userId)
}
