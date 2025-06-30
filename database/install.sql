
-- Installation script for School VMS
-- Run this script on a fresh PostgreSQL database

\echo 'Creating School Visitor Management System database schema...'

-- Connect to the database (adjust database name as needed)
\c school_vms;

-- Run the main schema file
\i schema.sql;

\echo 'Schema installation complete!'
\echo 'Default admin login: admin_id="admin", password="admin123"'
\echo 'Remember to change the default password in production!'
