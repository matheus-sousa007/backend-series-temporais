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

EXPOSE 3000
# Command to run application


RUN npm run build

CMD ["npm", "run", "local"]