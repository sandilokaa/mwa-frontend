FROM node:23.5.0-buster AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:23.5.0-buster

WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]