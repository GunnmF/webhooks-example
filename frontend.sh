#!/bin/bash
WORK_PATH='/usr/share/projects/frontend-example'
. /root/.bashrc
nvm use 16.18.0
cd $WORK_PATH
echo "清理代码"
git reset --hard origin/main
git clean -f
echo "拉取代码"
git pull origin main
echo "安装依赖"
npm i
echo "开始编译"
npm run build
echo "构建镜像"
docker build -t frontend:1.0.0 .
echo "清理容器"
docker stop frontend
docker rm -f frontend
echo "启动容器"
docker run -p 3000:80 --name frontend -d frontend:1.0.0