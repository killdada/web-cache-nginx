# web-nginx-test

学习nginx、docker的使用，验证一些之前遇到过的问题

工具依赖

docker、docker-compose

请先 [安装docker](https://www.docker.com/get-started)

## 常用命令

1: 初始化

`yarn`

<!-- zx全局安装，发布使用了该命令工具 -->
`yarn global add zx`

2：本地开发

`yarn start`

访问 http://localhost:8000

[本地文档](http://localhost:8000/#/~docs)

3: 发布

构建前端代码，并且使用docker启动服务

`yarn build`

访问 http://localhost:9999

如果只是更改了nginx配置，不需要重新构建dist源码，执行 `yarn deploy`即可

## 背景

[参考Loading chunk {n} failed](https://www.pengsifan.com/2020/12/01/Loading%20chunk%20%7Bn%7D%20failed/)

本地模拟

切换到 404分支，按如下图操作即可复现该问题

![](./doc-img/404-1.png)

![](./doc-img/404-2.png)

![](./doc-img/404-3.png)

结合上面的参考文档分析，以及其他百度分析，处理如下

1：nginx配置

对 index.html 新增响应头

```js
Cache-Control "no-cache";
```

新增改响应头以后，默认index.html文件始终会请求服务器，进行协商缓存，[nginx etag生成规则](https://www.ipcpu.com/2019/09/nginx-etag-gzip/)，每次发布以后index.html文件的修改时间变了，etag也变了，不会命中304缓存


2：路由拦截新增404跳转等

cra项目，代码在淘福客运营商系统有

```js
import { lazy } from "react";

function retry(fn) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        const pattern = /Loading (CSS )?chunk (\d)+ failed/g;
        const isChunkLoadFailed = error.message.match(pattern);
        if (isChunkLoadFailed) {
          window.location.reload();
        }
        reject(error);
      });
  });
}

/**
 * react lazy包装器
 * @param {*} pagePath 页面路径
 * @param {*} prefix 页面路径前缀，对应文件夹最初的前缀、模式是 /operator 大部分页面都是在这个文件夹下
 */
export default function Loadable(pagePath, prefix = "/operator") {
  return lazy(() => retry(() => import(`../view${prefix}${pagePath}`)));
}

```

出现 isChunkLoadFailed error的时候直接 reload整个页面解决


<Alert type="info">
目前大部分详情新增该处理后，自行验证可以解决该问题，但是部分情况，比如商品中心这个项目，有的用户电脑偶发的出现 index.html 直接 命中了 200 强缓存；
并且路由拦截的404好像也没有触发；自己测试没有出现过，因此不清楚具体还有那里会影响这个缓存 （商品中心已废弃，重构了新版本）
</Alert>

基于上面的情况提出而下二点优化

- index.html 的 no-cache 改成 no-store，看能不能避免商品中心项目还命中200强缓存
- 404处理放到nginx层，业务层不再处理这种情况

## 参考文档

官方文档

- [umi](https://umijs.org/zh-CN/docs) 脚手架
- [dumi](https://d.umijs.org/zh-CN) 文档工具
- [zx](https://github.com/google/zx) google命令行工具
- [docker-compose](https://docs.docker.com/compose/reference/config/) docker-compose管理
- [nginx](https://www.nginx.cn/doc/)

其他文档

- [docker-compose.yaml](https://www.jianshu.com/p/0e25ebffd197) 文件详解
- [nginx](https://juejin.cn/post/7007346707767754765) nginx整合介绍
- [浏览器缓存](https://github.com/yiliang114/Blog/issues/6)


