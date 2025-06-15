
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, Clock } from 'lucide-react';

interface AdminMetricsProps {
  students: Array<{ status?: string; check_in_time?: string }>;
  staff: Array<{ status?: string; check_in_time?: string }>;
}

export function AdminMetrics({ students, staff }: AdminMetricsProps) {
  const totalStudents = students.length;
  const totalStaff = staff.length;
  
  // Calculate present today (those with status 'in' or recent check_in_time)
  const today = new Date().toISOString().split('T')[0];
  const presentToday = [
    ...students.filter(s => s.status === 'in' || (s.check_in_time && s.check_in_time.startsWith(today))),
    ...staff.filter(s => s.status === 'in' || (s.check_in_time && s.check_in_time.startsWith(today)))
  ].length;
  
  const totalAttendanceRecords = totalStudents + totalStaff;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <CardDescription>Active student accounts</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStaff}</div>
          <CardDescription>Active staff accounts</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{presentToday}</div>
          <CardDescription>Currently signed in</CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Records</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAttendanceRecords}</div>
          <CardDescription>Attendance entries</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
