#!/bin/bash
WORK_PATH='/usr/project/front_end'
cd $WORK_PATH
echo "清理代码"
git reset --hard origin/master
git clean -f
echo "拉取代码"
git pull origin/master
echo "构建镜像"
docker build -t front_end:1.0.0 .
echo "清理镜像"
docker stop front_end
docker rm -f front_end
echo "启动容器"
docker run -p 2000:80 --name front_end -d front_end:1.0.0