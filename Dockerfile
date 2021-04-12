FROM node:15
WORKDIR /usr/src/app
COPY package*.json app.js accounts.txt ./
RUN npm install
CMD ["node", "app.js"]