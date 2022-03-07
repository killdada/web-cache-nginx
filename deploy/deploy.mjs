#!/usr/bin/env zx

// 进入发布目录
cd('./deploy');

// docker-compose构建镜像启动容器，(-d:后台运行,--build：每次都重新构建镜像，必须加不加的话dist源码更新容器里面跑的镜像还是旧的导致代码没更新)
await $`docker-compose up -d --build`;

console.log(chalk.green('发布成功！！！！！'));

// 上一步每一次都是执行up都是创建新的镜像，新镜像的名字一直是 deploy_web_1,导致原来的deploy_web_1被覆盖，旧的deploy_web_1镜像被重命名为一个"none"的镜像 （源码更改才会产生，源码没更改不会生成新的镜像）

// 等待10s后
await $`sleep 10`;

console.log(chalk.cyan('开始删除多余的none镜像'));

// 删除none历史旧镜像，源代码没有更改不会产生新的镜像，没有none镜像会抛出异常，因此用nothrow包裹
await nothrow($`docker rmi $(docker images | grep "none" | awk '{print $3}')`);
