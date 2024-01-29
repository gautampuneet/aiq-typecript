# Use an official Node.js LTS (Long Term Support) image as base
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json tsconfig to the working directory
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY src/* ./src/

# Build the TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app (adjust as needed)
CMD ["tsc", "src/router.ts"]
