#!/bin/bash
###
 # @Description: 
 # @Author: moumou.v1@foxmail.com
 # @Date: 2023-04-26 00:00:50
 # @LastEditTime: 2023-04-27 16:39:19
 # @LastEditors: moumou.v1@foxmail.com
### 
WORK_PATH='/usr/share/projects/backend-example'
. /root/.bashrc
nvm use 16.18.0
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