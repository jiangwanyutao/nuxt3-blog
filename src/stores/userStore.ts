

export const useUserStore = defineStore(
  'user',
  () => {
    // token
    const token = ref<string | null>(null)
    // 用户信息
    const userInfo = ref<any>(null)

    // 设置token
    function setToken(key: string) {
      console.log(key,'key')
      token.value = key
    }
    //设置用户信息
    function setUserInfo(userInfo: any) {
      console.log(userInfo,'userInfo')
      userInfo.value = userInfo
    }
    // 清除用户信息
    function clearUserInfo() {
      userInfo.value = null
      token.value = null
      //清除本地存储
      localStorage.removeItem("sj_token");
      localStorage.removeItem("sj_userInfo");
    }

    return {
      token,
      userInfo,
      setToken,
      setUserInfo,
      clearUserInfo,
    }
  },
  {
    // 持久化 默认存cookie
    persist: {
      key: 'user_info'
    }
  }
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
