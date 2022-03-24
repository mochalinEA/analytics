import { TEventCreator } from '../../../types'

interface IProps {
  requestId: string | number
}

const appSuccess: TEventCreator<IProps> = ({ requestId }) => ({
  category: 'MainSiteForm',
  action: 'appSuccess',
  yaGoalName: 'AnyAppSuccess',
  attributes: {
    requestId: {
      ga: 'dimension9',
      value: requestId,
    },
    eventLabel: {
      value: 'OnlineForm',
    },
  },
  export: {
    facebook: {
      enabled: false,
    },
    vk: {
      enabled: false,
    },
    myTarget: {
      enabled: false,
    },
    tiktok: {
      enabled: false,
    },
  },
})

export default appSuccess
