FROM node:16-alpine

# 创建工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads && chmod 755 uploads

# 暴露端口
EXPOSE 8600

# 启动命令
CMD ["npm", "start"] 