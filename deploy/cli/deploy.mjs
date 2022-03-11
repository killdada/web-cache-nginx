#!/usr/bin/env zx

// 不输出命令流，默认输出
// $.verbose = false;

const resolvePath = (param) => {
  return path.join(__dirname, param);
};

const paths = {
  jsPath: resolvePath('../js/deploy.404.js'),
  jsOutputPath: resolvePath('../js/deploy.404.min.js'),
  // html.mjs从命令目录进入到当前的cli目录
  cliRelativePath: path.relative(process.cwd(), __dirname),
};

const nginxType = argv.type;

// 如果type === 404那么不需要注入404的处理，我们需要模拟缺失404的情况
if (nginxType !== 404) {
  console.log(chalk.cyan('404js文件压缩中......'));
  // 压缩需要注入的404.js文件
  await $`terser ${paths.jsPath} -o ${paths.jsOutputPath} -c defaults`;

  console.log(chalk.green('404js文件压缩成功!!!'));

  // 从命令当前目录进入到cli目录
  if (paths.cliRelativePath) {
    cd(paths.cliRelativePath);
  }

  console.log(chalk.cyan('404js插入入口文件中......'));

  await $`zx html.mjs --type=${nginxType}`;

  console.log(chalk.green('404js插入入口文件成功!!!'));

  console.log(chalk.blue('注意404.min.js需要复制到容器里面'));

  // cli目录往上退到docker目录,然后开始执行docker命令
  cd('..');
} else {
  if (paths.cliRelativePath) {
    cd(paths.cliRelativePath);
  }
  cd('..');
}

console.log(chalk.cyan('打包镜像文件，重启容器中......'));

// docker-compose构建镜像启动容器，(-d:后台运行,--build：每次都重新构建镜像，必须加不加的话dist源码更新容器里面跑的镜像还是旧的导致代码没更新)
await $`docker-compose up -d --build`;

console.log(chalk.green('发布成功！！！！！'));

// 上一步每一次都是执行up都是创建新的镜像，新镜像的名字一直是 deploy_web_1,导致原来的deploy_web_1被覆盖，旧的deploy_web_1镜像被重命名为一个"none"的镜像 （源码更改才会产生，源码没更改不会生成新的镜像）

console.log(chalk.cyan('删除多余镜像等待10s.....'));

// 等待10s后
await $`sleep 10`;

// 删除none历史旧镜像，源代码没有更改不会产生新的镜像，没有none镜像会抛出异常，因此用nothrow包裹
await nothrow($`docker rmi $(docker images | grep "none" | awk '{print $3}')`);

console.log(chalk.green('删除多余的none镜像成功!!!'));
