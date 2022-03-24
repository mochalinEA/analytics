import { TEventCreator } from '../../../types'

interface IProps {
  requestId: string | number
  label: 'one' | 'two' | 'three'
}

const appSuccess: TEventCreator<IProps> = ({ requestId, label }) => ({
  category: 'default partner',
  action: 'appSuccess',
  attributes: {
    requestId: {
      ga: 'dimension9',
      value: requestId,
    },
    eventLabel: {
      value: label,
    },
  },
  export: {
    facebook: {
      enabled: true,
      renameTo: 'AddToWishlist',
    },
    vk: {
      enabled: true,
      renameTo: 'add_to_wishlist',
      value: 10,
    },
    myTarget: {
      enabled: true,
      renameTo: 'AddToWishlist',
    },
    tiktok: {
      enabled: false,
    },
  },
})

export default appSuccess
