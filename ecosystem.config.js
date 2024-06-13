module.exports = {
    apps: [
      {
        name: 'blogNuxt', // 设置启动项目名称
        port: '3001', // 监听端口
        exec_mode: 'cluster',
        instances: 'max',
        script: './.output/server/index.mjs'
      }
    ]
  }