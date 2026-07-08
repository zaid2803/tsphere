# Use an official Node runtime as parent image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package configuration files
COPY package.json /app/

# Install application dependencies
RUN npm install

# Copy all local code into container
COPY . /app/

# Expose port React runs on
EXPOSE 3000

# Start the dev environment
CMD ["npm", "start"]