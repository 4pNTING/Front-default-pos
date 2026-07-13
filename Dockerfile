# FROM node:20
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Optional, may fail silently
# # RUN npx --yes update-browserslist-db@latest || true

# # Copy all files
# COPY . .

# # Generate Prisma client
# RUN npx prisma generate
# RUN npm run build:icons


# # Set environment variables for build
# ENV NODE_ENV=production

# # Build the app
# RUN npm run build

# # Verify build succeeded
# RUN ls -la .next/

# EXPOSE 9051
# CMD ["npm", "start"]

FROM node:20
WORKDIR /app

# Copy all files first (schema must exist before install)
COPY . .

# Disable postinstall (prisma generate is triggered here)
ENV npm_config_loglevel=silent
ENV SKIP_POSTINSTALL=1

# Install dependencies
RUN npm install --legacy-peer-deps --ignore-scripts

# Run prisma manually AFTER schema exists
RUN npx prisma generate
RUN npm run build:icons

ENV NODE_ENV=production

# Build the Next.js app
RUN npm run build

EXPOSE 9064
CMD ["npx", "next", "start", "--port", "9064"]
