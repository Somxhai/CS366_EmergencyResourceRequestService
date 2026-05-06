# Initialize
FROM --platform=$BUILDPLATFORM oven/bun:latest AS builder
WORKDIR /app
# Copy project
COPY package.json bun.lock tsconfig.json ./
# Install
RUN bun install
# Build
COPY src/ ./src/
RUN bun run build
# Build app
FROM public.ecr.aws/lambda/nodejs:24.2026.02.24.20
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/index.handler"]
