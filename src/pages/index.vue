<template>
  <div class="contonter">
  <CommonBackground ref="target"></CommonBackground>
    <div class="w-full mx-auto max-w-screen-2xl" style="display: flex;margin-top: 20px">
       <div class="firstcolumn s-sticky" >
         <HomePersonal></HomePersonal>
       </div>
      <n-flex class="w-full" justify="center">
        <div class="acticle">
        <HomeArticleList></HomeArticleList>
        </div>
        <div class="information">
          个人信息栏
        </div>
      </n-flex>
    </div>
  </div>

</template>
<script setup lang="ts">
const target = ref(null)
const targetIsVisible = ref(true)

const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      targetIsVisible.value = isIntersecting
    },
)
</script>
<style scoped lang="scss">
.contonter{
  position: relative;
}
.p-sticky {
  position: fixed;
  top: 100px;
  left: 316px;
  width: 300px;
}
.acticle{
  width: 696px;
}
.firstcolumn{
  width: 400px;
  height: 400px;
}
.firstcolumn-bak{
  width: 280px;
}
.information{
  width: 280px;
  height: 400px;
  background-color: rgba(0, 128, 0, 0.12);
}

.s-sticky {
  position: sticky;
  top: 100px;
}
</style>
