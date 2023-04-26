#!/bin/bash
WORK_PATH='/usr/share/projects/frontend-example'
cd $WORK_PATH
echo "清理代码"
git reset --hard origin/main
git clean -f
echo "拉取代码"
git pull
echo "开始编译"
. /root/.bashrc
nvn use 16.18.0
npm run build
echo "构建镜像"
docker build -t frontend:1.0.0 .
echo "清理镜像"
docker stop frontend
docker rm -f frontend
echo "启动容器"
docker run -p 3000:80 --name frontend -d frontend:1.0.0