#!/bin/bash
WORK_PATH='/usr/project/back_end'
cd $WORK_PATH
echo "清理代码"
git reset --hard origin/master
git clean -f
echo "拉取代码"
git pull origin/master
echo "构建镜像"
docker build -t back_end:1.0.0 .
echo "清理镜像"
docker stop back_end
docker rm -f back_end
echo "启动容器"
docker run -p 2001:3000 --name back_end -d back_end:1.0.0