
# Attendance Management Guide

## Overview

The Attendance Management system allows administrators to view, search, edit, and manage all attendance records in the school visitor management system. This includes students, staff, and visitors.

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
```typescript
// Example of how search works internally
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

#### Mass Edit Use Cases
- Correcting bulk check-in errors
- End-of-day checkout for all staff
- Emergency attendance updates

### 5. Date Filtering

#### Available Date Options
- **Today**: Current date only
- **Yesterday**: Previous day records
- **This Week**: Last 7 days
- **All**: All available records
- **Custom Date**: Specific date selection

#### Implementation Example
```typescript
const fetchAttendanceByDate = async (selectedDate: string) => {
  if (selectedDate === 'all') {
    // Fetch all records
    return await VMSApi.getAttendanceRecords();
  } else {
    // Fetch records for specific date
    return await VMSApi.getAttendanceRecords(selectedDate);
  }
};
```

## API Integration

### Fetching Attendance Records

```typescript
import { VMSApi } from '@/api/routes';

// Get all attendance records
const allRecords = await VMSApi.getAttendanceRecords();

// Get records for specific date
const todayRecords = await VMSApi.getAttendanceRecords('2024-01-15');

// Records include user information
const recordWithUser = {
  id: "record-uuid",
  user_id: "user-uuid",
  status: "in",
  check_in_time: "2024-01-15T08:30:00Z",
  check_out_time: null,
  notes: "Regular check-in",
  system_users: {
    first_name: "John",
    last_name: "Doe",
    role: "student",
    user_code: "STU001"
  }
};
```

### Updating Records

```typescript
// Single record update
await VMSApi.updateAttendanceRecord(recordId, {
  status: "out",
  check_out_time: new Date().toISOString(),
  notes: "Updated by admin"
});

// The system automatically tracks edit history
```

### Using Attendance Hooks

```typescript
import { useAttendanceManagement } from '@/hooks/useAttendanceManagement';

function MyAttendanceComponent() {
  const {
    attendanceRecords,      // Current records
    isLoading,             // Loading state
    fetchError,            // Error state
    selectedIds,           // Selected record IDs
    handleEditAttendance,  // Edit function
    handleToggleSelect,    // Selection function
    fetchAttendanceRecords // Refresh function
  } = useAttendanceManagement();
  
  // Use these in your component
}
```

## Best Practices

### 1. Data Accuracy
- Always provide meaningful edit reasons
- Double-check timestamps when editing
- Verify user information before making changes

### 2. Audit Trail
- All edits are logged with reasons
- Original data is preserved
- Edit history is maintained

### 3. Performance
- Use date filters to limit large datasets
- Search filters help narrow results
- Pagination handles large record sets

### 4. User Experience
- Clear loading states during operations
- Confirmation dialogs for mass operations
- Error handling with user-friendly messages

## Common Operations

### Daily Attendance Review
1. Select "Today" from date filter
2. Review all check-ins/check-outs
3. Look for missing check-outs
4. Use search to find specific individuals

### End-of-Day Checkout
1. Filter by status "In"
2. Select all remaining staff/students
3. Use mass edit to set status to "Out"
4. Add reason like "End of day checkout"

### Attendance Corrections
1. Search for the specific person
2. Click edit on their record
3. Adjust times or status as needed
4. Provide detailed correction reason

### Weekly Attendance Report
1. Set date range for the week
2. Export or review all records
3. Check for patterns or issues
4. Generate summary reports

## Troubleshooting

### Common Issues

1. **Records Not Loading**
   - Check network connection
   - Verify date filters aren't too restrictive
   - Refresh the page

2. **Search Not Working**
   - Clear all filters and try again
   - Check spelling in search terms
   - Use partial names or IDs

3. **Edit Failures**
   - Ensure edit reason is provided
   - Check for validation errors
   - Verify permissions

4. **Mass Edit Issues**
   - Confirm records are selected
   - Check if edit reason is provided
   - Verify operation permissions

### Debug Information

Enable debug mode to see:
- Current filters applied
- Number of records loaded
- Search query details
- API response status

```typescript
// Debug info is available in development
const debugInfo = {
  totalRecords: attendanceRecords.length,
  filteredRecords: filteredRecords.length,
  selectedRecords: selectedIds.size,
  currentFilters: searchFilters,
  isLoading: isLoading
};
```

## Integration with Email Notifications

The system can send email notifications for attendance events:

```typescript
import { emailService } from '@/utils/emailService';

// Notify parents of student check-in
await emailService.sendStudentCheckInNotification(
  studentName,
  parentEmail,
  checkInTime
);

// Alert admins of staff attendance
await emailService.sendStaffAttendanceAlert(
  staffName,
  adminEmail,
  status,
  time
);
```

## Security Considerations

- Only authorized administrators can edit attendance
- All changes are logged for audit purposes
- Edit reasons are required for accountability
- Original timestamps are preserved
- User permissions are checked before operations

This comprehensive attendance management system provides full control over attendance tracking while maintaining data integrity and providing excellent user experience.
