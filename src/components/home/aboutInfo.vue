<template>
  <div class="blog_main_two">
    <div>
      <ul v-if="itemWidths">
        <li
            v-for="(item, index) in itemWidths"
            :key="index"
            :style="{ width: item + '%' }"
            :class="{ active: activeIndex === index }"
            @mouseover="increaseWidth(index)"
            @mouseout="resetWidth(index)"
        >
          <div class="blog_main_two_div">
            <div
                class="blog_main_two_title"
                :class="{
                blog_main_two_div_width_gq: blog_main_two_div_width,
                blog_main_two_div_width_gh: !blog_main_two_div_width,
              }"
            >
              <p>{{ titles[index] }}</p>
              <p :class="{ wz_num_gq: wz_num[index], wz_num_gh: !wz_num[index] }">
                {{ syArticleData[index] }}
              </p>
            </div>
            <div class="blog_main_two_hr"></div>
          </div>
          <div
              :class="{
              blog_main_two_ico_gq: blog_main_two_ico[index],
              blog_main_two_ico_gh: !blog_main_two_ico[index],
            }"
          >
            <n-icon size="40">
              <component
                  :is="icons[index]"
                  :class="{
                  wz_ico_gq: index === 0,  // 第一个图标
                  yx_ico_gq: index === 1,  // 第二个图标
                  fw_ico_gq: index === 2,   // 第三个图标
                  wz_ico: wz_ico[index],
                  wz_ico_gh: !wz_ico[index]
                }"
              />
            </n-icon>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookSharp, Bonfire, BowlingBallSharp } from '@vicons/ionicons5';

// 统计数据
const syArticleData = ref([
  0, // 文章数量
  0, // 运行天数
  0  // 访问数量
]);
// ---------------数据START-------------------
const titles = ['文章数量', '运行天数', '访问数量'];
const icons = [Bonfire, BookSharp, BowlingBallSharp];

const blog_main_two_ico = ref([true, true, true]);
const wz_ico = ref([true, true, true]);
// const wz_num = ref(true);
const blog_main_two_div_width = ref(true);
const itemWidths = ref([32, 32, 32]);
const activeIndex = ref(null);

// 在<script setup>中
const wz_num = ref([true, true, true]); // 将 wz_num 改为数组

const increaseWidth = (index) => {
  const newWidth = itemWidths.value[index] * 1.4;
  const decreaseWidth = (newWidth - itemWidths.value[index]) / 2;
  itemWidths.value[index] = newWidth;
  itemWidths.value.forEach((_, i) => {
    if (i !== index) {
      itemWidths.value[i] -= decreaseWidth;
    }
  });
  activeIndex.value = index;

  // 控制当前图标和数字的显示
  wz_ico.value[index] = false;
  wz_num.value[index] = false; // 只隐藏当前选项的数字
  blog_main_two_div_width.value = false;
};

const resetWidth = (index) => {
  itemWidths.value = [32, 32, 32];
  activeIndex.value = null;
  wz_ico.value[index] = true;
  wz_num.value[index] = true; // 只显示当前选项的数字
  blog_main_two_div_width.value = true;
};

// 获取网站统计数据
const fetchWebsiteStats = async () => {
  try {
    const config = useRuntimeConfig()
    const baseURL = config.public.baseURL
    const response = await $fetch<{
      articleCount: number
      runningDays: number
      visitCount: number
    }>(`${baseURL}/website-config/stats`)
    
    if (response) {
      syArticleData.value = [
        response.articleCount || 0,
        response.runningDays || 0,
        response.visitCount || 0
      ]
    }
  } catch (error) {
    console.error('获取网站统计数据失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchWebsiteStats()
})

// ---------------数据END-------------------
</script>

<style scoped>
.blog_main_two {
  user-select: none;
  height: 100px;
  width: 80%;
  margin: 0 auto;
}

.blog_main_two > div {
  width: 59%;
  height: 100%;
}

.blog_main_two > div > ul {
  display: flex;
  justify-content: space-between;
  height: 90px;
}

.blog_main_two > div > ul > li {
  font-size: 18px;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  transition: width 0.5s;
}

.blog_main_two > div > ul > li:nth-child(1) {
  background-image: linear-gradient(to right, #358cff, #25a8ff);
}

.blog_main_two > div > ul > li:nth-child(2) {
  background-image: linear-gradient(to right, #ff6755, #ff9146);
}

.blog_main_two > div > ul > li:nth-child(3) {
  background-image: linear-gradient(to right, #07f0c5, #1be9cb);
}

.blog_main_two_div {
  padding: 25px 0px 30px 10px;
  z-index: 1;
}

.blog_main_two_title {
  width: 110px;
  display: flex;
  justify-content: space-between;
}

.blog_main_two_hr {
  width: 20px;
  border-top: 2px solid #fff;
}

.blog_main_two_ico_gq {
  transition: transform 0.8s;
  transform: rotate(20deg);
  position: absolute;
  right: 30%;
  top: -10px;
}

.blog_main_two_ico_gh {
  transition: transform 0.8s;
  transform: rotate(0);
  position: absolute;
  right: 10px;
  animation: icoMove 0.5s infinite alternate;
}

@keyframes icoMove {
  from {
    top: 0px;
  }
  to {
    top: 20px;
  }
}

.wz_ico_gq {
  color: #55b2ff;
  font-size: 120px;
}

.yx_ico_gq {
  color: #FF7451; /* 第二个图标的颜色 */
  font-size: 120px;
}

.fw_ico_gq {
  color: #0DEDC6; /* 第三个图标的颜色 */
  font-size: 120px;
}

.wz_ico_gh {
  animation: wz_ico_Move 0.8s forwards;
}

@keyframes wz_ico_Move {
  from {
    //color: #55b2ff;
    font-size: 120px;
  }
  to {
    color: #ffffff;
    font-size: 100px;
  }
}

.yx_ico_gq {
  color: #ffa26d;
  font-size: 120px;
}

.yx_ico_gh {
  animation: yx_ico_Move 0.8s forwards;
}

@keyframes yx_ico_Move {
  from {
    color: #ffa26d;
    font-size: 120px;
  }
  to {
    color: #ffffff;
    font-size: 50px;
  }
}

.fw_ico_gq {
  color: #2cf5d0;
  font-size: 120px;
}

.fw_ico_gh {
  animation: fw_ico_Move 0.8s forwards;
}

@keyframes fw_ico_Move {
  from {
    color: #2cf5d0;
    font-size: 120px;
  }
  to {
    color: #ffffff;
    font-size: 50px;
  }
}

.wz_num_gq,
.yx_num_gq,
.fw_num_gq {
  opacity: 0;
  margin-left: -40px;
}

.wz_num_gh,
.yx_num_gh,
.fw_num_gh {
  animation: num_Move 0.8s forwards;
}

@keyframes num_Move {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.blog_main_two_div_width_gq {
  width: 110px;
}

.blog_main_two_div_width_gh {
  animation: blog_main_two_div_width_Move 0.8s forwards;
}

@keyframes blog_main_two_div_width_Move {
  from {
    width: 110px;
  }
  to {
    width: 160px;
  }
}

@media (max-width: 1200px) {
  .blog_main_two {
    display: none !important;
  }
}
</style>
