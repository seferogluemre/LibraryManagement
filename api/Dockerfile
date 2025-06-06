# Stage 1: Build the application
FROM node:20 as builder

WORKDIR /app

# Install bun (using npm, as it's pre-installed in the node image)
RUN npm install -g bun

# Copy package manifests
COPY package.json bun.lock tsconfig.json ./
# Copy prisma schema
COPY prisma ./prisma/

# Install all dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the source code
COPY src ./src/

# Generate Prisma Client
RUN bunx prisma generate

# Build the application
RUN bun run build


# Stage 2: Create the production image
FROM node:20-slim

WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy production dependencies manifest
COPY package.json bun.lock ./
# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Copy the built application, node_modules (with prisma client) and Prisma schema from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma


EXPOSE 3000

# This will be the command to run the application using the start script
CMD ["bun", "run", "start"]
