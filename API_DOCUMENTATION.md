
# VMS API Documentation

## Overview

The School Visitor Management System provides a comprehensive API for managing users, attendance records, visitors, and system settings. This API uses direct Supabase client integration for database operations.

## Authentication

The system uses session-based authentication. Admin users must authenticate before accessing protected endpoints.

```typescript
// Example authentication check
const { data: adminUser } = await supabase
  .from('system_users')
  .select('*')
  .eq('admin_id', adminId)
  .eq('role', 'admin')
  .single();
```

## API Classes and Methods

### VMSApi.Users

#### `getUsers(role?: string)`
Retrieves all users or users filtered by role.

**Parameters:**
- `role` (optional): Filter by user role ('admin', 'staff', 'student', 'parent', 'visitor')

**Returns:** Array of user objects

**Example:**
```typescript
// Get all users
const allUsers = await VMSApi.getUsers();

// Get only students
const students = await VMSApi.getUsers('student');
```

#### `createUser(userData)`
Creates a new user in the system.

**Parameters:**
- `userData`: User object containing:
  ```typescript
  {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    role: 'admin' | 'staff' | 'student' | 'parent' | 'visitor';
    status: 'active' | 'inactive' | 'suspended';
    user_code?: string;
  }
  ```

**Returns:** Created user object

**Example:**
```typescript
const newStudent = await VMSApi.createUser({
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@email.com",
  role: "student",
  status: "active",
  user_code: "STU001"
});
```

#### `updateUser(id, userData)`
Updates an existing user.

**Parameters:**
- `id`: User UUID
- `userData`: Partial user object with fields to update

**Returns:** Updated user object

#### `deleteUser(id)`
Deletes a user from the system.

**Parameters:**
- `id`: User UUID

### VMSApi.Attendance

#### `getAttendanceRecords(date?)`
Retrieves attendance records, optionally filtered by date.

**Parameters:**
- `date` (optional): Date string (YYYY-MM-DD)

**Returns:** Array of attendance records with user information

**Example:**
```typescript
// Get all attendance records
const allRecords = await VMSApi.getAttendanceRecords();

// Get records for specific date
const todayRecords = await VMSApi.getAttendanceRecords('2024-01-15');
```

#### `createAttendanceRecord(attendanceData)`
Creates a new attendance record.

**Parameters:**
- `attendanceData`: Attendance object:
  ```typescript
  {
    user_id: string;
    status: 'in' | 'out';
    check_in_time?: string;
    check_out_time?: string;
    notes?: string;
    host_name?: string;
    company?: string;
    purpose?: string;
  }
  ```

**Returns:** Created attendance record

**Example:**
```typescript
const checkIn = await VMSApi.createAttendanceRecord({
  user_id: "user-uuid",
  status: "in",
  check_in_time: new Date().toISOString(),
  notes: "Regular check-in"
});
```

#### `updateAttendanceRecord(id, attendanceData)`
Updates an existing attendance record.

**Parameters:**
- `id`: Attendance record UUID
- `attendanceData`: Partial attendance object

**Returns:** Updated attendance record

### VMSApi.Visitors

#### `getVisitors()`
Retrieves all visitor records.

**Returns:** Array of visitor objects

#### `createVisitor(visitorData)`
Creates a new visitor registration.

**Parameters:**
- `visitorData`: Visitor object:
  ```typescript
  {
    first_name: string;
    last_name: string;
    organization?: string;
    visit_purpose: string;
    host_name?: string;
    phone_number?: string;
    notes?: string;
  }
  ```

**Returns:** Created visitor object

**Example:**
```typescript
const visitor = await VMSApi.createVisitor({
  first_name: "Jane",
  last_name: "Smith",
  organization: "ABC Company",
  visit_purpose: "Meeting with principal",
  host_name: "Dr. Johnson",
  phone_number: "555-1234"
});
```

### VMSApi.Settings

#### `getSettings()`
Retrieves all system settings.

**Returns:** Array of setting objects

#### `updateSetting(key, value)`
Updates or creates a system setting.

**Parameters:**
- `key`: Setting key string
- `value`: Setting value (any type, stored as JSON)

**Returns:** Updated setting object

**Example:**
```typescript
await VMSApi.updateSetting('school_name', 'My School');
await VMSApi.updateSetting('email_notifications', true);
```

## Advanced Usage

### Attendance Management Integration

The system provides hooks for attendance management:

```typescript
import { useAttendanceManagement } from '@/hooks/useAttendanceManagement';

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

  // Component logic here
}
```

### Search and Filtering

Use the attendance search functionality:

```typescript
import { useAttendanceSearch } from '@/hooks/useAttendanceSearch';
import { AttendanceSearch } from '@/components/AttendanceSearch';

function SearchableAttendanceTable() {
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

### Email Notifications

The system includes email service integration:

```typescript
import { emailService } from '@/utils/emailService';

// Send student check-in notification
await emailService.sendStudentCheckInNotification(
  "John Doe",
  "parent@email.com",
  "08:30 AM"
);

// Send daily report
await emailService.sendDailyReport("admin@school.com", {
  studentsPresent: 245,
  staffPresent: 18,
  visitors: 5
});
```

## Error Handling

All API methods throw errors that should be handled appropriately:

```typescript
try {
  const users = await VMSApi.getUsers();
} catch (error) {
  console.error('Failed to fetch users:', error);
  // Handle error appropriately
}
```

## Rate Limiting and Best Practices

1. **Batch Operations**: For multiple records, consider batch operations when possible
2. **Error Handling**: Always implement proper error handling
3. **Loading States**: Use loading states in UI components
4. **Data Validation**: Validate data before sending to API
5. **Caching**: Consider implementing client-side caching for frequently accessed data

## Database Schema Reference

The system uses the following main tables:
- `system_users`: User accounts and profiles
- `attendance_records`: Check-in/check-out records
- `visitors`: Visitor registrations
- `system_settings`: Configuration settings
- `sign_in_options`: Customizable sign-in reasons

For detailed schema information, refer to `database/schema.sql`.

## Integration Examples

### Custom Dashboard Integration

```typescript
import { VMSApi } from '@/api/routes';

async function loadDashboardData() {
  const [users, attendance, visitors] = await Promise.all([
    VMSApi.getUsers(),
    VMSApi.getAttendanceRecords(),
    VMSApi.getVisitors()
  ]);

  return {
    totalUsers: users.length,
    todayAttendance: attendance.filter(r => 
      new Date(r.created_at).toDateString() === new Date().toDateString()
    ),
    activeVisitors: visitors.filter(v => 
      new Date(v.created_at).toDateString() === new Date().toDateString()
    )
  };
}
```

### Real-time Updates (Future Enhancement)

The system is designed to support real-time updates through Supabase subscriptions:

```typescript
// Example for future real-time implementation
const subscription = supabase
  .from('attendance_records')
  .on('INSERT', payload => {
    // Handle new attendance record
    console.log('New attendance record:', payload.new);
  })
  .subscribe();
```
