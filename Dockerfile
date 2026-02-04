FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma and other potential native deps
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
