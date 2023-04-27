#!/bin/bash
WORK_PATH='/app/frontend-example'
cd $WORK_PATH
echo "清理代码"
git reset --hard origin/main
git clean -f
echo "拉取代码"
git pull origin main
echo "安装依赖"
pnpm i
echo "开始编译"
pnpm run build
echo "构建镜像"
docker build -t frontend:1.0.0 .
echo "清理容器"
docker stop frontend
docker rm -f frontend
echo "启动容器"
docker run -p 3004:80 --name frontend --restart always -d frontend:1.0.0