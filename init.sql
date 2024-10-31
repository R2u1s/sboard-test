GRANT ALL PRIVILEGES ON SCHEMA public TO sboard_admin;
-- Создание пользователя, если он не существует
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT
      FROM   pg_catalog.pg_user
      WHERE  usename = 'sboard_admin') THEN

      CREATE USER sboard_admin WITH PASSWORD 'admin123';
   END IF;
END
$do$;

-- Создание базы данных, если она не существует
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT
      FROM   pg_database
      WHERE  datname = 'sboard_budanov_test') THEN

      CREATE DATABASE sboard_budanov_test;
      ALTER DATABASE sboard_budanov_test OWNER TO sboard_admin;
   END IF;
END
$do$;