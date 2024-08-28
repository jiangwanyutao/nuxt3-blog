<script setup lang="ts"></script>

<template>
  <div class="logos">
    <span class="site-title">
      <span class="logolink logo">
        <a href="/">
          <ruby>
            <span class="sakuraso">江晚</span>
            <span class="no"></span>
            <span class="shironeko">正愁余</span>
            <rp></rp>
            <rt class="logo">jiangwanzhengchouyu</rt>
            <rp></rp>
          </ruby>
        </a>
      </span>
    </span>

    <!--    <p>-->
    <!--    <span id="n" style="width: 100px;">江晚</span>-->
    <!--    <span id="e" style="width: 100px;">正</span>-->
    <!--    <span id="o" style="width: 100px;">愁</span>-->
    <!--    <span id="n2" style="width: 100px;">余</span>-->
    <!--  </p>-->
  </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Warnes&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap');

.logos {
  width: fit-content;
  align-items: center;
  justify-content: center;
  flex: 1;
}

p {
  background: none;
  font-family: misans, serif;
  font-size: 25px;
  cursor: pointer;
}

p:hover span {
  animation: flicker 1s linear forwards;
}

p:hover #e {
  animation-delay: 0.2s;
}

p:hover #o {
  animation-delay: 0.5s;
}

p:hover #n2 {
  animation-delay: 0.6s;
}

@keyframes flicker {
  0% {
    color: #333;
  }
  5%,
  15%,
  25%,
  30%,
  100% {
    color: #fff;
    text-shadow: 0px 0px 5px var(--color), 0px 0px 10px var(--color), 0px 0px 20px var(--color),
      0px 0px 50px var(--color);
  }
  10%,
  20% {
    color: #333;
    text-shadow: none;
  }
}

.logo {
  font-family: kitty, Arial, 'PingFang SC', 'Microsoft Yahei', serif;
}

.logolink .sakuraso {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  color: #464646;
  height: auto;
  line-height: 25px;
  margin-right: 0;
  padding-bottom: 0px;
  padding-top: 1px;
  text-size-adjust: 100%;
  width: auto;
}

.logolink a:hover .sakuraso {
  background-color: orange;
  color: #fff;
}

.logolink a:hover .shironeko,
.logolink a:hover rt {
  color: orange;
}

.logolink.logo a {
  color: #464646;
  float: left;
  font-size: 25px;
  font-weight: 800;
  //height: 56px;
  //line-height: 56px;
  padding-left: 6px;
  padding-right: 15px;
  padding-top: 11px;
  text-decoration-line: none;
}
.logolink.logo .sakuraso,
.logolink.logo .no {
  font-size: 25px;
  border-radius: 9px;
  padding-bottom: 2px;
  padding-top: 5px;
}
.logolink.logo .no {
  display: inline-block;
  margin-left: 5px;
}

.logolink a:hover .no {
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}

.logolink ruby {
  ruby-position: under;
  -webkit-ruby-position: after;
}

.logolink ruby rt {
  font-size: 12px;
  transform: translateY(10px);
  opacity: 0;
  transition-property: opacity;
  transition-duration: 0.5s, 0.5s;
}

.logolink a:hover ruby rt {
  opacity: 1;
}
</style>
