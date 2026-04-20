FROM php:8.3-cli AS php-deps

# Extensões PHP necessárias para Laravel
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

# ─── Stage 2: Node build ───────────────────────────────────────────────────────
FROM node:22-slim AS node-build

WORKDIR /app
COPY --from=php-deps /app /app

RUN npm ci && npm run build

# ─── Stage 3: Runtime ──────────────────────────────────────────────────────────
FROM php:8.3-cli AS runtime

RUN apt-get update && apt-get install -y \
    libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=node-build /app /app

RUN mkdir -p storage/logs storage/framework/cache \
                         storage/framework/sessions \
                         storage/framework/views \
                         bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=8080