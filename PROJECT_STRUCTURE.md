# 项目结构说明

本文档描述了项目的目录结构和主要文件功能，帮助开发者快速了解项目组织方式。

## 目录结构

```
├── .nuxt/                  # Nuxt自动生成的构建文件
├── assets/                 # 静态资源文件
│   ├── css/                # 全局CSS样式
│   │   ├── main.css        # 主样式文件
│   │   └── transitions.css # 过渡动画样式
│   └── images/             # 图片资源
│       ├── clouds/         # 云彩图片（首页时间切换）
│       └── backgrounds/    # 背景图片
├── components/             # 组件目录
│   ├── Common/             # 通用组件
│   │   ├── Header.vue      # 毛玻璃效果头部组件
│   │   ├── Footer.vue      # 页脚组件
│   │   ├── SideEdge.vue    # 侧边导航组件
│   │   └── StatusBar.vue   # 仿知乎状态栏组件
│   ├── Loading/            # 加载相关组件
│   │   ├── FullScreen.vue  # 全屏加载组件
│   │   └── index.vue       # 加载组件入口
│   └── Theme/              # 主题相关组件
│       └── ThemeToggle.vue # 深色模式切换组件
├── composables/            # 组合式函数
│   ├── useTheme.ts         # 主题管理
│   ├── useScroll.ts        # 滚动状态管理
│   └── useTimeEffect.ts    # 时间效果管理
├── layouts/                # 布局组件
│   ├── default.vue         # 默认布局
│   └── article.vue         # 文章页布局
├── pages/                  # 页面组件（自动生成路由）
│   ├── index.vue           # 首页
│   ├── about.vue           # 关于页面
│   └── articles/           # 文章相关页面
│       ├── index.vue       # 文章列表
│       └── [id].vue        # 文章详情页
├── plugins/                # 插件目录
│   ├── naive-ui.ts         # Naive UI插件配置
│   └── vanta.client.ts     # Vanta.js视觉效果插件
├── public/                 # 公共资源
│   ├── favicon.ico         # 网站图标
│   └── fonts/              # 字体文件
├── server/                 # 服务器端代码
│   ├── api/                # API路由
│   └── middleware/         # 服务器中间件
├── utils/                  # 工具函数
│   ├── animation.ts        # 动画相关工具
│   └── time.ts             # 时间处理工具
├── app.vue                 # 应用入口组件
├── nuxt.config.ts          # Nuxt配置文件
├── tailwind.config.js      # Tailwind CSS配置
├── tsconfig.json           # TypeScript配置
├── package.json            # 项目依赖和脚本
└── README.md               # 项目说明文档
```

## 核心文件说明

### 根目录文件

- **app.vue**: 应用根组件，配置全局布局、主题和加载状态
- **nuxt.config.ts**: Nuxt框架配置，包括模块、插件和构建选项
- **tailwind.config.js**: Tailwind CSS配置，定义主题颜色和扩展类

### 关键组件

- **components/Common/Header.vue**: 实现毛玻璃效果的头部导航栏
- **components/Common/StatusBar.vue**: 仿知乎的滚动状态栏
- **components/Common/SideEdge.vue**: 侧边导航和快捷功能
- **components/Loading/index.vue**: 首屏加载动画组件

### 功能模块

- **composables/useTheme.ts**: 深色模式切换逻辑
- **composables/useTimeEffect.ts**: 根据时间切换云彩效果
- **plugins/vanta.client.ts**: 配置Vanta.js视觉特效

## 特色功能实现

1. **头部毛玻璃效果**: 通过CSS backdrop-filter实现，在components/Common/Header.vue中定义
2. **仿知乎状态栏滑动**: 使用useScroll组合式函数监听滚动事件，动态调整状态栏样式
3. **首页随时间切换云彩**: 在useTimeEffect.ts中根据当前时间动态加载不同的云彩背景
4. **深色模式**: 通过Nuxt的ColorMode模块实现，在app.vue中配置主题切换
5. **首屏加载loading**: 在app.vue中使用isFullLoading状态控制全屏加载动画

## 开发注意事项

- 组件命名遵循PascalCase规范
- 使用Composition API和`<script setup>`语法
- 页面过渡效果在assets/css/transitions.css中定义
- Vanta.js特效仅在客户端渲染，通过插件配置 