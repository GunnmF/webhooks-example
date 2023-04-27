#!/bin/bash
WORK_PATH='/app/webhooks-example'
cd $WORK_PATH
echo "停止服务"
pm2 stop webhooks
pm2 delete webhooks
echo "清理代码"
git reset --hard origin/main
git clean -f
echo "拉取代码"
git pull origin main
echo "安装依赖"
pnpm i
echo "启动服务"
pnpm run dev