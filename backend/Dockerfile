# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install
COPY . .

# Expose backend port (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
