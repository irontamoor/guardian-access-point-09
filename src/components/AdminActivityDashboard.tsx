
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserCheck, Hourglass, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SystemUser = Database['public']['Tables']['system_users']['Row'];
type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row'];

interface UserStatus {
  id: string;
  name: string;
  role: string;
  inStatus: boolean;
  // departmentOrGrade renamed to just "id"
  departmentOrGrade?: string;
}

const AdminActivityDashboard = () => {
  const [pickupQueue, setPickupQueue] = useState<UserStatus[]>([]);
  const [staffIn, setStaffIn] = useState<UserStatus[]>([]);
  const [visitorIn, setVisitorIn] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // 1. Get all users (students, staff, visitors)
      const { data: users, error: userError } = await supabase
        .from("system_users")
        .select("*");
      if (userError) return setLoading(false);

      // 2. Get all recent attendance_events, most recent per user
      const { data: attendance, error: attendanceError } = await supabase
        .from("attendance_records")
        .select("user_id, status, check_in_time, check_out_time")
        .order("created_at", { ascending: false });
      if (attendanceError) return setLoading(false);

      const attendanceMap: Record<string, AttendanceRecord> = {};
      (attendance || []).forEach((row: any) => {
        if (!attendanceMap[row.user_id]) {
          attendanceMap[row.user_id] = row;
        }
      });

      // Pickup queue: all students with status "in" (present)
      const pickupList: UserStatus[] = (users || [])
        .filter((u) => u.role === "student")
        .map((stu) => {
          const att = attendanceMap[stu.id];
          return {
            id: stu.id,
            name: `${stu.first_name} ${stu.last_name}`,
            role: "student",
            inStatus: att && att.status === "in" && !att.check_out_time,
            departmentOrGrade: stu.id, // only show ID
          };
        })
        .filter((s) => s.inStatus);

      setPickupQueue(pickupList);

      // Staff in: staff with status "in"
      const staffInList: UserStatus[] = (users || [])
        .filter((u) => u.role === "staff")
        .map((staff) => {
          const att = attendanceMap[staff.id];
          return {
            id: staff.id,
            name: `${staff.first_name} ${staff.last_name}`,
            role: "staff",
            inStatus: att && att.status === "in" && !att.check_out_time,
            departmentOrGrade: staff.id, // only show ID
          };
        })
        .filter((s) => s.inStatus);

      setStaffIn(staffInList);

      // Visitors in (future proof, could be on another table)
      setVisitorIn([]);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
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
          <CardDescription>Currently checked-in visitors (not implemented)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Visitor check-in/out is not yet implemented.</p>
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
