# Setting nodejs in environment
FROM node:18-alpine 

# Setting the main work directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Exposing port to be accessible within the container
EXPOSE 3000

# Building the application
RUN npm run build

# Running application
CMD ["npm", "run", "local"]