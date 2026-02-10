FROM php:8.2-cli

WORKDIR /var/www

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip gd \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY composer.json composer.lock* /var/www/
RUN composer install --no-interaction --no-ansi --no-progress --no-scripts --no-autoloader

COPY ./ /var/www/
RUN composer dump-autoload --optimize

ENV PORT=8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
