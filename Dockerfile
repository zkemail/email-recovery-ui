# Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=2048"


# Build the React application
RUN yarn build

# Use a smaller image to serve the application
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /app/dist ./build
COPY --from=build /app/server.js ./

# Expose port 80
EXPOSE 80

# Start the server
CMD ["node", "server.js"]
