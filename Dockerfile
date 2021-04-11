FROM node:15
WORKDIR /usr/src/app
COPY package*.json app.js address.txt ./
RUN npm install
CMD ["node", "app.js"]