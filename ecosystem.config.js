module.exports = {
    apps: [
      {
        name: 'blogNuxt', // 设置启动项目名称
        port: '3001', // 监听端口
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs',
        env: {
          NODE_ENV: 'production',
          NUXT_PUBLIC_API_BASE: 'http://localhost:3006'  // 后端API地址
        }
      }
    ]
  }