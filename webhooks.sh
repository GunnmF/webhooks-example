#!/bin/bash
WORK_PATH='/app/webhooks-example'
cd $WORK_PATH
echo "执行更新"
git reset --hard origin/main && git clean -f && git pull origin main && pnpm i
