```
git clone https://github.com/ahmed-fawzy99/hg-db-projects.git
cd hg-db-projects
composer install
npm install
cp .env.example .env 
```

Open `.env` and set your database credentials.

```
php artisan key:generate
php artisan storage:link
php artisan migrate --seed
```

Media Library:
```
sudo apt install jpegoptim optipng pngquant gifsicle libavif-bin
npm install -g svgo
```

Run Development Server:
```
npm run dev
php artisan serve
```

# PHP Setup
Make sure php upload_max_filesize and post_max_size are set to appropriate values in php.ini


# Windows Installation

Pre-requisites:
- Install PHP
- Install Composer
- Install Node.js
- Install PostgreSQL

## PHP
Download PHP from [here](https://windows.php.net/download/) -> Thread Safe -> x64 -> Latest
Extract the downloaded file to `C:\php`
Add `C:\php` to the system environment variables:
- Right-click on `This PC` -> `Properties` -> `Advanced system settings` -> `Environment Variables`
- Under `System variables`, select `Path` and click `Edit`
- Click `New` and add `C:\php`
- Click `OK` -> `OK` -> `OK`
- Open `cmd` and run `php -v` to verify the installation
- You should see the PHP version

### PHP Extensions
- Enable the following extensions in `php.ini` (copy php-ini-development and name it php.ini if there is no php.ini) in `C:\php` by uncommenting them:
  - `extension=curl`
  - `extension=fileinfo`
  - `extension=gd2`
  - `extension=mbstring`
  - `extension=openssl`
  - `extension=pdo_pgsql`
  - `extension=pgsql`
  - `extension=sockets`
  - `extension=xmlrpc`
  - `extension=xsl`
  - `extension=zip`
Verify the installation by running `php -m` in `cmd` and you should see the enabled extensions

## Composer
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```
Verify the installation by running `composer -V` in `cmd` and you should see the Composer version

## Node.js
Download Node.js from [here](https://nodejs.org/en/download/) -> LTS

Install it.

Verify the installation by running `node -v` and `npm -v` in `cmd` and you should see the Node.js and npm versions

## PostgreSQL
Download PostgreSQL from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) -> Windows -> Latest

Install it, and remember the password you set for the `postgres` user as we well as the port number.


Then, open `pgAdmin` and create a new database with the name `hg_db_projects`
