ARG NODE_VERSION=21
FROM node:${NODE_VERSION}-alpine3.18 as base
WORKDIR /usr/src/app    
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
