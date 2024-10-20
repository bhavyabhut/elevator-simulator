# Use official Node.js LTS image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code (assuming the source is in src folder)
RUN npm run build

# Expose the port the app will run on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
