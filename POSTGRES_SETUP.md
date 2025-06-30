
# PostgreSQL Setup Guide

## Prerequisites
1. Install PostgreSQL on your system
2. Create a database named `school_vms`
3. Set up environment variables

## Environment Variables
Create a `.env` file in your project root with:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=school_vms
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
NODE_ENV=development
```

## Database Setup
1. Connect to your PostgreSQL instance
2. Create the database:
   ```sql
   CREATE DATABASE school_vms;
   ```

3. Run all migration files in order from the `supabase/migrations/` directory
   - Start with the earliest timestamp files
   - Execute each SQL file in your PostgreSQL database

## Required Tables
The system needs these main tables:
- `system_users` - Store user information
- `attendance_records` - Track attendance
- `visitors` - Store visitor information
- `system_settings` - Application settings
- `sign_in_options` - Configurable sign-in options
- `user_role_assignments` - User role management

## Testing Connection
After setup, the application will attempt to connect using the environment variables.
Check the console for any connection errors.

## Production Deployment
For production:
1. Use a secure PostgreSQL instance
2. Enable SSL connections
3. Use strong passwords
4. Configure proper firewall rules
5. Set up regular backups
