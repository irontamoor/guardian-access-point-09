
# API Documentation - Visitor Management System

## Overview
This document describes the API endpoints and data structures for the Visitor Management System, including the unified attendance tracking system.

## Database Schema

### Core Tables

#### attendance_records
Unified table storing all attendance data including students, staff, visitors, and parent pickups.

```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  status attendance_status NOT NULL, -- 'in' | 'out'
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  first_name TEXT, -- Person's first name (all record types)
  last_name TEXT,  -- Person's last name (all record types)
  organization TEXT, -- Company/school or "Parent Pickup/Dropoff"
  visit_purpose TEXT, -- Purpose of visit or pickup type
  phone_number TEXT, -- Contact information
  host_name TEXT, -- Who they're visiting or parent name
  purpose TEXT, -- Additional purpose information
  company TEXT, -- Legacy field for visitor company
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID
);
```

#### system_users
Stores information for staff, students, and administrators.

```sql
CREATE TABLE system_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  user_code TEXT, -- Student ID or employee code
  admin_id TEXT, -- Administrator identifier
  role user_role DEFAULT 'student', -- 'admin' | 'staff' | 'student' | 'parent' | 'visitor' | 'reader'
  status user_status DEFAULT 'active', -- 'active' | 'inactive' | 'suspended'
  password TEXT, -- Hashed password for admin users
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### attendance_edits
Tracks all modifications to attendance records for audit purposes.

```sql
CREATE TABLE attendance_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_record_id UUID NOT NULL REFERENCES attendance_records(id),
  admin_user_id UUID NOT NULL,
  old_status attendance_status,
  new_status attendance_status NOT NULL,
  edit_reason TEXT NOT NULL,
  edited_at TIMESTAMPTZ DEFAULT now()
);
```

## API Endpoints

### Attendance Records

#### Create Attendance Record
```typescript
// Student/Staff Sign-in
POST /attendance_records
{
  user_id: string,
  status: 'in' | 'out',
  check_in_time?: string,
  check_out_time?: string,
  notes?: string
}

// Visitor Sign-in
POST /attendance_records
{
  user_id: string, // Generated UUID for visitors
  status: 'in' | 'out',
  first_name: string,
  last_name: string,
  organization?: string,
  visit_purpose?: string,
  phone_number?: string,
  host_name?: string,
  check_in_time?: string,
  check_out_time?: string,
  notes?: string
}

// Parent Pickup/Drop-off
POST /attendance_records
{
  user_id: string, // Generated UUID
  status: 'out' | 'in', // 'out' for pickup, 'in' for drop-off
  first_name: string, // Student's first name
  last_name: string,  // Student's last name
  organization: 'Parent Pickup/Dropoff',
  visit_purpose: 'Student pickup' | 'Student dropoff',
  host_name: string, // Parent's name
  notes: string, // Includes parent info and pickup type
  check_in_time?: string,
  check_out_time?: string
}
```

#### Get Attendance Records
```typescript
GET /attendance_records
Query Parameters:
- date?: string (YYYY-MM-DD format, 'all' for all dates)
- status?: 'in' | 'out'
- role?: 'admin' | 'staff' | 'student' | 'visitor' | 'reader'

Response: AttendanceRecord[]
```

#### Update Attendance Record
```typescript
PUT /attendance_records/:id
{
  status?: 'in' | 'out',
  check_in_time?: string,
  check_out_time?: string,
  notes?: string,
  edit_reason: string // Required for audit trail
}
```

### System Users

#### Create System User
```typescript
POST /system_users
{
  first_name: string,
  last_name: string,
  email?: string,
  phone?: string,
  user_code?: string,
  role: 'admin' | 'staff' | 'student' | 'parent' | 'reader',
  status?: 'active' | 'inactive' | 'suspended'
}
```

#### Get System Users
```typescript
GET /system_users
Query Parameters:
- role?: 'admin' | 'staff' | 'student' | 'parent' | 'reader'
- status?: 'active' | 'inactive' | 'suspended'

Response: SystemUser[]
```

## Data Types

### TypeScript Interfaces

```typescript
interface AttendanceRecord {
  id: string;
  user_id: string;
  status: 'in' | 'out';
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  notes?: string;
  // Merged fields for all record types
  first_name?: string;
  last_name?: string;
  organization?: string;
  visit_purpose?: string;
  phone_number?: string;
  host_name?: string;
  purpose?: string;
  company?: string; // Legacy field
  created_by?: string;
  // Optional system user data
  system_users?: {
    id: string;
    first_name: string;
    last_name: string;
    user_code?: string;
    role: UserRole;
  } | null;
}

interface SystemUser {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  user_code?: string;
  admin_id?: string;
  role: 'admin' | 'staff' | 'student' | 'parent' | 'visitor' | 'reader';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface AttendanceEdit {
  id: string;
  attendance_record_id: string;
  admin_user_id: string;
  old_status?: 'in' | 'out';
  new_status: 'in' | 'out';
  edit_reason: string;
  edited_at: string;
}
```

## Configuration Management

### Sign-in Options
Options for dropdowns and quick selections are managed through JSON configuration:

```typescript
// Located in: src/config/signInOptions.json
interface SignInOption {
  id: string;
  label: string;
  applies_to: 'student' | 'staff' | 'both' | 'visitor';
  category: 'sign_in' | 'pickup_type' | 'visit_type';
  is_active: boolean;
}
```

### User Roles
Role definitions and permissions:

```typescript
// Located in: src/config/userRoles.json
interface UserRole {
  label: string;
  permissions: string[];
}

// Available roles:
// - admin: Full system access
// - staff: Can manage attendance, limited admin functions
// - student: Basic sign-in only
// - parent: Parent pickup functionality
// - visitor: Visitor sign-in only
// - reader: View attendance, complete pickups only
```

## Role-Based Access Control

### Admin
- Full CRUD access to all records
- Mass edit capabilities
- User management
- System configuration

### Staff
- Edit attendance records
- Mass edit functionality
- Limited user management

### Reader
- Read-only access to attendance records
- Special permission: Edit parent pickup records only
- Can mark pickups as completed
- No mass edit or administrative functions

### Student/Parent/Visitor
- Create their own attendance records only
- No edit or administrative access

## Authentication & Security

### Current Implementation
- No authentication system implemented
- Role-based access control at component level
- Database access through Supabase client-side SDK

### Recommended Enhancements
1. Implement proper authentication system
2. Add Row Level Security (RLS) policies
3. Server-side API endpoints with proper authorization
4. Session management and user verification

## Error Handling

### Common Error Responses
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

// Common errors:
// - 400: Bad Request (missing required fields)
// - 401: Unauthorized (insufficient permissions)
// - 404: Not Found (record doesn't exist)
// - 500: Internal Server Error (database/server issues)
```

## Migration Notes

### From Previous Version
1. Visitor records migrated to unified attendance_records table
2. System settings moved from database to JSON files
3. Sign-in options configuration moved to JSON
4. Enhanced role-based access control implemented

### Data Consistency
- All attendance data now in single table
- Consistent field naming across record types
- Audit trail maintained through attendance_edits table
- Legacy fields preserved for backward compatibility
