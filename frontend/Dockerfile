# File: frontend/Dockerfile

# Stage 1: Build the React application
FROM node:22-alpine AS build
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production. The API URL is handled at runtime by Nginx.
RUN npm run build

# Stage 2: Serve application with Nginx
FROM nginx:stable-alpine

# Install 'gettext' for 'envsubst' to allow environment variable substitution in the config
RUN apk --no-cache add gettext

# Copy built assets from the build stage to Nginx's web root directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration template. This will be processed on container start.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose port 80 for the Nginx web server
EXPOSE 80

# When the container starts, substitute ONLY the specified environment variables,
# save it as the final config, and then start the Nginx server in the foreground.
CMD ["/bin/sh", "-c", "envsubst '${VITE_API_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]