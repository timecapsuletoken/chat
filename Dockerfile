# Use the official Node.js 16 image as the base
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's files into the container
COPY . .

# Build the React app for production
RUN npm run build

# Install a lightweight HTTP server to serve the build files
RUN npm install -g serve

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the app using the serve command
CMD ["serve", "-s", "build", "-l", "3000"]