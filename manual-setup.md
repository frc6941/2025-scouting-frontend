# 手动设置指南

如果自动脚本失败，请按以下步骤手动设置：

## 1. 清理旧依赖
```bash
rm -rf node_modules package-lock.json
```

## 2. 安装依赖
```bash
npm install
```

## 3. 创建环境配置
```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
```

## 4. 启动开发服务器
```bash
npm run dev
```

## 5. 测试应用
打开浏览器访问: http://localhost:3000

## 常见问题

### 如果遇到权限错误：
```bash
sudo npm install -g npm@latest
```

### 如果遇到网络错误：
```bash
npm config set registry https://registry.npmmirror.com/
npm install
```

### 如果HeroUI组件报错：
确保package.json中只有`@heroui/react`，没有`@nextui-org/react`

### 验证TeamSelector是否工作：
1. 启动应用后访问Dashboard
2. 查看团队选择器是否能正常搜索
3. 确认下拉列表显示正确 