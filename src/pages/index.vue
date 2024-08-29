<template>
  <div class="contonter">
    <CommonBackground ref="target"></CommonBackground>
    <div
      class="w-full mx-auto max-w-screen-2xl"
      style="display: flex; margin-top: 20px"
    >
      <div class="gossip">
        <n-icon
          size="33"
          style="position: absolute; top: 50%; left: 10px; z-index: 1; transform: translateY(-50%)"
          class="icons"
        >
          <ApertureOutline />
        </n-icon>
        <n-carousel
          direction="vertical"
          dot-placement="right"
          mousewheel
          style="width: 100%; height: 50px"
          autoplay
        >
          <n-carousel-item
            v-for="item in syMomentsData"
            :key="item.id"
            style="height: 100%; line-height: 100%"
          >
            <NuxtLink
              :to="`${item.path}`"
              class="flex items-center"
              style="margin-left: 25px"
            >
              <Icon
                size="20"
                :name="item.icon"
              />
              <span style="margin-right: 20px; height: 100%; line-height: 50px">{{
                item.content
              }}</span>
            </NuxtLink>
          </n-carousel-item>
        </n-carousel>
        <div
          class="go_gossip"
          @click="router.push({ name: 'Moments' })"
        >
          <n-icon size="25">
            <ArrowForwardCircle />
          </n-icon>
        </div>
      </div>
    </div>
    <!--      主体-->
    <div class="blog_main_one">
      <HomeAbout></HomeAbout>
      <HomeFriendship></HomeFriendship>
    </div>
    <HomeAboutInfo></HomeAboutInfo>
    <div class="wz_main">
      <div id="wz_main_div1">
        <!-- 文章分类导航 -->
        <div class="articleClassification">
          <div style="width: 95%">
            <span
              class="articleClassification_dvi liBgc"
              @click="liClick(0, '')"
              >全部</span
            >
            <span
              class="articleClassification_dvi"
              v-for="(item, index) in ArticleTypes"
              @click="liClick(index + 1, item)"
              :key="index"
              >{{ item }}</span
            >
          </div>
          <NuxtLink
            :to="`${item}`"
            class="gd"
            >更多</NuxtLink
          >
        </div>

        <!-- 文章列表 -->
        <!--        <ZhutiArticle />-->
      </div>

      <div class="wz_yc">
<!--        <n-affix-->
<!--            :top="120" :trigger-top="160"-->
<!--        >-->
          <!-- 博主面板 -->
          <HomeUserInfo />
<!--        </n-affix>-->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ApertureOutline, ArrowForwardCircle } from '@vicons/ionicons5'
import api from '@/api'
//查询所有说说
const syMomentsData = ref([
  {
    content: '内容111111111111111111111111111111111111111111111111111'
  },
  {
    content: '内容2'
  },
  {
    content: '内容3'
  },
  {
    content: '内容4'
  }
])

//查看所有文章分类
const ArticleTypes = ref([
  'Vue',
  'Java',
  '算法',
  '数据结构',
  '网络',
  '操作系统',
  '前端',
  '后端',
  '数据库',
  '中间件'
])
//获取当前用户的ip地址
function getIp() {
  api.common.apiGetIp().then((res) => {
    console.log(res)
    utilMsg.$notification.create({
      placement: 'bottom-right',
      title: '欢迎访问',
      content: () => {
        return h('div', {}, [
          h('p', {}, `来自：${res.location}`),
          h('p', {}, `你的ip地址是：${res.ip}`),
          h('p', {}, `设备信息：${res.system}`),
          h('p', {}, `今天是：${res.week}, ${res.tip}`)
        ])
      },
      meta: res.time,
      duration: 5000
    })
  })
}

onMounted(() => {
  getIp()
})
</script>
<style scoped lang="scss">
.contonter {
  position: relative;
}
.p-sticky {
  position: fixed;
  top: 100px;
  left: 316px;
  width: 300px;
}
.acticle {
  width: 696px;
}
.firstcolumn {
  width: 400px;
  height: 400px;
}
.firstcolumn-bak {
  width: 280px;
}
.information {
  width: 280px;
  height: 400px;
  background-color: rgba(0, 128, 0, 0.12);
}

.s-sticky {
  position: sticky;
  top: 100px;
}
.gossip {
  width: 80%;
  height: 50px;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: #ffffff 1px solid;
}
.gossip:hover {
  border: #0b8bd9 1px solid;
}

.el-carousel {
  border-radius: 10px;
}

.el-carousel__item {
  color: #000;
  letter-spacing: 1px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.el-carousel__item a {
  cursor: pointer;
  color: #000;
}

.el-carousel__item a:hover {
  color: #687bf2;
}
.go_gossip {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  background-color: #353535;
  color: #fff;
}

.go_gossip:hover {
  background-color: #687bf2;
  color: #fff;
}
.icons:hover {
  border-radius: 50%;
  background-color: #687bf2;
  color: #fff;
}

.blog_main_one {
  user-select: none;
  height: 250px;
  width: 80%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.wz_main {
  width: 80%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  user-select: none;
}

#wz_main_div1 {
  width: 80%;
}

.wz_yc {
  display: flex;
  flex-direction: column;
  width: 19%;
}

.articleClassification {
  background-color: #fff;
  height: 50px;
  line-height: 50px;
  border-radius: 10px;
  display: flex;
}

.gd {
  margin: 0 0 0 10px;
  color: #000;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 20px;
  width: 50px;
  line-height: 50px;
  text-align: center;
}

.gd:hover {
  color: #2853df;
}

.articleClassification_dvi {
  padding: 5px 15px;
  margin: 0 0 0 10px;
  color: #000;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
}

.articleClassification_dvi:hover {
  background-color: #2853df;
  color: #fff;
}

@media (max-width: 1200px) {
  .wz_main {
    width: 100%;
    justify-content: center;
  }

  #wz_main_div1 {
    width: 100%;
  }

  .wz_yc {
    display: none !important;
  }
  .blog_main_one {
    display: none !important;
  }

  .articleClassification {
    display: none !important;
  }
}
</style>
