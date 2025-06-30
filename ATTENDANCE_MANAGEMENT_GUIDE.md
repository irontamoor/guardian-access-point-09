
# Attendance Management Guide

## Overview

The Attendance Management system allows administrators to view, search, edit, and manage all attendance records in the school visitor management system. This includes students, staff, and visitors.

**Live Demo:** https://lovable.dev/projects/ff962135-529c-4786-89d0-86ee28962a9c

## Features

### 1. Viewing Attendance Records

The main attendance table displays:
- **Name**: Person's full name
- **ID**: User ID or code
- **Role**: User type (student, staff, admin, visitor)
- **Status**: Current status (In/Out)
- **Check In/Out Times**: Timestamps for attendance
- **Notes**: Any additional information
- **Actions**: Edit options

### 2. Search and Filtering

#### Quick Search
Use the search bar to find records by:
- Person's name
- User ID or code
- Notes content

#### Advanced Filters
- **Status Filter**: Show only "In" or "Out" records
- **Role Filter**: Filter by user type (Student, Staff, Admin, Visitor)
- **Date Range**: Filter records between specific dates

#### Using Search Filters
The search component now properly handles empty values and provides clear filter options:

```typescript
// Search filters interface
interface SearchFilters {
  query?: string;
  status?: 'in' | 'out';
  role?: 'admin' | 'staff' | 'student' | 'visitor';
  dateFrom?: string;
  dateTo?: string;
}

// Example usage
const filteredRecords = records.filter(record => {
  // Name search
  if (query) {
    const name = `${record.first_name} ${record.last_name}`.toLowerCase();
    if (!name.includes(query.toLowerCase())) return false;
  }
  
  // Status filter
  if (statusFilter && record.status !== statusFilter) return false;
  
  // Date range filter
  if (dateFrom && record.created_at < dateFrom) return false;
  
  return true;
});
```

### 3. Individual Record Editing

#### How to Edit a Record
1. Click the "Edit" button on any attendance row
2. Modify the following fields:
   - **Status**: Change between "In" and "Out"
   - **Check-in Time**: Adjust arrival time
   - **Check-out Time**: Adjust departure time
   - **Notes**: Add or modify notes
3. **Provide Edit Reason**: Required for audit trail
4. Click "Save Changes"

#### Edit Modal Fields
```typescript
interface EditableFields {
  status: 'in' | 'out';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  edit_reason: string; // Required for all edits
}
```

### 4. Mass Editing

#### Selecting Records
- **Individual Selection**: Click checkbox next to each record
- **Select All**: Use header checkbox to select all visible records
- **Clear Selection**: Use the clear button or uncheck header

#### Mass Edit Operations
1. Select multiple records using checkboxes
2. Click "Mass Edit" button
3. Choose new status (In/Out)
4. Provide reason for mass edit
5. Confirm changes

### 5. Date Filtering

#### Available Date Options
- **Today**: Current date only
- **Yesterday**: Previous day records
- **This Week**: Last 7 days
- **All**: All available records
- **Custom Date**: Specific date selection

### 6. Email Notifications

The system now includes comprehensive email notifications:

#### Student Check-in Notifications
```typescript
await emailService.sendStudentCheckInNotification(
  "John Doe",
  "parent@email.com",
  "08:30 AM"
);
```

#### Staff Attendance Alerts
```typescript
await emailService.sendStaffAttendanceAlert(
  "Jane Smith",
  "admin@school.com",
  "in",
  "07:45 AM"
);
```

#### Visitor Notifications
```typescript
await emailService.sendVisitorNotification(
  "Bob Johnson",
  "Dr. Williams",
  "host@school.com",
  "10:15 AM"
);
```

#### Daily Reports
```typescript
await emailService.sendDailyReport("admin@school.com", {
  studentsPresent: 245,
  staffPresent: 18,
  visitors: 5
});
```

## API Integration

### Using Attendance Hooks

```typescript
import { useAttendanceManagement } from '@/hooks/useAttendanceManagement';
import { useAttendanceSearch } from '@/hooks/useAttendanceSearch';

function AttendanceComponent() {
  const {
    attendanceRecords,
    isLoading,
    fetchAttendanceRecords,
    handleEditAttendance,
    selectedIds,
    handleToggleSelect,
    handleSelectAll,
  } = useAttendanceManagement();

  const {
    filteredRecords,
    handleSearch,
    handleClearSearch,
    hasActiveFilters
  } = useAttendanceSearch(attendanceRecords);

  return (
    <div>
      <AttendanceSearch 
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />
      {/* Display filteredRecords */}
    </div>
  );
}
```

### Direct Database Operations

```typescript
// Fetch attendance with user information
const { data: attendance, error } = await supabase
  .from('attendance_records')
  .select(`
    *,
    system_users(first_name, last_name, role, user_code)
  `)
  .order('created_at', { ascending: false });

// Update attendance record
const { data: updated, error } = await supabase
  .from('attendance_records')
  .update({
    status: "out",
    check_out_time: new Date().toISOString(),
    notes: "Updated by admin"
  })
  .eq('id', recordId)
  .select()
  .single();
```

## Troubleshooting

### Common Issues

1. **Attendance Tab Goes Blank**
   - This was caused by Select components with empty string values
   - Fixed by using "all" as default value instead of empty string
   - Ensure all SelectItem components have non-empty values

2. **Search Not Working**
   - Clear all filters and try again
   - Check spelling in search terms
   - Use partial names or IDs

3. **Records Not Loading**
   - Check network connection
   - Verify date filters aren't too restrictive
   - Check browser console for errors

4. **Edit Failures**
   - Ensure edit reason is provided
   - Check for validation errors
   - Verify permissions

### Debug Information

Enable debug mode to see:
- Current filters applied
- Number of records loaded
- Search query details
- API response status

## Self-Hosting Setup

For self-hosting with PostgreSQL, see the `SELF_HOSTING_GUIDE.md` file for complete setup instructions including:
- PostgreSQL installation and configuration
- Environment variables setup
- Email service configuration (SMTP/SendGrid)
- Database schema setup
- Security considerations

## Email Service Configuration

### SMTP Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourschool.com
SMTP_SECURE=false
```

### SendGrid Configuration
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Best Practices

1. **Data Accuracy**: Always provide meaningful edit reasons
2. **Audit Trail**: All edits are logged with reasons
3. **Performance**: Use date filters to limit large datasets
4. **User Experience**: Clear loading states and error handling
5. **Security**: Verify user permissions before operations

This comprehensive attendance management system provides full control over attendance tracking while maintaining data integrity and providing excellent user experience.
