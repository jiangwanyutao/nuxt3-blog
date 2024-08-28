<template>
  <div class="contonter">
    <CommonBackground ref="target"></CommonBackground>
    <div
      class="w-full mx-auto max-w-screen-2xl"
      style="display: flex; margin-top: 20px"
    >
      <div class="gossip">
        <n-icon
          size="30"
          style="position: absolute; top: 13px; left: 10px; z-index: 1"
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

      <!--       <div class="firstcolumn s-sticky" >-->
      <!--         <HomePersonal></HomePersonal>-->
      <!--       </div>-->
      <!--      <n-flex class="w-full" justify="center">-->
      <!--        <div class="acticle">-->
      <!--        <HomeArticleList></HomeArticleList>-->
      <!--        </div>-->
      <!--        <div class="information">-->
      <!--          个人信息栏-->
      <!--        </div>-->
      <!--      </n-flex>-->
    </div>
    <!--      主体-->
    <div class="blog_main_one">
      <HomeAbout></HomeAbout>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ApertureOutline, ArrowForwardCircle } from '@vicons/ionicons5'
// const target = ref(null)
// const targetIsVisible = ref(true)
//
// const { stop } = useIntersectionObserver(
//     target,
//     ([{ isIntersecting }], observerElement) => {
//       targetIsVisible.value = isIntersecting
//     },
// )
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
</style>
