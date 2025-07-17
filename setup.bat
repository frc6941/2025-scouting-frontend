@echo off
echo 🚀 开始设置 2025 Scouting Frontend 项目...

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装Node.js
    echo 请访问 https://nodejs.org/ 下载并安装最新LTS版本
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
node --version
npm --version

REM 清理旧的依赖
echo 🧹 清理旧的依赖...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM 安装依赖
echo 📦 安装项目依赖...
npm install

REM 创建环境配置文件
if not exist .env.local (
    echo 📝 创建环境配置文件...
    (
        echo # API Configuration
        echo NEXT_PUBLIC_API_URL=http://localhost:3001/api
        echo.
        echo # 如果使用不同的API服务器，请修改上面的URL
    ) > .env.local
    echo ✅ 已创建 .env.local 文件
) else (
    echo ℹ️  .env.local 文件已存在
)

echo.
echo 🎉 设置完成！
echo.
echo 现在你可以运行以下命令启动开发服务器：
echo   npm run dev
echo.
echo 然后在浏览器中访问 http://localhost:3000
echo.
echo 如果需要修改API地址，请编辑 .env.local 文件
pause 