-- Crea i database
CREATE DATABASE cms_app;
CREATE DATABASE keycloak_db;

-- Crea gli utenti di servizio
CREATE USER cms_admin WITH ENCRYPTED PASSWORD 'cms123admin';
CREATE USER keycloak_admin WITH ENCRYPTED PASSWORD 'keycloak123admin';

-- Crea utente personale Andrea
CREATE USER andreadnf WITH ENCRYPTED PASSWORD 'andrea123';

-- Assegna i permessi agli utenti di servizio
GRANT ALL PRIVILEGES ON DATABASE cms_app TO cms_admin;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO keycloak_admin;

-- Assegna i permessi ad Andrea (accesso a tutto per sviluppo)
GRANT ALL PRIVILEGES ON DATABASE cms_app TO andreadnf;
GRANT ALL PRIVILEGES ON DATABASE keycloak_db TO andreadnf;

-- Per sicurezza, concedi anche connessione
GRANT CONNECT ON DATABASE cms_app TO cms_admin, andreadnf;
GRANT CONNECT ON DATABASE keycloak_db TO keycloak_admin, andreadnf;

-- Opzionale: rendi Andrea un superuser per maggiore flessibilità in sviluppo
ALTER USER andreadnf CREATEDB;
ALTER USER andreadnf SUPERUSER;