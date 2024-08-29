<template>
  <div style="position: relative">
  <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

// 声明全局变量
let canvas1, ctx, W, H;
const mp = 25; // 纸屑数量
let animationHandler;
let particles = [];
let angle = 0;
let confettiActive = true;
let animationComplete = true;

// 定义纸屑颜色选项
const particleColors = {
  colorOptions: [
    'DodgerBlue',
    'OliveDrab',
    'Gold',
    'pink',
    'SlateBlue',
    'lightblue',
    'Violet',
    'PaleGreen',
    'SteelBlue',
    'SandyBrown',
    'Chocolate',
    'Crimson',
  ],
  colorIndex: 0,
  colorIncrementer: 0,
  colorThreshold: 10,
  getColor() {
    if (this.colorIncrementer >= 10) {
      this.colorIncrementer = 0;
      this.colorIndex++;
      if (this.colorIndex >= this.colorOptions.length) {
        this.colorIndex = 0;
      }
    }
    this.colorIncrementer++;
    return this.colorOptions[this.colorIndex];
  },
};

// 定义纸屑粒子的构造函数
function confettiParticle(t, size) {
  this.x = Math.random() * W;
  this.y = Math.random() * H - H;
  this.r = size;
  this.d = Math.random() * mp + 10;
  this.color = t;
  this.tilt = Math.floor(10 * Math.random()) - 10;
  this.tiltAngleIncremental = 0.07 * Math.random() + 0.05;
  this.tiltAngle = 0;

  this.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = this.r / 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
    ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
    ctx.stroke();
  };
}

// 设置全局变量
function SetGlobals() {
  canvas1 = document.getElementById('canvas');
  console.log(canvas1,'canvas1')
  ctx = canvas1.getContext('2d');
  W = window.innerWidth;
  H = window.innerHeight;
  canvas1.width = W;
  canvas1.height = H;
}

// 初始化纸屑效果
function InitializeConfetti() {
  particles = [];
  animationComplete = false;
  for (let t = 0; t < mp; t++) {
    const i = particleColors.getColor();
    const particleSize = RandomFromTo(5, 10); // 纸屑大小范围
    particles.push(new confettiParticle(i, particleSize));
  }
  StartConfetti();
}

// 绘制纸屑效果
function Draw() {
  ctx.clearRect(0, 0, W, H);
  for (let n = 0; n < mp; n++) {
    particles[n].draw();
  }
  Update();
}

// 生成指定范围内的随机整数
function RandomFromTo(t, i) {
  return Math.floor(Math.random() * (i - t + 1) + t);
}

// 更新纸屑效果
function Update() {
  let i = 0;
  angle += 0.01;
  for (let n = 0; n < mp; n++) {
    const t = particles[n];
    if (animationComplete) return;
    if (!confettiActive && t.y < -15) {
      t.y = H + 100;
    } else {
      stepParticle(t, n);
      if (t.y <= H) i++;
      CheckForReposition(t, n);
    }
  }
  if (i === 0) StopConfetti();
}

// 检查纸屑是否需要重新定位
function CheckForReposition(t, i) {
  if (t.x > W + 20 || t.x < -20 || t.y > H) {
    if (confettiActive) {
      if (i % 5 > 0 || i % 2 == 0) {
        repositionParticle(t, Math.random() * W, -10, Math.floor(10 * Math.random()) - 10);
      } else {
        if (Math.sin(angle) > 0) {
          repositionParticle(t, -5, Math.random() * H, Math.floor(10 * Math.random()) - 10);
        } else {
          repositionParticle(t, W + 5, Math.random() * H, Math.floor(10 * Math.random()) - 10);
        }
      }
    }
  }
}

// 移动纸屑粒子
function stepParticle(t, i) {
  t.tiltAngle += t.tiltAngleIncremental;
  t.y += (Math.cos(angle + t.d) + 3 + t.r / 2) / 5; // 下降速度
  t.x += Math.sin(angle);
  t.tilt = 15 * Math.sin(t.tiltAngle - i / 3);
}

// 重新定位纸屑粒子
function repositionParticle(t, i, n, e) {
  t.x = i;
  t.y = n;
  t.tilt = e;
}

// 启动纸屑效果
function StartConfetti() {
  (function t() {
    if (animationComplete) return null;
    animationHandler = requestAnimFrame(t);
    Draw();
  })();
}

// 停止纸屑效果
function StopConfetti() {
  animationComplete = true;
  if (ctx !== null) ctx.clearRect(0, 0, W, H);
}

// 自定义请求动画帧函数
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

// 当组件挂载时执行的初始化函数
onMounted(() => {
  nextTick(() => {
    SetGlobals();
    InitializeConfetti();
  });

  // 当窗口大小变化时，重新设置画布大小
  const handleResize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas1.width = W;
    canvas1.height = H;
  };

  window.addEventListener('resize', handleResize);

  // 清理事件监听器
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000; /* 确保在其他内容上面 */
}
</style>
