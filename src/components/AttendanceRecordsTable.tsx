
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

interface AttendanceRecordWithUser extends AttendanceRecord {
  system_users?: SystemUser;
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
      
      // Fetch all attendance records with new merged structure
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (attendanceError) throw attendanceError;
      console.log('AttendanceRecordsTable: Raw attendance records found:', attendance?.length || 0);

      if (!attendance || attendance.length === 0) {
        setRecords([]);
        return;
      }

      // Get system user data for records that reference system users
      const userIds = Array.from(
        new Set(
          attendance
            ?.filter(rec => !rec.first_name || !rec.last_name) // Only for records missing name data
            .map(rec => rec.user_id)
            .filter(id => id) || []
        )
      );

      let systemUsersMap = new Map();
      if (userIds.length > 0) {
        const { data: systemUsers } = await supabase
          .from('system_users')
          .select('*')
          .in('id', userIds);

        if (systemUsers) {
          systemUsersMap = new Map(systemUsers.map(user => [user.id, user]));
        }
      }

      // Merge attendance records with system user data where needed
      const recordsWithUserData = attendance?.map((rec: any) => {
        const systemUser = systemUsersMap.get(rec.user_id);
        
        return {
          ...rec,
          system_users: systemUser || null,
        };
      }) || [];

      console.log('AttendanceRecordsTable: Records with user data:', recordsWithUserData.length);
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
    // Use merged data first, then fall back to system user data
    if (record.first_name && record.last_name) {
      return `${record.first_name} ${record.last_name}`;
    }
    if (record.system_users) {
      return `${record.system_users.first_name} ${record.system_users.last_name}`;
    }
    return `Unknown User (${record.user_id})`;
  };

  const getPersonType = (record: AttendanceRecordWithUser) => {
    if (record.system_users) {
      return record.system_users.role;
    }
    // If we have visitor data (organization or visit_purpose), it's a visitor
    if (record.organization || record.visit_purpose) {
      return "visitor";
    }
    return "unknown";
  };

  const getContactInfo = (record: AttendanceRecordWithUser) => {
    if (record.phone_number) {
      return record.phone_number;
    }
    if (record.system_users) {
      return record.system_users.email || "-";
    }
    return "-";
  };

  const getOrganization = (record: AttendanceRecordWithUser) => {
    return record.organization || record.company || "-";
  };

  const getPurpose = (record: AttendanceRecordWithUser) => {
    return record.visit_purpose || record.purpose || "-";
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
                    <TableCell>{rec.host_name || "-"}</TableCell>
                    <TableCell>{getPurpose(rec)}</TableCell>
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
