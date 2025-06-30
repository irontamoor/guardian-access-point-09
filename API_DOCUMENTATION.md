
# VMS API Documentation

## Overview

The School Visitor Management System provides a comprehensive API for managing users, attendance records, visitors, and system settings. This API uses direct Supabase client integration for database operations.

**Live Demo:** https://lovable.dev/projects/ff962135-529c-4786-89d0-86ee28962a9c

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

## Database Schema

### Core Tables

#### system_users
- `id` (uuid, primary key)
- `first_name` (text, required)
- `last_name` (text, required)
- `email` (text, optional)
- `phone` (text, optional)
- `role` (enum: 'admin', 'staff', 'student', 'parent', 'visitor')
- `status` (enum: 'active', 'inactive', 'suspended')
- `user_code` (text, optional)
- `admin_id` (text, optional)
- `password` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### attendance_records
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to system_users or visitors)
- `status` (enum: 'in', 'out')
- `check_in_time` (timestamp, optional)
- `check_out_time` (timestamp, optional)
- `notes` (text, optional)
- `host_name` (text, optional)
- `company` (text, optional)
- `purpose` (text, optional)
- `created_by` (uuid, optional)
- `created_at` (timestamp)

#### visitors
- `id` (uuid, primary key)
- `first_name` (text, required)
- `last_name` (text, required)
- `organization` (text, optional)
- `visit_purpose` (text, required)
- `host_name` (text, optional)
- `phone_number` (text, optional)
- `notes` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## API Methods

### Direct Supabase Operations

#### Users API

```typescript
// Get all users or filter by role
const { data: users, error } = await supabase
  .from('system_users')
  .select('*')
  .eq('role', 'student'); // optional filter

// Create new user
const { data: newUser, error } = await supabase
  .from('system_users')
  .insert({
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@email.com",
    role: "student",
    status: "active",
    user_code: "STU001"
  })
  .select()
  .single();

// Update user
const { data: updatedUser, error } = await supabase
  .from('system_users')
  .update({ status: 'inactive' })
  .eq('id', userId)
  .select()
  .single();

// Delete user
const { error } = await supabase
  .from('system_users')
  .delete()
  .eq('id', userId);
```

#### Attendance API

```typescript
// Get attendance records with user information
const { data: attendance, error } = await supabase
  .from('attendance_records')
  .select(`
    *,
    system_users(first_name, last_name, role, user_code)
  `)
  .order('created_at', { ascending: false });

// Get attendance for specific date
const { data: todayAttendance, error } = await supabase
  .from('attendance_records')
  .select(`
    *,
    system_users(first_name, last_name, role, user_code)
  `)
  .gte('created_at', '2024-01-15T00:00:00Z')
  .lt('created_at', '2024-01-16T00:00:00Z');

// Create attendance record
const { data: newRecord, error } = await supabase
  .from('attendance_records')
  .insert({
    user_id: "user-uuid",
    status: "in",
    check_in_time: new Date().toISOString(),
    notes: "Regular check-in"
  })
  .select()
  .single();

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

#### Visitors API

```typescript
// Get all visitors
const { data: visitors, error } = await supabase
  .from('visitors')
  .select('*')
  .order('created_at', { ascending: false });

// Register new visitor
const { data: newVisitor, error } = await supabase
  .from('visitors')
  .insert({
    first_name: "Jane",
    last_name: "Smith",
    organization: "ABC Company",
    visit_purpose: "Meeting with principal",
    host_name: "Dr. Johnson",
    phone_number: "555-1234"
  })
  .select()
  .single();
```

#### Settings API

```typescript
// Get system settings
const { data: settings, error } = await supabase
  .from('system_settings')
  .select('*');

// Update or create setting
const { data: setting, error } = await supabase
  .from('system_settings')
  .upsert({
    setting_key: 'school_name',
    setting_value: { value: 'My School' },
    description: 'School name for display'
  })
  .select()
  .single();
```

## Advanced Usage

### Attendance Search and Filtering

The system provides comprehensive search capabilities:

```typescript
import { useAttendanceSearch } from '@/hooks/useAttendanceSearch';
import { AttendanceSearch } from '@/components/AttendanceSearch';

function AttendanceManagement() {
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

### Mass Operations

```typescript
// Mass update attendance records
const { error } = await supabase
  .from('attendance_records')
  .update({ 
    status: 'out',
    check_out_time: new Date().toISOString()
  })
  .in('id', selectedRecordIds);
```

### Email Notifications

```typescript
import { emailService } from '@/utils/emailService';

// Send student check-in notification
await emailService.sendStudentCheckInNotification(
  "John Doe",
  "parent@email.com",
  "08:30 AM"
);

// Send staff attendance alert
await emailService.sendStaffAttendanceAlert(
  "Jane Smith",
  "admin@school.com",
  "in",
  "07:45 AM"
);

// Send visitor notification
await emailService.sendVisitorNotification(
  "Bob Johnson",
  "Dr. Williams",
  "host@school.com",
  "10:15 AM"
);

// Send daily report
await emailService.sendDailyReport("admin@school.com", {
  studentsPresent: 245,
  staffPresent: 18,
  visitors: 5
});
```

## Error Handling

Always implement proper error handling:

```typescript
try {
  const { data, error } = await supabase
    .from('system_users')
    .select('*');
    
  if (error) throw error;
  
  // Process data
} catch (error) {
  console.error('Database operation failed:', error);
  // Handle error appropriately
}
```

## Real-time Subscriptions

Listen for real-time updates:

```typescript
const subscription = supabase
  .from('attendance_records')
  .on('INSERT', payload => {
    console.log('New attendance record:', payload.new);
    // Update UI
  })
  .on('UPDATE', payload => {
    console.log('Updated attendance record:', payload.new);
    // Update UI
  })
  .subscribe();

// Clean up subscription
return () => subscription.unsubscribe();
```

## Environment Variables

Required environment variables for full functionality:

```bash
# Database (handled by Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service (choose one)
SENDGRID_API_KEY=your_sendgrid_key
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourschool.com
SMTP_SECURE=false

# Optional
SCHOOL_NAME=Your School Name
```

## Performance Optimization

### Efficient Queries

```typescript
// Use select() to fetch only needed columns
const { data } = await supabase
  .from('attendance_records')
  .select('id, status, created_at, system_users(first_name, last_name)')
  .limit(100);

// Use indexes for common queries
const { data } = await supabase
  .from('attendance_records')
  .select('*')
  .eq('status', 'in')
  .gte('created_at', startDate)
  .order('created_at', { ascending: false });
```

### Pagination

```typescript
const { data, error } = await supabase
  .from('attendance_records')
  .select('*')
  .range(0, 49) // First 50 records
  .order('created_at', { ascending: false });
```

## Security Best Practices

1. **Row Level Security (RLS)**: Enable RLS policies on sensitive tables
2. **Input Validation**: Always validate user input before database operations
3. **Authentication**: Verify user permissions before allowing operations
4. **Audit Trail**: Log important changes for accountability

## Integration Examples

### React Hook Integration

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

### Custom Dashboard

```typescript
async function loadDashboardData() {
  const [users, attendance, visitors] = await Promise.all([
    supabase.from('system_users').select('*'),
    supabase.from('attendance_records').select('*'),
    supabase.from('visitors').select('*')
  ]);

  return {
    totalUsers: users.data?.length || 0,
    todayAttendance: attendance.data?.filter(r => 
      new Date(r.created_at).toDateString() === new Date().toDateString()
    ) || [],
    activeVisitors: visitors.data?.filter(v => 
      new Date(v.created_at).toDateString() === new Date().toDateString()
    ) || []
  };
}
```

This comprehensive API reference provides everything needed to integrate with and extend the School Visitor Management System.
