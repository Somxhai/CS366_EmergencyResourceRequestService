FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

# Install package
RUN bun install

# Copy project files
COPY ./src ./src
COPY ./prisma ./prisma
COPY ./prisma.config.ts .
COPY ./tsconfig.json .


# Migration and generate models
RUN bunx prisma generate

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
COPY --from=build /app/prisma ./prisma

# Set app to production
ENV NODE_ENV=production

# Start app
CMD ["./server"]

EXPOSE 3000
