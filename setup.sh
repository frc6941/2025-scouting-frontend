#!/bin/bash

echo "🚀 开始设置 2025 Scouting Frontend 项目..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装Node.js"
    echo "请访问 https://nodejs.org/ 下载并安装最新LTS版本"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 清理旧的依赖
echo "🧹 清理旧的依赖..."
rm -rf node_modules package-lock.json

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 创建环境配置文件
if [ ! -f .env.local ]; then
    echo "📝 创建环境配置文件..."
    cat > .env.local << EOL
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 如果使用不同的API服务器，请修改上面的URL
EOL
    echo "✅ 已创建 .env.local 文件"
else
    echo "ℹ️  .env.local 文件已存在"
fi

echo ""
echo "🎉 设置完成！"
echo ""
echo "现在你可以运行以下命令启动开发服务器："
echo "  npm run dev"
echo ""
echo "然后在浏览器中访问 http://localhost:3000"
echo ""
echo "如果需要修改API地址，请编辑 .env.local 文件" 