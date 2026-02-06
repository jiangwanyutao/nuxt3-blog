<template>
  <div class="blog_main_one_item">
    <h2 class="blog_main_one_title">心中有光<br>前路无畏。</h2>
    <div class="tags-group-all">
      <div class="tags-group-container">
        <div class="tags-group-wrapper" v-for="index in 2" :key="index">
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/Vue.png" loading="lazy">
              </img>
            </div>
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/java.png" lazy>
              </img>
            </div>
          </div>
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/maven.png"  lazy>
              </img>
            </div>
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/mysql.png"  lazy>
              </img>
            </div>
          </div>
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/redis.png"  lazy>
              </img>
            </div>
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/Vue.png"  lazy>
              </img>
            </div>
          </div>
          <div class="a_c">
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/mysql.png"  lazy>
              </img>
            </div>
            <div class="blog_main_one_item_icon">
              <img src="/toolIco/spring.png"  lazy>
              </img>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overlay" @click="goToRandomArticle">
      <div class="mask">
        <h1>随便逛逛</h1>
        <div>
          <n-icon size="40" color="#fff">
            <ArrowForwardSharp />
          </n-icon>
        </div>
      </div>
    </div>
    </div>
</template>
<script setup lang="ts">
import { ArrowForwardSharp } from '@vicons/ionicons5'

const router = useRouter()

// 跳转到随机文章
const goToRandomArticle = async () => {
  try {
    // 调用后端API获取文章列表
    const { getArticleList } = await import('~/api/article')
    const response = await getArticleList({
      page: 1,
      limit: 100 // 获取足够多的文章用于随机选择
    }) as any
    
    
    if (response && response.data && response.data.items && response.data.items.length > 0) {
      const articles = response.data.items
      // 随机选择一篇文章
      const randomIndex = Math.floor(Math.random() * articles.length)
      const randomArticle = articles[randomIndex]
      
      
      // 跳转到文章详情页
      router.push(`/article/${randomArticle.id}`)
    } else {
      console.log('暂无文章，快去写一篇吧~')
    }
  } catch (error) {
    console.error('获取随机文章失败:', error)
  }
}
</script>
<style  scoped>
.blog_main_one_item {
  height: 100%;
  width: 59%;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  border-radius: 10px;
}

/* 关于和留言start */
.mask {
  background-color: rgba(66, 90, 239, 0.9);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: -100%; /* 初始位置在视口外 */
  color: #fff;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  padding: 10px 0 0 35px;
  transition: leftToRight 0.3s ease; /* 添加平滑过渡效果 */
}

.mask h1 {
  font-size: 65px;
  letter-spacing: 3px;
  font-weight: 300;
}

.overlay {
  width: 100%;
  height: 250px;
  position: absolute;
  top: 0; /* 确保覆盖在正确位置 */
  left: 0; /* 确保覆盖在正确位置 */
  cursor: pointer; /* 鼠标悬停时显示手形光标 */
}
.overlay:hover .mask {
  animation: leftToRight 0.3s forwards;
}

@keyframes leftToRight {
  0% {
    left: -100%; /* 初始位置在视口外 */
  }
  100% {
    left: 0; /* 最终位置在视口内 */
  }
}

.tags-group-all {
  cursor: pointer;
}

.blog_main_one_item div {
  display: flex;
}

.blog_main_one_title {
  color: #363636;
  font-size: 40px;
  margin: 30px;
}

.blog_main_one_item_icon {
  background-color: #fff;
  width: 110px;
  height: 110px;
  box-shadow: 0 2px 16px -3px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  border-radius: 20px;
}

.blog_main_one_item_icon img {
  width: 75px;
  height: 75px;
}

.a_c {
  display: flex;
  flex-direction: column;
}

@keyframes rowup {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(-50%);
  }
}

.tags-group-all {
  transform: rotate(-30deg);
}

.tags-group-wrapper {
  margin-top: -20px;
  display: flex;
  flex-wrap: nowrap;
  animation: rowup 10s linear infinite;
}

/* 关于和留言end */
</style>
