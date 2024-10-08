```
git clone https://github.com/ahmed-fawzy99/hg-db-projects.git
cd hg-db-projects
composer install
cp .env.example .env 
php artisan key:generate
php artisan migrate --seed
npm install

npm run dev
php artisan serve
```


# Windows Installation

Pre-requisites:
- Install PHP
- Install Composer
- Install Node.js
- Install PostgreSQL
- Install Git

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
- Enable the following extensions in `php.ini` by uncommenting them:
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

## Composer
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```

## Node.js
Download Node.js from [here](https://nodejs.org/en/download/) -> LTS

## PostgreSQL
Download PostgreSQL from [here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) -> Windows -> Latest
and install it.
Then, open `pgAdmin` and create a new database with the name `hg_db_projects`

## Git
Download Git from [here](https://git-scm.com/download/win)
