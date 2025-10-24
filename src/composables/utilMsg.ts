import { createDiscreteApi } from 'naive-ui'

const { message, dialog, loadingBar, notification } = createDiscreteApi(
  ['message', 'dialog', 'loadingBar', 'notification']
)

// 包装 message 方法，添加自定义样式
const customMessage = {
  info: (content: string, options?: any) => {
    return message.info(content, {
      ...options,
      style: {
        marginTop: '80px', // 避免被导航栏遮挡
        ...options?.style
      }
    })
  },
  success: (content: string, options?: any) => {
    return message.success(content, {
      ...options,
      style: {
        marginTop: '80px',
        ...options?.style
      }
    })
  },
  warning: (content: string, options?: any) => {
    return message.warning(content, {
      ...options,
      style: {
        marginTop: '80px',
        ...options?.style
      }
    })
  },
  error: (content: string, options?: any) => {
    return message.error(content, {
      ...options,
      style: {
        marginTop: '80px',
        ...options?.style
      }
    })
  },
  loading: (content: string, options?: any) => {
    return message.loading(content, {
      ...options,
      style: {
        marginTop: '80px',
        ...options?.style
      }
    })
  }
}

const utilMsg = {
  $message: customMessage,
  $dialog: dialog,
  $loadingBar: loadingBar,
  $notification: notification
}

export default utilMsg
