FROM node:16.1-alpine3.13
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["npm", "start"]