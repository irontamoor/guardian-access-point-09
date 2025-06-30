import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserCheck, Hourglass, Users, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { query } from "@/integrations/postgres/client";
import type { SystemUser, AttendanceRecord } from "@/integrations/postgres/types";

interface UserStatus {
  id: string;
  name: string;
  role: string;
  inStatus: boolean;
  departmentOrGrade?: string;
  company?: string | null;
  hostName?: string | null;
  purpose?: string | null;
}

const AdminActivityDashboard = () => {
  const [pickupQueue, setPickupQueue] = useState<UserStatus[]>([]);
  const [staffIn, setStaffIn] = useState<UserStatus[]>([]);
  const [visitorIn, setVisitorIn] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get all users
      const usersResult = await query("SELECT * FROM system_users WHERE status = 'active'");
      const users: SystemUser[] = usersResult.rows || [];

      // Get recent attendance records
      const attendanceResult = await query(`
        SELECT * FROM attendance_records 
        ORDER BY created_at DESC
      `);
      const attendance: AttendanceRecord[] = attendanceResult.rows || [];

      console.log("Fetched users:", users.map(u => ({id: u.id, role: u.role, status: u.status, name: `${u.first_name} ${u.last_name}`})));
      console.log("Fetched attendance records:", attendance.map(a => ({
        id: a.id,
        user_id: a.user_id,
        status: a.status,
        check_in_time: a.check_in_time,
        check_out_time: a.check_out_time
      })));

      // Map latest attendance record per user
      const attendanceMap: Record<string, AttendanceRecord> = {};
      attendance.forEach((row) => {
        if (!attendanceMap[row.user_id]) {
          attendanceMap[row.user_id] = row;
        }
      });

      // Pickup queue: students with status "in" and NOT checked out
      const pickupList: UserStatus[] = users
        .filter((u) => u.role === "student")
        .map((stu) => {
          const att = attendanceMap[stu.id];
          const inStatus = att && att.status === "in" && !att.check_out_time;
          console.log(`Student "${stu.first_name} ${stu.last_name}" (id: ${stu.id}) attendance status:`, att?.status, "inStatus:", inStatus);
          return {
            id: stu.id,
            name: `${stu.first_name} ${stu.last_name}`,
            role: "student",
            inStatus: !!inStatus,
            departmentOrGrade: stu.id,
          };
        })
        .filter((s) => s.inStatus);

      setPickupQueue(pickupList);

      // Staff in: staff members who are "in" and NOT checked out
      const staffInList: UserStatus[] = users
        .filter((u) => u.role === "staff")
        .map((staff) => {
          const att = attendanceMap[staff.id];
          const inStatus = att && att.status === "in" && !att.check_out_time;
          return {
            id: staff.id,
            name: `${staff.first_name} ${staff.last_name}`,
            role: "staff",
            inStatus: !!inStatus,
            departmentOrGrade: staff.id,
          };
        })
        .filter((s) => s.inStatus);

      setStaffIn(staffInList);

      // Visitors in: role: 'visitor', status: "in" and no check_out_time
      const visitorInList: UserStatus[] = users
        .filter((u) => u.role === "visitor")
        .map((visitor) => {
          const att = attendanceMap[visitor.id];
          const inStatus = att && att.status === "in" && !att.check_out_time;
          return {
            id: visitor.id,
            name: `${visitor.first_name} ${visitor.last_name}`,
            role: "visitor",
            inStatus: !!inStatus,
            company: att?.company ?? "",
            hostName: att?.host_name ?? "",
            purpose: att?.purpose ?? "",
          };
        })
        .filter((v) => v.inStatus);

      setVisitorIn(visitorInList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          onClick={fetchDashboardData}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            <Hourglass className="inline-block mr-2" />
            Pickup Queue
          </CardTitle>
          <CardDescription>Students currently waiting for pickup</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickupQueue.length > 0 ? (
                pickupQueue.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.departmentOrGrade}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-sm text-gray-500">
                    No students in pickup queue.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Users className="inline-block mr-2" />
            Visitors In
          </CardTitle>
          <CardDescription>Currently checked-in visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitorIn.length > 0 ? (
                visitorIn.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.company || <span className="text-gray-400">—</span>}</TableCell>
                    <TableCell>{v.hostName || <span className="text-gray-400">—</span>}</TableCell>
                    <TableCell>{v.purpose || <span className="text-gray-400">—</span>}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                    No visitors are currently checked in.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <UserCheck className="inline-block mr-2" />
            Staff In
          </CardTitle>
          <CardDescription>Employees/staff currently signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffIn.length > 0 ? (
                staffIn.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.departmentOrGrade}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-sm text-gray-500">
                    No staff currently in.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminActivityDashboard;
