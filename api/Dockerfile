FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json bun.lock ./

# Copy patches
COPY ./patches ./patches

# Install package
RUN bun install

# Copy project files
COPY ./src ./src
COPY ./tsconfig.json .
# Copy ORM config
COPY ./drizzle.config.ts .

# Copy Cert
COPY ./cert ./cert

# Set app to production
ENV NODE_ENV=production

# Build app to binary
RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

# Copy files from first stage
COPY --from=build /app/server server
# Copy the cert folder from the first stage
COPY --from=build /app/cert ./cert
# Set app to production
ENV NODE_ENV=production

# Start app
CMD ["./server"]

EXPOSE 3000
