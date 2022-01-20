# Name the node stage "builder"
FROM node:15-alpine AS builder

# Set working directory
WORKDIR /app

# Copy our node module specification
COPY package.json package.json

# install node modules and build assets
RUN npm install --production

# Copy all files from current directory to working dir in image
# Except the one defined in '.dockerignore'
COPY . .

# Create production build of React App
RUN npm run build

# Choose NGINX as our base Docker image
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

# Set working directory to nginx asset directory

# Remove default nginx static assets
RUN rm -rf *

# Copy static assets from builder stage
COPY --from=builder /app/build .

EXPOSE 80

# Entry point when Docker container has started
ENTRYPOINT ["nginx", "-g", "daemon off;"]