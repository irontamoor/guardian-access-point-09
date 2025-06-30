
# Attendance Management System Guide

## Overview
The Attendance Management System tracks the presence of students, staff, visitors, and parent pickup/drop-off activities. All records are stored in a unified `attendance_records` table in the database.

## Key Features

### Unified Data Storage
- All attendance data (students, staff, visitors, parent pickups) is stored in the `attendance_records` table
- Records include both system user data and visitor information
- Parent pickup/drop-off records are automatically created when using the Parent Pickup form

### User Roles and Permissions

#### Admin
- Full access to all attendance management features
- Can edit any attendance record
- Can perform mass edits on multiple records
- Access to debug information and filters

#### Staff
- Can edit attendance records
- Can perform mass edits
- Limited administrative functions

#### Reader
- **View-only access** to attendance records
- **Special permission**: Can edit and complete parent pickup records only
- Cannot perform mass edits or access administrative features
- Has access to a "Complete" button for pickup records

#### Student/Parent/Visitor
- No direct access to attendance management

### Parent Pickup & Drop-off System

#### How It Works
1. Use the Parent Pickup form to record student pickups and drop-offs
2. Records are automatically saved to the `attendance_records` table
3. Each record includes:
   - Student name (stored in first_name/last_name fields)
   - Parent name (stored in host_name field)
   - Pickup type (Early Pickup, Medical, etc.)
   - Status: "out" for pickups, "in" for drop-offs
   - Notes with parent and type information
   - Organization: "Parent Pickup/Dropoff"

#### Reader Role Functionality
- Readers can view all pickup records
- Special "Complete" button appears for incomplete pickup records
- Completing a pickup adds "[COMPLETED]" to the notes and changes status to "in"
- Only pickup records can be edited by readers

### Data Structure

#### Attendance Records Table
The system uses a unified table structure:

```sql
attendance_records:
- id (UUID, primary key)
- user_id (UUID, required)
- status ('in' | 'out')
- check_in_time (timestamp, nullable)
- check_out_time (timestamp, nullable)
- notes (text, nullable)
- first_name (text, nullable) - Used for all record types
- last_name (text, nullable) - Used for all record types
- organization (text, nullable) - Company/school for visitors, "Parent Pickup/Dropoff" for pickups
- visit_purpose (text, nullable) - Purpose of visit or "Student pickup/dropoff"
- phone_number (text, nullable) - Contact information
- host_name (text, nullable) - Who they're visiting or parent name for pickups
- purpose (text, nullable) - Additional purpose information
- company (text, nullable) - Legacy field for visitor company
- created_at (timestamp)
- created_by (UUID, nullable)
```

### Sign-in Options Configuration

#### JSON-Based Configuration
Options for student reasons, staff reasons, pickup types, and visitor purposes are now managed through JSON files:

- **Location**: `src/config/signInOptions.json`
- **Management**: Admin Option Management interface
- **Storage**: Changes saved to localStorage
- **Categories**:
  - `sign_in` - Student/staff sign-in reasons
  - `pickup_type` - Parent pickup types
  - `visit_type` - Visitor purposes

#### Default Options Available
- **Student reasons**: Late, Excused, Early Leave, Medical Appointment, Sick
- **Staff reasons**: Meeting, Offsite, Sick Leave, In-Person, Training
- **Pickup types**: Early Pickup, Medical Pickup, Bus, Car, Walk, Emergency
- **Visitor types**: Meeting, Delivery, Interview, Maintenance, Parent Conference, Event

### Troubleshooting

#### Records Not Appearing
1. Check that forms are properly submitting to `attendance_records` table
2. Verify that the correct status ('in'/'out') is being set
3. Ensure required fields (user_id, status) are populated
4. Check for JavaScript errors in browser console

#### Reader Permissions
1. Readers can only edit records where `organization = 'Parent Pickup/Dropoff'`
2. Complete button only shows for records without "[COMPLETED]" in notes
3. Completing a pickup changes status to 'in' and adds completion marker

#### Data Migration
- Legacy visitor records have been migrated to attendance_records
- System user data is merged with attendance records where applicable
- Parent pickup records use generated UUIDs for user_id

### Best Practices

#### For Administrators
1. Regularly review attendance records for accuracy
2. Use mass edit features for bulk corrections
3. Monitor debug information for data quality issues
4. Keep sign-in options updated and relevant

#### For Readers
1. Focus on completing parent pickup records promptly
2. Use the Complete button only when pickup is physically verified
3. Check notes for special instructions or requirements

#### For Data Integrity
1. Always fill required fields when creating records
2. Use consistent naming conventions
3. Include relevant notes for context
4. Verify parent pickup records are properly categorized

## Technical Implementation

### Database Schema
- Single `attendance_records` table handles all record types
- Flexible schema accommodates different user types
- Indexes on commonly queried fields (status, created_at, user_id)

### Frontend Components
- Unified AttendanceTable component with role-based permissions
- Separate forms for different record types (student, staff, visitor, pickup)
- Real-time updates and validation

### Security Considerations
- Role-based access control enforced at component level
- Readers limited to pickup record modifications only
- All database operations logged and auditable
