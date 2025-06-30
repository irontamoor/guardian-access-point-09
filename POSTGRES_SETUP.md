
# PostgreSQL Setup Guide - Fresh Installation

## Prerequisites
1. Install PostgreSQL on your system
2. Ensure PostgreSQL service is running
3. Have database administrator access

## Quick Installation

### Step 1: Create Database
Connect to PostgreSQL as administrator and create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE school_vms;

# Exit psql
\q
```

### Step 2: Run Installation Script
```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the installation script
psql -U postgres -d school_vms -f database/schema.sql
```

### Step 3: Set Environment Variables
Create a `.env` file in your project root:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=school_vms
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
NODE_ENV=development

# Application Configuration
PORT=3000
```

### Step 4: Test Connection
Start your application and verify the database connection works.

## Default Login Credentials
- **Admin ID**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password in production!

## Database Schema Overview

### Main Tables:
- `system_users` - All users (admin, staff, students, visitors)
- `attendance_records` - Check-in/out records
- `visitors` - Visitor registration data
- `system_settings` - Application configuration
- `sign_in_options` - Configurable dropdown options
- `user_role_assignments` - Role-based access control
- `attendance_edits` - Audit trail for attendance changes

### Default Data:
- Admin user with login credentials
- Basic system settings
- Default sign-in options (Meeting, Delivery, Interview, etc.)

## Manual Installation (Alternative)

If you prefer to run the SQL manually:

1. Create the database: `CREATE DATABASE school_vms;`
2. Connect to the database: `\c school_vms;`
3. Copy and paste the contents of `database/schema.sql`
4. Verify tables were created: `\dt`

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check if database exists: `psql -U postgres -l`
- Verify user permissions
- Check firewall settings if connecting remotely

### Permission Issues
- Ensure your PostgreSQL user has CREATE privileges
- For production, create a dedicated user with limited privileges

### Performance Optimization
- The schema includes optimized indexes
- Consider adjusting PostgreSQL configuration for your hardware
- Regular VACUUM and ANALYZE operations recommended

## Production Deployment

For production environments:
1. Use strong passwords
2. Create dedicated database user with minimal privileges
3. Enable SSL connections
4. Configure proper firewall rules
5. Set up regular backups
6. Monitor database performance

## Backup and Restore

### Create Backup
```bash
pg_dump -U postgres school_vms > school_vms_backup.sql
```

### Restore Backup
```bash
psql -U postgres -d school_vms < school_vms_backup.sql
```
