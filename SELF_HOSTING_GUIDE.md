
# Self-Hosting Guide for School Visitor Management System

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- A domain name (for production)
- Email service (Gmail, SendGrid, or similar)

## Installation Steps

### 1. Database Setup

First, install and configure PostgreSQL:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE school_vms;
CREATE USER vms_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE school_vms TO vms_user;
\q
```

### 2. Run Database Schema

```bash
# Clone the repository
git clone <your-repo-url>
cd school-vms

# Run the database schema
psql -h localhost -U vms_user -d school_vms -f database/schema.sql
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=school_vms
POSTGRES_USER=vms_user
POSTGRES_PASSWORD=your_secure_password

# Application Configuration
PORT=3000
NODE_ENV=production

# Email Configuration (Choose one)
# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# System Configuration
ADMIN_EMAIL=admin@yourschool.com
SCHOOL_NAME=Your School Name
SCHOOL_ADDRESS=Your School Address
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Build and Start

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Email Configuration Options

### Option 1: Gmail SMTP
1. Enable 2-factor authentication on Gmail
2. Generate an App Password in Gmail settings
3. Use the app password in SMTP_PASS

### Option 2: SendGrid
1. Sign up at sendgrid.com
2. Create API key with Mail Send permissions
3. Add API key to SENDGRID_API_KEY

### Option 3: Custom SMTP
Configure any SMTP server:
- SMTP_HOST: Your SMTP server
- SMTP_PORT: Usually 587 or 465
- SMTP_USER: Your username
- SMTP_PASS: Your password

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "school-vms" -- start
pm2 save
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Recommendations

1. **Change Default Credentials**: Update admin password immediately
2. **Use HTTPS**: Install SSL certificate (Let's Encrypt recommended)
3. **Firewall**: Configure firewall to only allow necessary ports
4. **Database Security**: Use strong passwords and limit database access
5. **Regular Backups**: Set up automated database backups
6. **Updates**: Keep system and dependencies updated

## Backup and Restore

### Database Backup
```bash
# Create backup
pg_dump -h localhost -U vms_user school_vms > backup_$(date +%Y%m%d).sql

# Restore backup
psql -h localhost -U vms_user -d school_vms < backup_20240101.sql
```

### Automated Backup Script
```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U vms_user school_vms > "$BACKUP_DIR/school_vms_$DATE.sql"
# Keep only last 30 days of backups
find $BACKUP_DIR -name "school_vms_*.sql" -mtime +30 -delete
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify credentials in .env file
   - Check firewall settings

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check spam folder
   - Review email service logs

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:3000 | xargs kill`

### Logs
- Application logs: Check console output or PM2 logs
- Database logs: Usually in `/var/log/postgresql/`
- Nginx logs: `/var/log/nginx/`

## Support

For technical support:
1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure database schema is up to date
4. Check network connectivity and firewall settings
