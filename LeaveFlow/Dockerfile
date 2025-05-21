# Base image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Build the React app
RUN npm run build

# Serve using a lightweight web server (optional)
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
