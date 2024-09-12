@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM 目标 Node.js 版本
SET TARGET_VERSION=18.17.0

REM 获取当前 Node.js 版本
FOR /F "tokens=2 delims==" %%I IN ('node -p "process.versions.node"') DO SET CURRENT_VERSION=%%I

echo 当前 Node.js 版本: !CURRENT_VERSION!

    REM 检查当前版本是否为目标版本
IF NOT "!CURRENT_VERSION!"=="!TARGET_VERSION!" (
    echo 当前版本不是 !TARGET_VERSION!，正在切换...

REM 使用 nvm 切换版本
    nvm use !TARGET_VERSION!

    IF ERRORLEVEL 1 (
    echo 切换 Node.js 版本失败
EXIT /B 1
)

echo 已切换到 Node.js 版本 !TARGET_VERSION!
) ELSE (
    echo 当前版本已是 !TARGET_VERSION!
)

REM 检查 npm 是否可用
npm -v
IF ERRORLEVEL 1 (
    echo npm 未安装或未在 PATH 中
    EXIT /B 1
)

REM 启动 Nuxt 项目
npm run dev

ENDLOCAL
