# Use the official PHP 8.2 image
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim \
    optipng \
    pngquant \
    gifsicle \
    vim \
    unzip \
    git \
    curl \
    libzip-dev \
    libpq-dev \
    libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql mbstring zip exif pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy application source code into the container
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Production artisan commands
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan event:cache \
    && php artisan storage:link

# Install Node.js dependencies
RUN npm install \
    && npx vite build

RUN chown -R www-data:www-data /var/www
RUN find /var/www -type d -exec chmod 775 {} \;
RUN find /var/www -type f -exec chmod 664 {} \;
RUN chmod 600 /var/www/.env

# Expose port (adjust as necessary)
EXPOSE 9000

# Start the PHP-FPM server
CMD ["php-fpm"]
