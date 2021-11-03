FROM node:alpine

WORKDIR /app

COPY package*.json ./
# Only install dependencies
RUN npm install --only=prod

COPY ./ ./

CMD ["npm", "start"]
