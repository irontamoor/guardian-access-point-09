import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentAttendanceTable } from './attendance/StudentAttendanceTable';
import { StaffAttendanceTable } from './attendance/StaffAttendanceTable';
import { VisitorRecordsTable } from './attendance/VisitorRecordsTable';
import { ParentPickupTable } from './attendance/ParentPickupTable';
import { FingerprintApprovals } from './admin/FingerprintApprovals';

interface AttendanceManagementProps {
  userRole?: string;
}

const AttendanceManagement = ({ userRole = 'admin' }: AttendanceManagementProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records Management</CardTitle>
          <CardDescription>
            {userRole === 'reader' 
              ? 'View attendance records and complete pickups.' 
              : 'View and manage all attendance records across different form types.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pickup" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pickup">Parent Pickup/Drop-off</TabsTrigger>
              <TabsTrigger value="fingerprints">Fingerprint Approvals</TabsTrigger>
              <TabsTrigger value="student">Student Attendance</TabsTrigger>
              <TabsTrigger value="staff">Staff Attendance</TabsTrigger>
              <TabsTrigger value="visitor">Visitor Records</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pickup" className="space-y-4">
              <ParentPickupTable userRole={userRole} />
            </TabsContent>
            
            <TabsContent value="fingerprints" className="space-y-4">
              <FingerprintApprovals />
            </TabsContent>
            
            <TabsContent value="student" className="space-y-4">
              <StudentAttendanceTable userRole={userRole} />
            </TabsContent>
            
            <TabsContent value="staff" className="space-y-4">
              <StaffAttendanceTable userRole={userRole} />
            </TabsContent>
            
            <TabsContent value="visitor" className="space-y-4">
              <VisitorRecordsTable userRole={userRole} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManagement;