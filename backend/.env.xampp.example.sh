# Backend ENV for running with XAMPP MySQL/MariaDB (phpMyAdmin)
# Copy this file to .env.xampp.sh, then `source ./.env.xampp.sh` before running.
#
# NOTE: XAMPP often uses MariaDB 10.x but reports version like "5.5.5-10.x-MariaDB".
# Flyway may detect it as "MySQL 5.5" and refuse to run. Because you import the DB
# manually via phpMyAdmin, we disable Flyway here.
export SPRING_FLYWAY_ENABLED=false

# Change port if needed (most common: 3306, sometimes: 3307)
export DB_URL="jdbc:mysql://127.0.0.1:3307/db_taskmate?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export DB_USERNAME="root"
# leave empty for default XAMPP root (no password)
export DB_PASSWORD=

# JWT secret (min 32 chars recommended)
export JWT_SECRET="change-me-please-change-me-please-change-me-please"
