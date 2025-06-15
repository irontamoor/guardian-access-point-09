
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  email?: string | null;
  phone?: string | null;
}

interface AttendanceRecord {
  id: string;
  user_id: string;
  status: string;
  check_in_time?: string | null;
  check_out_time?: string | null;
  created_at: string;
  created_by?: string | null;
  host_name?: string | null;
  company?: string | null;
  notes?: string | null;
  purpose?: string | null;
  system_user?: UserInfo;
}

export default function AttendanceRecordsTable() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      // Fetch all attendance records
      const { data: attendance, error: arError } = await supabase
        .from("attendance_records")
        .select("*")
        .order("created_at", { ascending: false });
      if (arError) throw arError;

      // Fetch all users referenced by current records
      const userIds = Array.from(new Set((attendance ?? []).map((rec: any) => rec.user_id)));
      let users: UserInfo[] = [];
      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from("system_users")
          .select("id, first_name, last_name, role, email, phone")
          .in("id", userIds);
        if (usersError) throw usersError;
        users = usersData || [];
      }

      // Merge
      const recordsWithUser = (attendance ?? []).map((rec: any) => ({
        ...rec,
        system_user: users.find(u => u.id === rec.user_id)
      }));

      setRecords(recordsWithUser);
    } catch (e: any) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>Showing all fields from attendance_records, joined with user info</CardDescription>
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
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Host Name</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-gray-500">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                      {rec.system_user
                        ? `${rec.system_user.first_name} ${rec.system_user.last_name}`
                        : rec.user_id}
                    </TableCell>
                    <TableCell>
                      {rec.system_user?.role || "-"}
                    </TableCell>
                    <TableCell>
                      {rec.system_user?.email ?? "-"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.status === "in"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {rec.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDateTime(rec.check_in_time)}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(rec.check_out_time)}
                    </TableCell>
                    <TableCell>
                      {rec.created_by || "-"}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(rec.created_at)}
                    </TableCell>
                    <TableCell>
                      {rec.company || "-"}
                    </TableCell>
                    <TableCell>
                      {rec.host_name || "-"}
                    </TableCell>
                    <TableCell>
                      {rec.purpose || "-"}
                    </TableCell>
                    <TableCell>
                      {rec.notes || "-"}
                    </TableCell>
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
