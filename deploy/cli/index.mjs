#!/usr/bin/env zx

const minimist = require('minimist');

// 自带的argv没有扩展alias，这里我们自己扩展下
const argvs = minimist(process.argv.slice(2), {
  alias: {
    type: 't',
    help: 'h',
  },
  default: {
    type: 'base',
  },
});
const { type, help } = argvs;

if (help) {
  console.log('yarn nginx,使用nginx/nginx.base.conf启动服务');
  console.log('yarn nginx -t alias,使用nginx/nginx.alias.conf启动服务');
  console.log('yarn nginx -t header,使用nginx/nginx.header.conf启动服务');
  console.log('yarn nginx -t 404,模拟404的情况，因此不要复制注入404js处理');
}

// 根据type取到对应路径的nginx配置，覆盖掉nginx/nginx.conf

const nginxPath = path.join(__dirname, `../nginx/nginx.${type}.conf`);
const nginxTargetPath = path.join(__dirname, '../nginx/nginx.conf');

await fs.copy(nginxPath, nginxTargetPath);

cd(path.relative(process.cwd(), __dirname));

// 接着执行其他命令;https://github.com/chalk/chalk/issues/381 颜色丢失
await $`export FORCE_COLOR='1' && zx deploy.mjs --type=${type}`;
