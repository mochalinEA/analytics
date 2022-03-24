type TPixelName = 'facebook' | 'vk' | 'myTarget' | 'tiktok'

export type TEvent = {
  category: string
  action: string
  yaGoalName?: string // имя цели, только для яндекс метрики
  attributes: {
    [key: string]: {
      value: any
      ga?: string // имя атрибута, только для гугл аналитики
    }
  }
  export?: Record<
    TPixelName,
    {
      enabled: boolean
      renameTo?: string
      value?: number
    }
  >
}

export type TEventCreator<P = {}> = (props: P) => TEvent

export interface IAdapter {
  init: () => void
  pushEvent: (event: TEvent) => void
  setUserId?: (userId: string) => void
}

export interface IAdapterCreatorOptions {
  lazy?: boolean
}

export type TAdapterCreator<O = IAdapterCreatorOptions> = (id: string, options?: O) => IAdapter

export type TDimensionsObject = Record<string, any>
