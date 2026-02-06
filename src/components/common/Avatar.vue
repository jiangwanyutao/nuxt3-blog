<template>
  <div class="avatar-container" @mouseenter="showCard = true" @mouseleave="showCard = false">
    <!-- 头像 -->
    <div class="avatar" :class="{ 'avatar-hidden': showCard }">
      <img :src="userInfo.avatar || '/default-avatar.png'" alt="avatar" class="w-8 h-8 rounded-full cursor-pointer border-2 border-white">
    </div>

    <!-- 信息卡片 -->
    <Transition name="card">
      <div v-if="showCard" class="user-card">
        <div class="card-header">
          <div class="avatar-transform-wrapper">
            <img :src="userInfo.avatar || '/default-avatar.png'" alt="avatar" class="card-avatar w-16 h-16 rounded-full border-4 border-white shadow-sm">
          </div>
          <div class="user-info">
            <div class="username">{{ userInfo.nickName || userInfo.userName }}</div>
            <div class="remark text-gray-500 text-sm">{{ userInfo.remark || '这个人很懒，什么都没写~' }}</div>
          </div>
        </div>
        
        <div class="card-body">
          <div class="stats-item">
            <div class="label">用户名</div>
            <div class="value">{{ userInfo.userName }}</div>
          </div>
          <div class="stats-item">
            <div class="label">邮箱</div>
            <div class="value">{{ userInfo.email }}</div>
          </div>
          <div class="stats-item">
            <div class="label">登录时间</div>
            <div class="value">{{ formatDate(userInfo.loginDate) }}</div>
          </div>
        </div>

        <div class="card-footer">
          <div class="menu-item" @click="goToProfile">
            <i class="fas fa-user"></i>
            个人中心
          </div>
          <div class="menu-item" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            退出登录
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()
const showCard = ref(false)

//获取用户信息
const userInfo = ref("")
onMounted(() => {
    // 从 localStorage 读取存储的用户信息
    const savedUserInfo = localStorage.getItem('sj_userInfo')
    const config = useRuntimeConfig()
    const baseURL = config.public.baseURL
    userInfo.value = savedUserInfo ? JSON.parse(savedUserInfo) : null
    userInfo.value.avatar = baseURL + userInfo.value.avatar
});

const goToProfile = () => {
  router.push('/profile')
}

const logout = () => {
  userStore.clearUserInfo()
  router.push('/login')
}

// 添加日期格式化函数
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}
</script>

<style scoped lang="scss">
.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar {
  position: relative;
  z-index: 2;
  transition: opacity 0.2s ease;
  
  &.avatar-hidden {
    opacity: 0;
  }
}

.user-card {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-top: 8px;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 16px;
    height: 16px;
    background: white;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.05);
  }
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
}

.avatar-transform-wrapper {
  position: relative;
  margin-bottom: 12px;
  
  .card-avatar {
    position: relative;
    animation: avatarTransform 0.3s ease;
  }
}

@keyframes avatarTransform {
  0% {
    transform: translate(0, -60px) scale(0.5);  // 从原头像位置开始
    opacity: 0;
  }
  100% {
    transform: translate(0, 0) scale(1);        // 移动到卡片位置
    opacity: 1;
  }
}

.user-info {
  .username {
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 4px;
  }
  
  .remark {
    font-size: 12px;
    color: #999;
  }
}

.card-body {
  display: flex;
  flex-direction: column;  // 改为纵向排列
  gap: 8px;               // 添加间距
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  
  .stats-item {
    display: flex;
    justify-content: space-between;  // 左右布局
    align-items: center;
    padding: 0 12px;
    
    .label {
      font-size: 13px;
      color: #666;
    }
    
    .value {
      font-size: 13px;
      color: #333;
      max-width: 140px;      // 限制最大宽度
      overflow: hidden;      // 溢出隐藏
      text-overflow: ellipsis;  // 显示省略号
      white-space: nowrap;   // 不换行
    }
  }
}

.card-footer {
  margin-top: 12px;
  
  .menu-item {
    padding: 8px 0;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      color: #ff6b6b;
    }
    
    i {
      margin-right: 8px;
    }
  }
}

// 修改卡片动画
.card-enter-active {
  transition: all 0.3s ease;
}

.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.95);
  transform-origin: top center;
}
</style> 