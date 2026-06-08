# Microsoft's official Playwright image ships Node.js, browsers and OS
# dependencies pre-installed and version-matched — using it means the
# container needs no `playwright install --with-deps` step, and the browser
# build is guaranteed to match the @playwright/test version below.
FROM mcr.microsoft.com/playwright:v1.60.0-noble

WORKDIR /app

# Install dependencies first so this layer is cached across source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default to the full regression suite; override at `docker run` time, e.g.
#   docker run --rm dulux-e2e npx playwright test --project=api
CMD ["npx", "playwright", "test"]
