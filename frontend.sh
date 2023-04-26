#!/bin/bash
WORK_PATH='/usr/share/project/frontend-example'
cd $WORK_PATH
echo "清理代码"
git reset --hard origin/main
git clean -f
echo "拉取代码"
git pull origin/main
echo "构建镜像"
docker build -t frontend:1.0.0 .
echo "清理镜像"
docker stop frontend
docker rm -f frontend
echo "启动容器"
docker run -p 2000:80 --name frontend -d frontend:1.0.0