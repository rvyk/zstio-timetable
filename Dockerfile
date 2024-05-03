FROM arm64v8/node:22-alpine as builder

WORKDIR /app

COPY . ./

RUN npm install && npm run build

EXPOSE 3000

CMD ["npm", "start"]