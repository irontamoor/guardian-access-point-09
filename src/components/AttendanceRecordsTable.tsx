
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SystemUser = Database['public']['Tables']['system_users']['Row'];
type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row'];
type Visitor = Database['public']['Tables']['visitors']['Row'];

interface AttendanceRecordWithUser extends AttendanceRecord {
  system_users?: SystemUser;
  visitors?: Visitor;
}

export default function AttendanceRecordsTable() {
  const [records, setRecords] = useState<AttendanceRecordWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      console.log('AttendanceRecordsTable: Fetching attendance records...');
      
      // Fetch all attendance records
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (attendanceError) throw attendanceError;
      console.log('AttendanceRecordsTable: Raw attendance records found:', attendance?.length || 0);
      console.log('AttendanceRecordsTable: Attendance data:', attendance);

      if (!attendance || attendance.length === 0) {
        setRecords([]);
        return;
      }

      // Get unique user IDs for lookups
      const userIds = Array.from(
        new Set(
          attendance
            ?.map((rec: any) => rec.user_id)
            .filter((id) => id) || []
        )
      );
      console.log('AttendanceRecordsTable: Unique user IDs:', userIds);

      // Fetch ALL system users and visitors, then filter
      const [systemUsersResponse, visitorsResponse] = await Promise.all([
        supabase.from('system_users').select('*'),
        supabase.from('visitors').select('*')
      ]);

      if (systemUsersResponse.error) {
        console.error('AttendanceRecordsTable: Error fetching system users:', systemUsersResponse.error);
      }
      
      if (visitorsResponse.error) {
        console.error('AttendanceRecordsTable: Error fetching visitors:', visitorsResponse.error);
      }

      const allSystemUsers = systemUsersResponse.data || [];
      const allVisitors = visitorsResponse.data || [];

      console.log('AttendanceRecordsTable: All system users found:', allSystemUsers.length);
      console.log('AttendanceRecordsTable: All visitors found:', allVisitors.length);
      console.log('AttendanceRecordsTable: All visitors data:', allVisitors);

      // Create lookup maps
      const systemUsersMap = new Map(allSystemUsers.map(user => [user.id, user]));
      const visitorsMap = new Map(allVisitors.map(visitor => [visitor.id, visitor]));

      console.log('AttendanceRecordsTable: System users map keys:', Array.from(systemUsersMap.keys()));
      console.log('AttendanceRecordsTable: Visitors map keys:', Array.from(visitorsMap.keys()));

      // Merge attendance records with user/visitor data
      const recordsWithUserData = attendance?.map((rec: any) => {
        const systemUser = systemUsersMap.get(rec.user_id);
        const visitor = visitorsMap.get(rec.user_id);
        
        console.log(`AttendanceRecordsTable: Record ${rec.id}: user_id=${rec.user_id}, found systemUser=${!!systemUser}, found visitor=${!!visitor}`);
        
        return {
          ...rec,
          system_users: systemUser || null,
          visitors: visitor || null,
        };
      }) || [];

      console.log('AttendanceRecordsTable: Records with user data:', recordsWithUserData.length);
      console.log('AttendanceRecordsTable: Final records:', recordsWithUserData);
      setRecords(recordsWithUserData);
    } catch (e: any) {
      console.error('AttendanceRecordsTable: Error fetching attendance records:', e);
      setError(e.message || "Failed to fetch attendance records.");
      toast({
        title: "Error",
        description: e.message || "Failed to fetch attendance records.",
        variant: "destructive",
      });
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDateTime = (dt?: string | null) =>
    dt ? new Date(dt).toLocaleString() : "-";

  const getPersonName = (record: AttendanceRecordWithUser) => {
    if (record.system_users) {
      return `${record.system_users.first_name} ${record.system_users.last_name}`;
    }
    if (record.visitors) {
      return `${record.visitors.first_name} ${record.visitors.last_name}`;
    }
    return `Unknown User (${record.user_id})`;
  };

  const getPersonType = (record: AttendanceRecordWithUser) => {
    if (record.system_users) {
      return record.system_users.role;
    }
    if (record.visitors) {
      return "visitor";
    }
    return "unknown";
  };

  const getContactInfo = (record: AttendanceRecordWithUser) => {
    if (record.system_users) {
      return record.system_users.email || "-";
    }
    if (record.visitors) {
      return record.visitors.phone_number || "-";
    }
    return "-";
  };

  const getOrganization = (record: AttendanceRecordWithUser) => {
    if (record.visitors) {
      return record.visitors.organization || "-";
    }
    return record.company || "-";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>Showing all attendance records including visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" onClick={fetchRecords} disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          {loading && <span className="text-blue-600 text-sm">Loading...</span>}
        </div>
        
        {error && <div className="text-red-700 bg-red-50 rounded p-2 mb-2">{error}</div>}
        
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Host Name</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>{getPersonName(rec)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getPersonType(rec) === "visitor"
                          ? "bg-purple-100 text-purple-800"
                          : getPersonType(rec) === "staff"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {getPersonType(rec)}
                      </span>
                    </TableCell>
                    <TableCell>{getContactInfo(rec)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.status === "in"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {rec.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDateTime(rec.check_in_time)}</TableCell>
                    <TableCell>{formatDateTime(rec.check_out_time)}</TableCell>
                    <TableCell>{formatDateTime(rec.created_at)}</TableCell>
                    <TableCell>{getOrganization(rec)}</TableCell>
                    <TableCell>{rec.host_name || rec.visitors?.host_name || "-"}</TableCell>
                    <TableCell>{rec.purpose || rec.visitors?.visit_purpose || "-"}</TableCell>
                    <TableCell>{rec.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
