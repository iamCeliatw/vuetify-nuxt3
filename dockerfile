# 選擇一個基礎鏡像，這裡使用 Node.js 官方鏡像
FROM node:18

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安裝項目依賴
RUN npm install

# 複製項目文件到工作目錄
COPY . .

# 構建 Nuxt3 應用
RUN npm run build

# 暴露 3000 端口
EXPOSE 3000

# 啟動應用
CMD ["npm", "run", "dev"]
