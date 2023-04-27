#!/bin/bash
WORK_PATH='/workdir/backend-example'
cd $WORK_PATH
echo "清理代码"
git reset --hard origin/main
git clean -f
echo "拉取代码"
git pull origin main
echo "开始编译"
pnpm run build
echo "构建镜像"
docker build -t backend:1.0.0 .
echo "清理容器"
docker stop backend
docker rm -f backend
echo "启动容器"
docker run -p 3005:3000 --name backend -d backend:1.0.0