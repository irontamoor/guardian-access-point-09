
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserCheck, Hourglass, Users, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SystemUser = Database['public']['Tables']['system_users']['Row'];
type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row'];

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

  // Extract fetch logic so it can be used in both useEffect and a refresh button
  const fetchDashboardData = async () => {
    setLoading(true);
    // 1. Get all users (students, staff, visitors)
    const { data: users, error: userError } = await supabase
      .from("system_users")
      .select("*");
    if (userError) {
      setLoading(false);
      return;
    }

    // 2. Get all recent attendance_events, most recent per user
    const { data: attendance, error: attendanceError } = await supabase
      .from("attendance_records")
      .select("id, user_id, status, check_in_time, check_out_time, company, host_name, purpose")
      .order("created_at", { ascending: false });
    if (attendanceError) {
      setLoading(false);
      return;
    }

    console.log("Fetched users:", users);
    console.log("Fetched attendance records:", attendance);

    // Map latest attendance record per user
    const attendanceMap: Record<string, AttendanceRecord> = {};
    (attendance || []).forEach((row: any) => {
      if (!attendanceMap[row.user_id]) {
        attendanceMap[row.user_id] = row;
      }
    });

    // Pickup queue: students who are "in" and NOT checked out
    const pickupList: UserStatus[] = (users || [])
      .filter((u) => u.role === "student")
      .map((stu) => {
        const att = attendanceMap[stu.id];
        // Only present if last record is status "in" and check_out_time is empty
        return {
          id: stu.id,
          name: `${stu.first_name} ${stu.last_name}`,
          role: "student",
          inStatus: att && att.status === "in" && !att.check_out_time,
          departmentOrGrade: stu.id,
        };
      })
      .filter((s) => s.inStatus);

    setPickupQueue(pickupList);

    // Staff in: staff members who are "in" and NOT checked out
    const staffInList: UserStatus[] = (users || [])
      .filter((u) => u.role === "staff")
      .map((staff) => {
        const att = attendanceMap[staff.id];
        return {
          id: staff.id,
          name: `${staff.first_name} ${staff.last_name}`,
          role: "staff",
          inStatus: att && att.status === "in" && !att.check_out_time,
          departmentOrGrade: staff.id,
        };
      })
      .filter((s) => s.inStatus);

    console.log("Staff In List after processing:", staffInList);

    setStaffIn(staffInList);

    // Visitors in: role: 'visitor', status: "in" and no check_out_time
    const visitorInList: UserStatus[] = (users || [])
      .filter((u) => u.role === "visitor")
      .map((visitor) => {
        const att = attendanceMap[visitor.id];
        return {
          id: visitor.id,
          name: `${visitor.first_name} ${visitor.last_name}`,
          role: "visitor",
          inStatus: att && att.status === "in" && !att.check_out_time,
          company: att?.company ?? "",
          hostName: att?.host_name ?? "",
          purpose: att?.purpose ?? "",
        };
      })
      .filter((v) => v.inStatus);

    setVisitorIn(visitorInList);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Refresh Button */}
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

