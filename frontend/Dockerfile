# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false  # Install all dependencies for build

# Copy source code and build the app
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies and built app
COPY --from=builder /app/package.json /app/package-lock.json* ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
RUN npm install --production  # Install only production dependencies

# Expose port
EXPOSE 3000

# Run the app in production mode
CMD ["npm", "start"]