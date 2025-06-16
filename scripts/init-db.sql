-- Crea i database
CREATE DATABASE cms_app;
CREATE DATABASE keycloak_db;

-- Crea gli utenti
CREATE USER cms_user WITH ENCRYPTED PASSWORD 'cms_password';
CREATE USER keycloak_user WITH ENCRYPTED PASSWORD 'keycloak_pass';

-- Assegna i permessi
GRANT ALL PRIVILEGES ON DATABASE cms_app TO cms_user;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak_user;