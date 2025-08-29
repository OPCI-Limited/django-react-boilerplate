FROM node:22

WORKDIR /app

ENV NODE_ENV=development

# Install dependencies (use lockfile when available)
COPY package*.json ./
RUN npm ci || npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
