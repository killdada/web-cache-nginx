FROM nginx

# 创建工作目录
RUN mkdir -p /web/nginx-test

# 设置工作目录
WORKDIR /web/nginx-test

# copy 打包之后的资源到工作区
COPY ./dist /web/nginx-test

COPY ./js/deploy.404.min.js /web/nginx-test

ADD ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
