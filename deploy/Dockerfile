FROM nginx

# 创建工作目录
RUN mkdir -p /web/nginx-test

# 设置工作目录
WORKDIR /web/nginx-test

# copy 打包之后的资源到工作区
COPY ./dist /web/nginx-test

# 因为type===404我们要模拟这个情况，因此不需要复制，可以考虑用模板加if else判断，或者试试docker本身能不能支持判断？（暂时不管，模板肯定是可以处理，其他的后面再看把）
COPY ./js/deploy.404.min.js /web/nginx-test

ADD ./nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
