#!/bin/bash

# Install or update composer and run an update to get latest code
printf "Checking for Composer..."
COMPOSER=/opt/codedeploy-agent/bin/composer.phar
if [ -f $COMPOSER ]; then
    echo "Found"
    echo "Running Composer Self Update"
    su - www-data -s /bin/bash -c  "php $COMPOSER --no-interaction selfupdate"
else
    echo "Not found"
    echo "Installing Composer"
    curl -sS https://getcomposer.org/installer | php -- --install-dir=bin
fi

# Move working directory to web root
cd /var/www/html

# All files in html should be owned by www-data
echo "Setting ownership of /var/www/html/* to www-data:www-data"
chown -R www-data:www-data /var/www/html

# Run composer install
#su - www-data -s /bin/bash -c  "cd /var/www/html; php $COMPOSER --no-interaction update"
if [ "$DEPLOYMENT_GROUP_NAME" == "Production" ] ; then
    su - www-data -s /bin/bash -c  "cd /var/www/html; php $COMPOSER --no-interaction install --no-dev --ignore-platform-reqs" # Run command as www-data
else
    su - www-data -s /bin/bash -c  "cd /var/www/html; php $COMPOSER --no-interaction install --ignore-platform-reqs" # Run command as www-data
fi

su - www-data -s /bin/bash -c  "php artisan env:write"

# All files in html should be owned by www-data
echo "Setting ownership of /var/www/html/* to www-data:www-data"


su - www-data -s /bin/bash -c  "echo $DEPLOYMENT_ID > /var/www/html/deployment"

echo "Done."